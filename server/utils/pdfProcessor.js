import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import pdf2json from 'pdf2json';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

let pdfPopplerConvert = null;
let PDFLib = null;
try {
  // pdf-poppler exposes a convert function
  // Lazy-load so the app still runs if poppler is not installed in the system
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pdfPoppler = await import('pdf-poppler');
  pdfPopplerConvert = pdfPoppler?.default?.convert || pdfPoppler?.convert || null;
} catch (e) {
  // Optional dependency; we'll warn only when OCR is attempted
}
try {
  // Lazy import pdf-lib for hyperlink extraction via annotations
  PDFLib = await import('pdf-lib');
} catch (e) {
  // Optional; warn only when extracting links
}

class PDFProcessor {
  async extractTextFromPDF(buffer) {
    try {
      console.log('📄 Processing PDF buffer...');
      console.log('📊 Buffer size:', buffer.length, 'bytes');

      // Suppress noisy pdf.js warnings during parsing
      const originalWarn = console.warn;
      const originalError = console.error;
      const mutePatterns = [
        'TT: undefined function',
        'Unsupported: field.type of Link',
        'NOT valid form element',
        'Setting up fake worker.'
      ];
      console.warn = (...args) => {
        const msg = args && args[0] ? String(args[0]) : '';
        if (mutePatterns.some(p => msg.includes(p))) return;
        return originalWarn.apply(console, args);
      };
      console.error = (...args) => {
        const msg = args && args[0] ? String(args[0]) : '';
        if (mutePatterns.some(p => msg.includes(p))) return; // demote certain pdf warnings
        return originalError.apply(console, args);
      };

      // Try multiple extraction methods with hyperlinks
      let result = { text: '', hyperlinks: [] };

      // Method 1: pdf-parse with basic text extraction
      try {
        const data = await pdfParse(buffer);
        if (data.text && data.text.trim().length > 50) {
          console.log('✅ pdf-parse extracted text length:', data.text.length);
          // Extract hyperlinks using pdf2json for more detailed structure
          const hyperlinkData = await this.extractWithPdf2jsonAndHyperlinks(buffer);
          result = {
            text: this.cleanExtractedText(data.text.trim()),
            hyperlinks: hyperlinkData.hyperlinks
          };
          console.log('🔗 Found', result.hyperlinks.length, 'hyperlinks');
          return result;
        }
      } catch (err) {
        console.error('❌ pdf-parse failed:', err);
      }

      // Method 2: pdf2json with full hyperlink support
      if (!result.text || result.text.length < 50) {
        console.log('🔄 Trying pdf2json with hyperlink extraction...');
        try {
          result = await this.extractWithPdf2jsonAndHyperlinks(buffer);
          console.log('✅ pdf2json extracted text length:', result.text.length);
          console.log('🔗 Found', result.hyperlinks.length, 'hyperlinks');

          if (result.text.length > 50) {
            result.text = this.cleanExtractedText(result.text);
            return result;
          }
        } catch (err) {
          console.error('❌ pdf2json failed:', err);
        }
      }

      // Method 3: OCR fallback
      if (!result.text || result.text.length < 50) {
        console.log('🔍 No sufficient text found, running OCR fallback...');
        const ocrText = await this.extractTextWithOCR(buffer);
        console.log('✅ OCR extracted text length:', ocrText.length);
        result.text = ocrText;
      }

      result.text = this.cleanExtractedText(result.text);
      return result;
    } catch (error) {
      console.error('❌ PDF processing error:', error);
      throw new Error('PDF processing failed: ' + error.message);
    }
    finally {
      // Restore console methods
      // eslint-disable-next-line no-unsafe-finally
      if (typeof originalWarn === 'function') console.warn = originalWarn;
      // eslint-disable-next-line no-unsafe-finally
      if (typeof originalError === 'function') console.error = originalError;
    }
  }

  async extractWithPdf2json(buffer) {
    // Build more structured text by grouping characters on the same visual line
    return new Promise((resolve, reject) => {
      const pdfParser = new pdf2json();

      pdfParser.on('pdfParser_dataError', errData => {
        reject(new Error(errData.parserError));
      });

      pdfParser.on('pdfParser_dataReady', pdfData => {
        try {
          const pageTexts = [];
          const pages = Array.isArray(pdfData.Pages) ? pdfData.Pages : [];

          pages.forEach(page => {
            const linesMap = new Map();
            const epsilon = 0.5; // y-coordinate tolerance to group same line

            const texts = Array.isArray(page.Texts) ? page.Texts : [];
            texts.forEach(t => {
              const y = t.y || 0;
              const x = t.x || 0;
              const content = (t.R || []).map(r => decodeURIComponent(r.T || '')).join('');
              if (!content) return;

              // find existing line key within epsilon
              let lineKey = null;
              for (const key of linesMap.keys()) {
                if (Math.abs(key - y) < epsilon) { lineKey = key; break; }
              }
              if (lineKey === null) lineKey = y;

              if (!linesMap.has(lineKey)) linesMap.set(lineKey, []);
              linesMap.get(lineKey).push({ x, content });
            });

            // sort lines by y, and segments by x
            const sortedLines = [...linesMap.entries()]
              .sort((a, b) => a[0] - b[0])
              .map(([, segments]) => segments.sort((s1, s2) => s1.x - s2.x).map(s => s.content).join(' ').trim());

            pageTexts.push(sortedLines.join('\n'));
          });

          const text = pageTexts.join('\n\n').trim();
          resolve(text);
        } catch (err) {
          reject(err);
        }
      });

      pdfParser.parseBuffer(buffer);
    });
  }

  async extractWithPdf2jsonAndHyperlinks(buffer) {
    // Enhanced version that extracts both text and hyperlinks with positioning
    return new Promise((resolve, reject) => {
      const pdfParser = new pdf2json();

      pdfParser.on('pdfParser_dataError', errData => {
        reject(new Error(errData.parserError));
      });

      pdfParser.on('pdfParser_dataReady', pdfData => {
        try {
          const pageTexts = [];
          const hyperlinks = [];
          const pages = Array.isArray(pdfData.Pages) ? pdfData.Pages : [];

          pages.forEach((page, pageIndex) => {
            const linesMap = new Map();
            const epsilon = 0.5; // y-coordinate tolerance to group same line
            let currentTextLength = pageTexts.join('\n\n').length + (pageIndex > 0 ? 2 : 0); // Track position in final text

            // Extract hyperlinks from this page
            const links = Array.isArray(page.Links) ? page.Links : [];
            links.forEach(link => {
              if (link.uri || link.url) {
                const url = link.uri || link.url;
                const linkData = {
                  url: decodeURIComponent(url),
                  page: pageIndex + 1,
                  x: link.x || 0,
                  y: link.y || 0,
                  width: link.w || 0,
                  height: link.h || 0,
                  position: null // Will be calculated after text positioning
                };
                hyperlinks.push(linkData);
              }
            });

            // Process text elements and track their positions
            const texts = Array.isArray(page.Texts) ? page.Texts : [];
            const textElements = [];
            
            texts.forEach(t => {
              const y = t.y || 0;
              const x = t.x || 0;
              const content = (t.R || []).map(r => decodeURIComponent(r.T || '')).join('');
              if (!content) return;

              textElements.push({ x, y, content });

              // find existing line key within epsilon
              let lineKey = null;
              for (const key of linesMap.keys()) {
                if (Math.abs(key - y) < epsilon) { lineKey = key; break; }
              }
              if (lineKey === null) lineKey = y;

              if (!linesMap.has(lineKey)) linesMap.set(lineKey, []);
              linesMap.get(lineKey).push({ x, content });
            });

            // Sort lines by y, and segments by x
            const sortedLines = [...linesMap.entries()]
              .sort((a, b) => a[0] - b[0])
              .map(([, segments]) => segments.sort((s1, s2) => s1.x - s2.x).map(s => s.content).join(' ').trim());

            const pageText = sortedLines.join('\n');
            
            // Calculate hyperlink positions in the text
            hyperlinks.forEach(link => {
              if (link.page === pageIndex + 1) {
                // Find the closest text element to this hyperlink
                let closestTextIndex = -1;
                let minDistance = Infinity;
                
                textElements.forEach((textEl, textIndex) => {
                  const distance = Math.sqrt(
                    Math.pow(link.x - textEl.x, 2) + Math.pow(link.y - textEl.y, 2)
                  );
                  if (distance < minDistance) {
                    minDistance = distance;
                    closestTextIndex = textIndex;
                  }
                });

                if (closestTextIndex >= 0) {
                  // Calculate approximate position in the final text
                  let approximatePosition = currentTextLength;
                  
                  // Add up lengths of lines before the line containing this link
                  const linkY = link.y;
                  const sortedLinesWithY = [...linesMap.entries()].sort((a, b) => a[0] - b[0]);
                  
                  for (let i = 0; i < sortedLinesWithY.length; i++) {
                    const [lineY, segments] = sortedLinesWithY[i];
                    if (Math.abs(lineY - linkY) < epsilon) {
                      // This is the line containing the link
                      const lineText = segments.sort((s1, s2) => s1.x - s2.x).map(s => s.content).join(' ').trim();
                      
                      // Try to find the link text within this line
                      const linkSegments = segments.filter(seg => 
                        Math.abs(seg.x - link.x) < 2 // Small tolerance for x position
                      );
                      
                      if (linkSegments.length > 0) {
                        const beforeSegments = segments.filter(seg => seg.x < link.x);
                        const beforeText = beforeSegments.sort((s1, s2) => s1.x - s2.x).map(s => s.content).join(' ');
                        approximatePosition += beforeText.length;
                      }
                      break;
                    } else if (lineY < linkY) {
                      // Add length of this line plus newline
                      const lineText = segments.sort((s1, s2) => s1.x - s2.x).map(s => s.content).join(' ').trim();
                      approximatePosition += lineText.length + 1; // +1 for newline
                    }
                  }
                  
                  link.position = approximatePosition;
                  link.linkText = this.extractLinkText(textElements, link);
                }
              }
            });

            pageTexts.push(pageText);
            currentTextLength = pageTexts.join('\n\n').length;
          });

          const text = pageTexts.join('\n\n').trim();
          
          // Filter out hyperlinks that couldn't be positioned and add URL detection
          const validHyperlinks = hyperlinks.filter(link => link.position !== null);
          
          // Also detect URLs in the text that might not have explicit link annotations
          const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[\w.-]+@[\w.-]+\.[\w]+)/gi;
          let match;
          while ((match = urlRegex.exec(text)) !== null) {
            const url = match[0];
            const position = match.index;
            
            // Check if this URL is not already captured as a hyperlink
            const isDuplicate = validHyperlinks.some(link => 
              Math.abs(link.position - position) < 10 && 
              (link.url.includes(url) || url.includes(link.url))
            );
            
            if (!isDuplicate) {
              validHyperlinks.push({
                url: url.startsWith('www.') ? `https://${url}` : url,
                position,
                linkText: url,
                page: null, // Text-detected, page unknown
                x: null,
                y: null,
                width: null,
                height: null
              });
            }
          }

          // Sort hyperlinks by position
          validHyperlinks.sort((a, b) => (a.position || 0) - (b.position || 0));

          resolve({
            text,
            hyperlinks: validHyperlinks
          });
        } catch (err) {
          reject(err);
        }
      });

      pdfParser.parseBuffer(buffer);
    });
  }

  extractLinkText(textElements, link) {
    // Try to extract the actual text that represents this hyperlink
    const tolerance = 2; // Coordinate tolerance
    
    const nearbyElements = textElements.filter(el => 
      Math.abs(el.x - link.x) <= tolerance && 
      Math.abs(el.y - link.y) <= tolerance
    );
    
    if (nearbyElements.length > 0) {
      return nearbyElements.map(el => el.content).join(' ').trim();
    }
    
    // Fallback: try to extract from URL
    const url = link.url;
    if (url) {
      // For emails, return the email
      if (url.includes('@') && !url.startsWith('http')) {
        return url;
      }
      // For URLs, try to extract meaningful text
      if (url.startsWith('http')) {
        try {
          const urlObj = new URL(url);
          return urlObj.hostname;
        } catch {
          return url;
        }
      }
    }
    
    return link.url || 'Link';
  }

  // Best-effort: try to find an embedded image and persist it to /uploads
  async extractFirstImageToFile(buffer) {
    try {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const data = await new Promise((resolve, reject) => {
        const parser = new pdf2json();
        parser.on('pdfParser_dataError', err => reject(new Error(err.parserError)));
        parser.on('pdfParser_dataReady', pdfData => resolve(pdfData));
        parser.parseBuffer(buffer);
      });

      const pageArray = Array.isArray(data?.Pages) ? data.Pages : [];
      const candidateKeys = ['Images', 'Image', 'Imgs', 'XObject', 'xObject'];

      for (const page of pageArray) {
        for (const key of candidateKeys) {
          const value = page?.[key];
          if (!value) continue;
          const imageArray = Array.isArray(value) ? value : (Array.isArray(value?.List) ? value.List : []);
          for (const img of imageArray) {
            const dataUri = img?.src || img?.dataURI || img?.DataURI || img?.dataUrl || img?.dataURL;
            if (typeof dataUri === 'string' && dataUri.startsWith('data:image/')) {
              const match = dataUri.match(/^data:(image\/[a-zA-Z]+);base64,(.*)$/);
              if (!match) continue;
              const ext = match[1].split('/')[1].toLowerCase();
              const base64 = match[2];
              const filename = `resume-photo-${Date.now()}.${ext}`;
              const filePath = path.join(uploadDir, filename);
              fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
              console.log('🖼️ Extracted embedded data-URI image from pdf2json');
              return `/uploads/${filename}`;
            }
          }
        }
      }
      // Fallback: scan PDF buffer for embedded JPEG/PNG/WEBP by magic bytes
      const tryMagic = this.extractEmbeddedImageByMagic(buffer, uploadDir);
      if (tryMagic) return tryMagic;
      return null;
    } catch (err) {
      console.warn('⚠️ No embedded image extracted from PDF:', err.message);
      return null;
    }
  }

  // Extract multiple embedded images and persist them to /uploads, return array of relative URLs
  async extractAllImagesToFiles(buffer, maxImages = 6) {
    try {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const urls = [];

      // Try via pdf2json dataURIs
      try {
        const data = await new Promise((resolve, reject) => {
          const parser = new pdf2json();
          parser.on('pdfParser_dataError', err => reject(new Error(err.parserError)));
          parser.on('pdfParser_dataReady', pdfData => resolve(pdfData));
          parser.parseBuffer(buffer);
        });

        const pageArray = Array.isArray(data?.Pages) ? data.Pages : [];
        const candidateKeys = ['Images', 'Image', 'Imgs', 'XObject', 'xObject'];
        for (const page of pageArray) {
          for (const key of candidateKeys) {
            const value = page?.[key];
            if (!value) continue;
            const imageArray = Array.isArray(value) ? value : (Array.isArray(value?.List) ? value.List : []);
            for (const img of imageArray) {
              const dataUri = img?.src || img?.dataURI || img?.DataURI || img?.dataUrl || img?.dataURL;
              if (typeof dataUri === 'string' && dataUri.startsWith('data:image/')) {
                const match = dataUri.match(/^data:(image\/[a-zA-Z]+);base64,(.*)$/);
                if (!match) continue;
                const ext = match[1].split('/')[1].toLowerCase();
                const base64 = match[2];
                const filename = `resume-photo-${Date.now()}-${urls.length + 1}.${ext}`;
                const filePath = path.join(uploadDir, filename);
                fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
                urls.push(`/uploads/${filename}`);
                if (urls.length >= maxImages) return urls;
              }
            }
          }
        }
      } catch (e) {
        console.warn('⚠️ pdf2json image array extraction failed:', e.message);
      }

      // Fallback: scan buffer by magic bytes for multiple candidates
      const candidates = this.findEmbeddedImageCandidatesByMagic(buffer);
      candidates.sort((a, b) => b.size - a.size);
      for (const c of candidates.slice(0, Math.max(0, maxImages - urls.length))) {
        const filename = `resume-photo-${Date.now()}-${urls.length + 1}.${c.ext}`;
        fs.writeFileSync(path.join(uploadDir, filename), buffer.slice(c.start, c.end));
        urls.push(`/uploads/${filename}`);
      }

      return urls;
    } catch (err) {
      console.warn('⚠️ extractAllImagesToFiles failed:', err.message);
      return [];
    }
  }

  extractEmbeddedImageByMagic(buffer, uploadDir) {
    const candidates = [];
    // JPEG: FF D8 ... FF D9
    for (let i = 0; i < buffer.length - 1; i++) {
      if (buffer[i] === 0xFF && buffer[i + 1] === 0xD8) {
        for (let j = i + 2; j < buffer.length - 1; j++) {
          if (buffer[j] === 0xFF && buffer[j + 1] === 0xD9) {
            const size = j + 2 - i;
            if (size > 2 * 1024 && size < 10 * 1024 * 1024) {
              candidates.push({ start: i, end: j + 2, ext: 'jpg', size });
            }
            i = j + 1;
            break;
          }
        }
      }
    }
    // PNG: 89 50 4E 47 0D 0A 1A 0A ... IEND AE 42 60 82
    const pngSig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    for (let i = 0; i < buffer.length - pngSig.length; i++) {
      if (buffer.slice(i, i + pngSig.length).equals(pngSig)) {
        // search for IEND trailer
        for (let j = i + pngSig.length; j < buffer.length - 8; j++) {
          if (buffer[j] === 0x49 && buffer[j + 1] === 0x45 && buffer[j + 2] === 0x4E && buffer[j + 3] === 0x44 &&
            buffer[j + 4] === 0xAE && buffer[j + 5] === 0x42 && buffer[j + 6] === 0x60 && buffer[j + 7] === 0x82) {
            const size = j + 8 - i;
            if (size > 2 * 1024 && size < 10 * 1024 * 1024) {
              candidates.push({ start: i, end: j + 8, ext: 'png', size });
            }
            i = j + 7;
            break;
          }
        }
      }
    }
    // WEBP: RIFF xxxx WEBP
    const riff = Buffer.from('RIFF');
    const webp = Buffer.from('WEBP');
    for (let i = 0; i < buffer.length - 12; i++) {
      if (buffer.slice(i, i + 4).equals(riff) && buffer.slice(i + 8, i + 12).equals(webp)) {
        const sizeLE = buffer.readUInt32LE(i + 4); // size of RIFF chunk excluding 8 bytes
        const total = sizeLE + 8;
        const end = i + total;
        if (end <= buffer.length && total > 2 * 1024 && total < 10 * 1024 * 1024) {
          candidates.push({ start: i, end, ext: 'webp', size: total });
          i = end - 1;
        }
      }
    }

    if (candidates.length === 0) return null;
    // pick the largest sensible candidate (likely the headshot)
    candidates.sort((a, b) => b.size - a.size);
    const best = candidates[0];
    const filename = `resume-photo-${Date.now()}.${best.ext}`;
    fs.writeFileSync(path.join(uploadDir, filename), buffer.slice(best.start, best.end));
    console.log(`🖼️ Extracted embedded image by magic bytes: ${best.ext}, ${Math.round(best.size / 1024)}KB`);
    return `/uploads/${filename}`;
  }

  findEmbeddedImageCandidatesByMagic(buffer) {
    const candidates = [];
    // JPEG
    for (let i = 0; i < buffer.length - 1; i++) {
      if (buffer[i] === 0xFF && buffer[i + 1] === 0xD8) {
        for (let j = i + 2; j < buffer.length - 1; j++) {
          if (buffer[j] === 0xFF && buffer[j + 1] === 0xD9) {
            const size = j + 2 - i;
            if (size > 2 * 1024 && size < 10 * 1024 * 1024) candidates.push({ start: i, end: j + 2, ext: 'jpg', size });
            i = j + 1; break;
          }
        }
      }
    }
    // PNG
    const pngSig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    for (let i = 0; i < buffer.length - pngSig.length; i++) {
      if (buffer.slice(i, i + pngSig.length).equals(pngSig)) {
        for (let j = i + pngSig.length; j < buffer.length - 8; j++) {
          if (buffer[j] === 0x49 && buffer[j + 1] === 0x45 && buffer[j + 2] === 0x4E && buffer[j + 3] === 0x44 &&
              buffer[j + 4] === 0xAE && buffer[j + 5] === 0x42 && buffer[j + 6] === 0x60 && buffer[j + 7] === 0x82) {
            const size = j + 8 - i;
            if (size > 2 * 1024 && size < 10 * 1024 * 1024) candidates.push({ start: i, end: j + 8, ext: 'png', size });
            i = j + 7; break;
          }
        }
      }
    }
    // WEBP
    const riff = Buffer.from('RIFF');
    const webp = Buffer.from('WEBP');
    for (let i = 0; i < buffer.length - 12; i++) {
      if (buffer.slice(i, i + 4).equals(riff) && buffer.slice(i + 8, i + 12).equals(webp)) {
        const sizeLE = buffer.readUInt32LE(i + 4);
        const total = sizeLE + 8; const end = i + total;
        if (end <= buffer.length && total > 2 * 1024 && total < 10 * 1024 * 1024) {
          candidates.push({ start: i, end, ext: 'webp', size: total });
          i = end - 1;
        }
      }
    }
    return candidates;
  }

  cleanExtractedText(text) {
    if (!text) return '';
    let t = String(text);
    // Normalize URL-breaking hyphens and artifacts
    t = t.replace(/\u00AD/g, ''); // soft hyphen
    // Preserve line structure: collapse excessive blank lines, trim line ends
    t = t
      .split('\n')
      .map(line => line.replace(/\s+/g, ' ').trimEnd())
      .join('\n');
    t = t.replace(/\n{3,}/g, '\n\n');
    // Space between camelCase and digits stuck to words, but keep URLs/emails intact
    t = t.replace(/(\b[a-z])([A-Z]\b)/g, '$1 $2');
    t = t.replace(/(\D)(\d)([A-Z])/g, '$1$2 $3');
    return t.trim();
  }

  async extractTextWithOCR(buffer) {
    try {
      // Ensure we have rasterization available
      if (!pdfPopplerConvert) {
        console.warn('⚠️ pdf-poppler not available. Install system poppler-utils and the pdf-poppler package to enable OCR.');
        return '';
      }

      // Write PDF buffer to a temporary file
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-ocr-'));
      const pdfPath = path.join(tmpDir, 'input.pdf');
      fs.writeFileSync(pdfPath, buffer);

      // Convert all pages to PNG images
      const outPrefix = 'page';
      const opts = {
        format: 'png',
        out_dir: tmpDir,
        out_prefix: outPrefix,
        page: null // all pages
      };

      console.log('🔄 Rasterizing PDF pages for OCR...');
      await pdfPopplerConvert(pdfPath, opts);

      // Collect generated images in order: page-1.png, page-2.png, ... (pdf-poppler naming)
      const files = fs.readdirSync(tmpDir)
        .filter(f => f.toLowerCase().endsWith('.png') && f.startsWith(outPrefix + '-'))
        .sort((a, b) => {
          const an = parseInt(a.replace(/[^0-9]/g, ''), 10) || 0;
          const bn = parseInt(b.replace(/[^0-9]/g, ''), 10) || 0;
          return an - bn;
        });

      if (files.length === 0) {
        console.warn('⚠️ No rasterized images produced for OCR.');
        return '';
      }

      console.log(`🔍 Running Tesseract OCR on ${files.length} pages...`);
      let fullText = '';
      for (const file of files) {
        const imagePath = path.join(tmpDir, file);
        try {
          const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
            logger: () => {}
          });
          if (text && text.trim()) {
            fullText += (fullText ? '\n\n' : '') + text.trim();
          }
        } catch (ocrErr) {
          console.warn(`⚠️ OCR failed for ${file}:`, ocrErr.message);
        }
      }

      // Cleanup temporary directory best-effort
      try {
        files.forEach(f => {
          try { fs.unlinkSync(path.join(tmpDir, f)); } catch {}
        });
        try { fs.unlinkSync(pdfPath); } catch {}
        try { fs.rmdirSync(tmpDir); } catch {}
      } catch {}

      return fullText;
    } catch (error) {
      console.error('❌ OCR extraction error:', error);
      return '';
    }
  }

  // Method to get complete PDF data including text, hyperlinks, and images
  async extractAllPDFData(buffer) {
    try {
      console.log('🔄 Extracting complete PDF data (text, hyperlinks, images)...');
      
      // Extract text and hyperlinks
      const textData = await this.extractTextFromPDF(buffer);
      // Try to augment hyperlinks using pdf-lib annotations
      let pdfLibLinks = [];
      try {
        pdfLibLinks = await this.extractHyperlinksWithPdfLib(buffer);
      } catch (e) {
        console.warn('⚠️ pdf-lib hyperlink extraction failed:', e.message);
      }
      
      // Extract images
      const images = await this.extractAllImagesToFiles(buffer);
      
      const result = {
        text: textData.text || textData, // Handle both old and new format
        hyperlinks: [...(textData.hyperlinks || []), ...pdfLibLinks],
        images: images || []
      };
      
      console.log('✅ Complete PDF extraction finished:');
      console.log(`   📄 Text length: ${result.text.length} characters`);
      console.log(`   🔗 Hyperlinks found: ${result.hyperlinks.length}`);
      console.log(`   🖼️ Images extracted: ${result.images.length}`);
      
      return result;
    } catch (error) {
      console.error('❌ Complete PDF extraction failed:', error);
      throw error;
    }
  }

  // Method to create formatted text with hyperlink placeholders
  createFormattedTextWithHyperlinks(text, hyperlinks) {
    if (!hyperlinks || hyperlinks.length === 0) {
      return {
        formattedText: text,
        linkMap: {}
      };
    }
    
    let formattedText = text;
    const linkMap = {};
    let offset = 0;
    
    // Sort hyperlinks by position (descending) to avoid position shifts when inserting
    const sortedLinks = [...hyperlinks].sort((a, b) => (b.position || 0) - (a.position || 0));
    
    sortedLinks.forEach((link, index) => {
      const linkId = `LINK_${index + 1}`;
      const linkText = link.linkText || link.url;
      const position = link.position || 0;
      
      // Store link information
      linkMap[linkId] = {
        url: link.url,
        text: linkText,
        originalPosition: position,
        page: link.page
      };
      
      // Create a placeholder for the hyperlink
      const placeholder = `[${linkText}](${linkId})`;
      
      // Insert the placeholder at the correct position
      const beforeText = formattedText.substring(0, position);
      const afterText = formattedText.substring(position);
      
      // Find if there's already similar text at this position to replace
      const nearbyText = afterText.substring(0, Math.min(linkText.length + 20, afterText.length));
      const textToReplace = this.findBestTextMatch(nearbyText, linkText);
      
      if (textToReplace) {
        const replaceIndex = afterText.indexOf(textToReplace);
        if (replaceIndex >= 0 && replaceIndex < 20) { // Only replace if it's very close
          formattedText = beforeText + placeholder + afterText.substring(replaceIndex + textToReplace.length);
        } else {
          formattedText = beforeText + placeholder + ' ' + afterText;
        }
      } else {
        formattedText = beforeText + placeholder + ' ' + afterText;
      }
    });
    
    return {
      formattedText,
      linkMap
    };
  }

  // Helper method to find the best text match for hyperlink replacement
  findBestTextMatch(text, linkText) {
    if (!text || !linkText) return null;
    
    // Direct match
    if (text.toLowerCase().includes(linkText.toLowerCase())) {
      const startIndex = text.toLowerCase().indexOf(linkText.toLowerCase());
      return text.substring(startIndex, startIndex + linkText.length);
    }
    
    // Try to match URL parts
    if (linkText.includes('://')) {
      try {
        const url = new URL(linkText);
        if (text.toLowerCase().includes(url.hostname.toLowerCase())) {
          const startIndex = text.toLowerCase().indexOf(url.hostname.toLowerCase());
          return text.substring(startIndex, startIndex + url.hostname.length);
        }
      } catch {
        // URL parsing failed, continue
      }
    }
    
    // Try to match email
    if (linkText.includes('@') && text.toLowerCase().includes(linkText.toLowerCase())) {
      const startIndex = text.toLowerCase().indexOf(linkText.toLowerCase());
      return text.substring(startIndex, startIndex + linkText.length);
    }
    
    return null;
  }

  async extractHyperlinksWithPdfLib(buffer) {
    try {
      if (!PDFLib || !PDFLib.PDFDocument) {
        console.warn('⚠️ pdf-lib not available. Install pdf-lib to enable annotation-based hyperlink extraction.');
        return [];
      }
      const { PDFDocument, PDFName, PDFArray, PDFDict, PDFString } = PDFLib;
      const pdfDoc = await PDFDocument.load(buffer, { updateMetadata: false, throwOnInvalidObject: false });
      const pages = pdfDoc.getPages();
      const links = [];
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const node = page.node;
        const annots = node.Annots && node.Annots();
        if (!annots) continue;
        const annotsArray = annots instanceof PDFArray ? annots : null;
        if (!annotsArray) continue;
        for (let j = 0; j < annotsArray.size(); j++) {
          const ref = annotsArray.get(j);
          const annot = pdfDoc.context.lookup(ref);
          const dict = annot instanceof PDFDict ? annot : null;
          if (!dict) continue;
          const subtype = dict.get(PDFName.of('Subtype'));
          if (!subtype || String(subtype) !== '/Link') continue;

          // Action dictionary
          const A = dict.get(PDFName.of('A'));
          let uri = null;
          if (A && A.lookup) {
            const action = A.lookup ? A.lookup(PDFName.of('URI')) : null;
            if (action && action instanceof PDFString) {
              uri = action.decodeText ? action.decodeText() : action.value;
            }
          } else if (A && A.get) {
            const uriObj = A.get(PDFName.of('URI'));
            if (uriObj && uriObj instanceof PDFString) {
              uri = uriObj.decodeText ? uriObj.decodeText() : uriObj.value;
            }
          }
          if (!uri) {
            // Some PDFs store URI in dict under 'Dest' or other fields; skip if missing
            continue;
          }

          // Rectangle
          let rect = dict.get(PDFName.of('Rect'));
          let x = null, y = null, w = null, h = null;
          if (rect && rect.lookup && rect.asArray) {
            const arr = rect.asArray();
            if (Array.isArray(arr) && arr.length >= 4) {
              const [x1, y1, x2, y2] = arr.map(n => Number(n) || 0);
              x = Math.min(x1, x2);
              y = Math.min(y1, y2);
              w = Math.abs(x2 - x1);
              h = Math.abs(y2 - y1);
            }
          }

          links.push({ url: uri, page: i + 1, x, y, width: w, height: h, position: null, linkText: uri });
        }
      }
      return links;
    } catch (e) {
      console.warn('⚠️ extractHyperlinksWithPdfLib error:', e.message);
      return [];
    }
  }
}

const pdfProcessor = new PDFProcessor();
export default pdfProcessor;
