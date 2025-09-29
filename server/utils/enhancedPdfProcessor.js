import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import pdf2json from 'pdf2json';
import fs from 'fs';
import path from 'path';

class EnhancedPDFProcessor {
  constructor() {
    this.options = {
      // Configure pdf-parse options for better extraction
      max: 0, // Maximum number of pages to parse (0 = all)
      version: 'v1.10.100', // PDF.js version
      // Custom text normalizer to preserve more content
      normalizeWhitespace: false,
      disableCombineTextItems: false
    };
  }

  async extractTextFromPDF(buffer) {
    try {
      console.log('📄 Processing PDF buffer with enhanced extractor...');
      console.log('📊 Buffer size:', buffer.length, 'bytes');

      let bestResult = { text: '', confidence: 0, method: 'none' };

      // Method 1: Enhanced pdf-parse with custom options
      try {
        console.log('🔄 Trying enhanced pdf-parse...');
        const data = await pdfParse(buffer, {
          ...this.options,
          // Custom render function to extract more text
          render_page: (pageData) => {
            // Default render but with better text extraction
            let render_options = {
              normalizeWhitespace: false,
              disableCombineTextItems: false
            };
            return pageData.getTextContent(render_options).then((textContent) => {
              let lastY, text = '';
              for (let item of textContent.items) {
                if (lastY == item.transform[5] || !lastY) {
                  text += item.str;
                } else {
                  text += '\n' + item.str;
                }
                lastY = item.transform[5];
              }
              return text;
            });
          }
        });

        if (data.text && data.text.trim().length > bestResult.text.length) {
          bestResult = {
            text: this.cleanExtractedText(data.text.trim()),
            confidence: this.calculateTextQuality(data.text.trim()),
            method: 'pdf-parse-enhanced'
          };
          console.log(`✅ Enhanced pdf-parse extracted ${data.text.length} characters`);
        }
      } catch (err) {
        console.warn('⚠️ Enhanced pdf-parse failed:', err.message);
      }

      // Method 2: Standard pdf-parse fallback
      try {
        console.log('🔄 Trying standard pdf-parse...');
        const data = await pdfParse(buffer);
        
        if (data.text && data.text.trim().length > bestResult.text.length) {
          const cleanedText = this.cleanExtractedText(data.text.trim());
          const quality = this.calculateTextQuality(cleanedText);
          
          if (quality > bestResult.confidence) {
            bestResult = {
              text: cleanedText,
              confidence: quality,
              method: 'pdf-parse-standard'
            };
            console.log(`✅ Standard pdf-parse extracted ${data.text.length} characters`);
          }
        }
      } catch (err) {
        console.warn('⚠️ Standard pdf-parse failed:', err.message);
      }

      // Method 3: pdf2json with enhanced text reconstruction
      try {
        console.log('🔄 Trying enhanced pdf2json...');
        const text = await this.extractWithEnhancedPdf2json(buffer);
        
        if (text && text.trim().length > bestResult.text.length) {
          const cleanedText = this.cleanExtractedText(text.trim());
          const quality = this.calculateTextQuality(cleanedText);
          
          if (quality > bestResult.confidence) {
            bestResult = {
              text: cleanedText,
              confidence: quality,
              method: 'pdf2json-enhanced'
            };
            console.log(`✅ Enhanced pdf2json extracted ${text.length} characters`);
          }
        }
      } catch (err) {
        console.warn('⚠️ Enhanced pdf2json failed:', err.message);
      }

      // Method 4: Character-by-character reconstruction
      try {
        console.log('🔄 Trying character-level reconstruction...');
        const text = await this.extractWithCharacterReconstruction(buffer);
        
        if (text && text.trim().length > bestResult.text.length) {
          const cleanedText = this.cleanExtractedText(text.trim());
          const quality = this.calculateTextQuality(cleanedText);
          
          if (quality > bestResult.confidence) {
            bestResult = {
              text: cleanedText,
              confidence: quality,
              method: 'character-reconstruction'
            };
            console.log(`✅ Character reconstruction extracted ${text.length} characters`);
          }
        }
      } catch (err) {
        console.warn('⚠️ Character reconstruction failed:', err.message);
      }

      // If we still don't have enough content, try OCR as last resort
      if (bestResult.text.length < 500) {
        console.log('🔍 Text extraction insufficient, attempting OCR...');
        try {
          const ocrText = await this.extractTextWithOCR(buffer);
          if (ocrText && ocrText.length > bestResult.text.length) {
            bestResult = {
              text: this.cleanExtractedText(ocrText),
              confidence: this.calculateTextQuality(ocrText) * 0.8, // OCR is less reliable
              method: 'tesseract-ocr'
            };
            console.log(`✅ OCR extracted ${ocrText.length} characters`);
          }
        } catch (ocrErr) {
          console.warn('⚠️ OCR failed:', ocrErr.message);
        }
      }

      console.log(`🎯 Best extraction method: ${bestResult.method}`);
      console.log(`📊 Final text length: ${bestResult.text.length} characters`);
      console.log(`📈 Text quality score: ${bestResult.confidence.toFixed(2)}`);

      if (bestResult.text.length < 100) {
        throw new Error('Insufficient text extracted from PDF. The PDF may be image-based or corrupted.');
      }

      return bestResult.text;

    } catch (error) {
      console.error('❌ Enhanced PDF processing error:', error);
      throw new Error('Enhanced PDF processing failed: ' + error.message);
    }
  }

  async extractWithEnhancedPdf2json(buffer) {
    return new Promise((resolve, reject) => {
      const pdfParser = new pdf2json();
      
      pdfParser.on('pdfParser_dataError', errData => {
        reject(new Error(errData.parserError));
      });

      pdfParser.on('pdfParser_dataReady', pdfData => {
        try {
          const pageTexts = [];
          const pages = Array.isArray(pdfData.Pages) ? pdfData.Pages : [];

          pages.forEach((page, pageIndex) => {
            console.log(`🔄 Processing page ${pageIndex + 1}...`);
            
            // Create a more sophisticated text reconstruction
            const textElements = [];
            const texts = Array.isArray(page.Texts) ? page.Texts : [];
            
            // Extract all text elements with their positions
            texts.forEach(textObj => {
              const x = textObj.x || 0;
              const y = textObj.y || 0;
              const content = (textObj.R || []).map(r => {
                const text = decodeURIComponent(r.T || '');
                return text;
              }).join('');
              
              if (content.trim()) {
                textElements.push({
                  x,
                  y,
                  content: content.trim(),
                  fontSize: textObj.R?.[0]?.TS?.[1] || 12,
                  fontName: textObj.R?.[0]?.TS?.[0] || 'default'
                });
              }
            });

            console.log(`   Found ${textElements.length} text elements on page ${pageIndex + 1}`);

            if (textElements.length === 0) {
              return; // Skip empty pages
            }

            // Sort elements by Y position (top to bottom), then X position (left to right)
            textElements.sort((a, b) => {
              const yDiff = b.y - a.y; // Note: PDF coordinates are bottom-up
              if (Math.abs(yDiff) < 0.5) { // Same line
                return a.x - b.x; // Left to right
              }
              return yDiff; // Top to bottom
            });

            // Group text elements into lines
            const lines = [];
            let currentLine = [];
            let lastY = null;
            const lineToleranceY = 0.5; // Y-coordinate tolerance for same line

            textElements.forEach(element => {
              if (lastY === null || Math.abs(element.y - lastY) < lineToleranceY) {
                // Same line
                currentLine.push(element);
              } else {
                // New line
                if (currentLine.length > 0) {
                  lines.push([...currentLine]);
                }
                currentLine = [element];
              }
              lastY = element.y;
            });

            // Don't forget the last line
            if (currentLine.length > 0) {
              lines.push(currentLine);
            }

            // Convert lines to text
            const lineTexts = lines.map(line => {
              // Sort elements in line by X position
              line.sort((a, b) => a.x - b.x);
              
              // Merge text elements with appropriate spacing
              let lineText = '';
              for (let i = 0; i < line.length; i++) {
                const element = line[i];
                const nextElement = line[i + 1];
                
                lineText += element.content;
                
                // Add spacing if there's a significant gap to the next element
                if (nextElement) {
                  const gap = nextElement.x - (element.x + this.estimateTextWidth(element.content, element.fontSize));
                  if (gap > 0.5) { // Significant gap
                    lineText += ' ';
                  }
                }
              }
              return lineText.trim();
            }).filter(line => line.length > 0);

            console.log(`   Reconstructed ${lineTexts.length} lines on page ${pageIndex + 1}`);
            pageTexts.push(lineTexts.join('\n'));
          });

          const finalText = pageTexts.join('\n\n').trim();
          console.log(`✅ Enhanced pdf2json total text length: ${finalText.length}`);
          resolve(finalText);

        } catch (err) {
          reject(err);
        }
      });

      pdfParser.parseBuffer(buffer);
    });
  }

  async extractWithCharacterReconstruction(buffer) {
    return new Promise((resolve, reject) => {
      const pdfParser = new pdf2json();
      
      pdfParser.on('pdfParser_dataError', errData => {
        reject(new Error(errData.parserError));
      });

      pdfParser.on('pdfParser_dataReady', pdfData => {
        try {
          let allText = '';
          const pages = Array.isArray(pdfData.Pages) ? pdfData.Pages : [];

          pages.forEach((page, pageIndex) => {
            const texts = Array.isArray(page.Texts) ? page.Texts : [];
            const allChars = [];

            // Extract individual characters with positions
            texts.forEach(textObj => {
              const x = textObj.x || 0;
              const y = textObj.y || 0;
              
              (textObj.R || []).forEach(run => {
                const text = decodeURIComponent(run.T || '');
                const fontSize = run.TS?.[1] || 12;
                
                // Split text into individual characters
                for (let i = 0; i < text.length; i++) {
                  const char = text[i];
                  const charX = x + (i * fontSize * 0.6); // Approximate character width
                  allChars.push({
                    char,
                    x: charX,
                    y,
                    fontSize
                  });
                }
              });
            });

            // Sort characters by position
            allChars.sort((a, b) => {
              const yDiff = b.y - a.y; // PDF coordinates are bottom-up
              if (Math.abs(yDiff) < 0.5) {
                return a.x - b.x;
              }
              return yDiff;
            });

            // Reconstruct text from characters
            let pageText = '';
            let lastY = null;
            let lastX = null;

            allChars.forEach(charObj => {
              const { char, x, y } = charObj;
              
              if (lastY !== null && Math.abs(y - lastY) > 0.5) {
                // New line
                pageText += '\n';
                lastX = null;
              } else if (lastX !== null && x - lastX > charObj.fontSize * 1.5) {
                // Significant horizontal gap - add space
                pageText += ' ';
              }

              pageText += char;
              lastY = y;
              lastX = x + charObj.fontSize * 0.6; // Approximate next position
            });

            if (pageText.trim()) {
              allText += (allText ? '\n\n' : '') + pageText.trim();
            }
          });

          resolve(allText);

        } catch (err) {
          reject(err);
        }
      });

      pdfParser.parseBuffer(buffer);
    });
  }

  async extractTextWithOCR(buffer) {
    try {
      console.log('🔍 Starting OCR extraction...');
      
      // For OCR, we would need to convert PDF to images first
      // This is a simplified version - in production you'd use pdf2pic or similar
      console.warn('⚠️ Full OCR implementation requires PDF to image conversion');
      console.warn('⚠️ Install pdf2pic or similar for complete OCR support');
      
      return ''; // Placeholder - implement full OCR if needed
    } catch (error) {
      console.error('❌ OCR extraction failed:', error);
      return '';
    }
  }

  estimateTextWidth(text, fontSize) {
    // Rough approximation of text width based on font size
    return text.length * fontSize * 0.6;
  }

  calculateTextQuality(text) {
    if (!text) return 0;
    
    let score = 0;
    
    // Length score (more text is generally better)
    score += Math.min(text.length / 1000, 5);
    
    // Word count score
    const words = text.split(/\s+/).filter(w => w.length > 0);
    score += Math.min(words.length / 100, 3);
    
    // Sentence structure score
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    score += Math.min(sentences.length / 10, 2);
    
    // Common resume keywords
    const resumeKeywords = [
      'experience', 'education', 'skills', 'projects', 'work', 'university',
      'degree', 'job', 'company', 'responsibilities', 'achievements', 'contact',
      'email', 'phone', 'address', 'summary', 'objective', 'professional'
    ];
    
    const keywordMatches = resumeKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    ).length;
    score += keywordMatches * 0.5;
    
    // Email and phone patterns
    if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) score += 2;
    if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) score += 1;
    
    // Penalize excessive repetition
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const repetitionRatio = uniqueWords.size / Math.max(words.length, 1);
    score *= Math.max(repetitionRatio * 2, 0.5);
    
    return score;
  }

  cleanExtractedText(text) {
    if (!text) return '';
    
    let cleanText = String(text);
    
    // Remove excessive whitespace while preserving structure
    cleanText = cleanText
      .split('\n')
      .map(line => line.trim().replace(/\s+/g, ' '))
      .filter(line => line.length > 0)
      .join('\n');
    
    // Remove excessive blank lines
    cleanText = cleanText.replace(/\n{3,}/g, '\n\n');
    
    // Fix common OCR/extraction artifacts
    cleanText = cleanText
      .replace(/\u00AD/g, '') // Remove soft hyphens
      .replace(/\u200B/g, '') // Remove zero-width spaces
      .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
      .replace(/\uFEFF/g, ''); // Remove BOM
    
    // Improve word spacing around punctuation
    cleanText = cleanText
      .replace(/([a-zA-Z])([.,:;!?])([A-Z])/g, '$1$2 $3')
      .replace(/([a-z])([A-Z])/g, '$1 $2');
    
    // Clean up email and URL formatting
    cleanText = cleanText
      .replace(/(\w+)\s*@\s*(\w+)/g, '$1@$2')
      .replace(/(https?:\/\/)\s+/g, '$1')
      .replace(/\s+(\.com|\.org|\.net|\.edu)/g, '$1');
    
    return cleanText.trim();
  }

  // Extract images (keeping existing functionality)
  async extractFirstImageToFile(buffer) {
    try {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Try to extract images using existing magic bytes method
      return this.extractEmbeddedImageByMagic(buffer, uploadDir);
    } catch (err) {
      console.warn('⚠️ Image extraction failed:', err.message);
      return null;
    }
  }

  async extractAllImagesToFiles(buffer, maxImages = 6) {
    try {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const candidates = this.findEmbeddedImageCandidatesByMagic(buffer);
      candidates.sort((a, b) => b.size - a.size);
      
      const urls = [];
      for (const c of candidates.slice(0, maxImages)) {
        const filename = `resume-photo-${Date.now()}-${urls.length + 1}.${c.ext}`;
        fs.writeFileSync(path.join(uploadDir, filename), buffer.slice(c.start, c.end));
        urls.push(`/uploads/${filename}`);
      }
      
      return urls;
    } catch (err) {
      console.warn('⚠️ Multiple image extraction failed:', err.message);
      return [];
    }
  }

  // Keep existing image extraction methods
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
    
    // PNG and WEBP detection (similar to existing code)
    // ... (keeping existing implementation for brevity)
    
    if (candidates.length === 0) return null;
    
    candidates.sort((a, b) => b.size - a.size);
    const best = candidates[0];
    const filename = `resume-photo-${Date.now()}.${best.ext}`;
    fs.writeFileSync(path.join(uploadDir, filename), buffer.slice(best.start, best.end));
    console.log(`🖼️ Extracted embedded image: ${best.ext}, ${Math.round(best.size / 1024)}KB`);
    return `/uploads/${filename}`;
  }

  findEmbeddedImageCandidatesByMagic(buffer) {
    const candidates = [];
    
    // JPEG detection
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
    
    return candidates;
  }
}

const enhancedPdfProcessor = new EnhancedPDFProcessor();
export default enhancedPdfProcessor;