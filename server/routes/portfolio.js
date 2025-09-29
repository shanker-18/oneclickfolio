import express from 'express';
import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';
import { pdfUpload, imageUpload } from '../middleware/upload.js';
import pdfProcessor from '../utils/pdfProcessor.js';
import geminiAI from '../utils/geminiAI.js';
import { refineResumeData, extractFallbackContacts } from '../utils/resumeRefiner.js';
import linkExtractor from '../utils/linkExtractor.js';

const router = express.Router();


const extractProjectNameFromDescription = (description) => {
  if (!description) return 'Untitled Project';
  
  const namePatterns = [
    /^([^\-\:]{2,30})\s*[\-\:]/, // "Project Name - description" or "Project Name: description"
    /([A-Z][a-zA-Z\s]{2,30})(?=\s+is|\s+was|\s+\-|\s+built|\s+developed)/, // "Project Name is/was/built/developed"
    /^([A-Z][a-zA-Z\s]{2,30})(?=\s)/, // First capitalized phrase
  ];
  
  for (const pattern of namePatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // Fallback: take first few words
  const words = description.split(' ').slice(0, 4);
  return words.join(' ').replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'Project';
};

const extractTechFromDescription = (description) => {
  if (!description) return [];
  
  const commonTech = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Express',
    'Python', 'Django', 'Flask', 'Java', 'Spring', 'C++', 'C#', '.NET',
    'PHP', 'Laravel', 'Ruby', 'Rails', 'Go', 'Rust', 'Swift', 'Kotlin',
    'HTML', 'CSS', 'SCSS', 'Sass', 'Bootstrap', 'Tailwind',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'GitHub',
    'Figma', 'Sketch', 'Photoshop', 'Illustrator'
  ];
  
  const foundTech = [];
  const lowerDescription = description.toLowerCase();
  
  commonTech.forEach(tech => {
    if (lowerDescription.includes(tech.toLowerCase())) {
      foundTech.push(tech);
    }
  });
  
  return foundTech.slice(0, 6); // Limit to 6 technologies
};

// Create portfolio from PDF (self.so's exact approach)
router.post('/user/:sessionId/portfolio', pdfUpload.single('file'), async (req, res) => {
  try {
    const user = await User.findOne({ sessionId: req.params.sessionId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      });
    }

    console.log('📄 Processing PDF for portfolio creation...');

    // Extract text and attempt to pull embedded images (profile + others)
    const [pdfData, extractedPhotoUrl, allImages] = await Promise.all([
      pdfProcessor.extractTextFromPDF(req.file.buffer),
      pdfProcessor.extractFirstImageToFile(req.file.buffer),
      pdfProcessor.extractAllImagesToFiles(req.file.buffer)
    ]);
    const resumeText = typeof pdfData === 'string' ? pdfData : (pdfData?.text || '');
    const extractedHyperlinks = Array.isArray(pdfData?.hyperlinks) ? pdfData.hyperlinks : [];
    console.log('🔍 PDF text extracted, starting AI processing...');

    // Enhanced prompt for better extraction with focus on links and complete data extraction
    const prompt = `You are an expert resume parser and professional portfolio creator. Extract comprehensive information and build a JSON object for a portfolio.

## CRITICAL INSTRUCTIONS:
- Extract ALL available information including contact details, work experience, education, skills, achievements, and ESPECIALLY any URLs or links
- CAREFULLY scan for project URLs, GitHub repositories, portfolio websites, LinkedIn profiles, personal websites, and any other links
- Look for URLs in various formats: http://, https://, www., github.com/, linkedin.com/, portfolio sites, project demos
- If contact information is missing, leave those fields as empty strings
- Generate a professional "about" section that summarizes the person's experience and expertise
- Extract skills from the resume text and categorize them appropriately
- For work experience, extract company names, job titles, dates, locations, and detailed descriptions
- For education, extract degree names, institutions, and completion dates
- Be thorough and extract as much detail as possible from the resume text
- Format dates consistently (YYYY-MM or original format)
- Ensure all extracted information is accurate and professional
- SPECIAL FOCUS: For each project, carefully look for associated links, GitHub repos, demo URLs, or live site URLs
- Detect the persona type from: academic, student, freelancer, professional. If uncertain, choose "professional".
- Based on persona, include extra sections found in the resume. Examples:
   - Academic: publications (title, venue, year, authors, link), conferences (name, year, role, link), grants (title, agency, amount, year), supervision (student, degree, topic, year)
   - Student: projects (name, description, tech, link), coursework (name, grade), internships (company, role, start, end, description), hackathons (name, year, award)
   - Freelancer: services (name, description), caseStudies (client, project, outcome, link), clients (name, link), testimonials (author, content)
   - General extras: awards (title, issuer, year), certifications (name, issuer, year, credentialId, link), languages (name, level), volunteering (org, role, description)

## Required JSON Structure:
{
  "header": {
    "name": "Full Name (as it appears in resume)",
    "shortAbout": "Brief professional tagline or summary (1-2 sentences)",
    "location": "City, State/Country (if available)",
    "contacts": {
      "website": "Personal website URL or empty string",
      "email": "Email address (extract from resume)",
      "phone": "Phone number (extract from resume)",
      "twitter": "Twitter username or empty string",
      "linkedin": "LinkedIn username or empty string",
      "github": "GitHub username or empty string"
    },
    "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8", "Skill 9", "Skill 10"]
  },
  "summary": "Detailed professional summary paragraph (3-4 sentences describing experience, expertise, and career highlights)",
  "workExperience": [
    {
      "company": "Company/Institution Name",
      "link": "Company website or empty string",
      "location": "City, State or Remote",
      "contract": "Full-time, Part-time, Contract, or Academic",
      "title": "Job Title/Position",
      "start": "Start date (YYYY-MM or original format)",
      "end": "End date or 'Present'",
      "description": "Detailed job description with responsibilities, achievements, and key contributions"
    }
  ],
  "education": [
    {
      "school": "University/Institution Name",
      "degree": "Degree Name and Field of Study",
      "start": "Start year",
      "end": "End year or 'Present'"
    }
  ],
  "personaType": "academic | student | freelancer | professional | other",
  "extraSections": [
    { "key": "publications", "title": "Publications", "items": [{ "title": "", "venue": "", "year": "", "authors": "", "link": "" }] },
    { "key": "projects", "title": "Projects", "items": [{ "name": "", "description": "", "tech": [], "link": "" }] },
    { "key": "awards", "title": "Awards", "items": [{ "title": "", "issuer": "", "year": "", "link": "" }] }
  ]
}

## Resume text to analyze:
${resumeText}

Return only valid JSON, no additional text or formatting. Extract as much detail as possible from the resume text.`;

    const result = await geminiAI.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean up the response to ensure it's valid JSON
    const sanitizeAiJson = (raw) => {
      let cleaned = String(raw).trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/```json\n?/, '').replace(/\n?```$/, '');
      if (cleaned.startsWith('```')) cleaned = cleaned.replace(/```\n?/, '').replace(/\n?```$/, '');
      cleaned = cleaned
        .replace(/\u0000/g, '')
        .replace(/\r/g, '')
        .replace(/\t/g, '\t')
        .replace(/\n\s*\n/g, '\n')
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/[\x00-\x1F\x7F]/g, '')
        .replace(/([:{,\[]\s*)"?([a-zA-Z_][a-zA-Z0-9_]*)"?\s*:/g, '$1"$2":')
        .replace(/\bNaN\b/g, '""')
        .replace(/\bundefined\b/g, '""');
      return cleaned.trim();
    };

    let resumeData = {};
    try {
      const cleaned = sanitizeAiJson(text);
      resumeData = JSON.parse(cleaned);
    } catch (e) {
      console.warn('⚠️ AI returned invalid JSON. Using minimal fallback contact extraction.');
      resumeData = { header: { contacts: extractFallbackContacts(resumeText), skills: [] }, summary: '', workExperience: [], education: [] };
    }

    // Refine/normalize for consistent quality
    resumeData = refineResumeData(resumeData);

    // Enrich with robust fallbacks from raw text when AI misses fields
    try {
      const header = resumeData.header = resumeData.header || { contacts: {}, skills: [] };
      header.contacts = header.contacts || {};

      // 1) Links-based enrichment using linkExtractor
      const linkAnalysis = linkExtractor.extractAndCategorizeLinks(resumeText);
      if (linkAnalysis.contacts) {
        header.contacts.github = header.contacts.github || linkAnalysis.contacts.github || '';
        header.contacts.linkedin = header.contacts.linkedin || linkAnalysis.contacts.linkedin || '';
        header.contacts.twitter = header.contacts.twitter || linkAnalysis.contacts.twitter || '';
        header.contacts.website = header.contacts.website || linkAnalysis.contacts.website || '';
        header.contacts.email = header.contacts.email || linkAnalysis.contacts.email || '';
        header.contacts.phone = header.contacts.phone || linkAnalysis.contacts.phone || '';
      }

      // 2) Regex fallback for email/phone
      if (!header.contacts.email) {
        const emailMatch = resumeText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
        if (emailMatch) header.contacts.email = emailMatch[0];
      }
      if (!header.contacts.phone) {
        const phoneMatch = resumeText.match(/(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/);
        if (phoneMatch) header.contacts.phone = phoneMatch[0];
      }

      // 3) Name heuristic if AI left "Full Name"/empty
      if (!header.name || /^\s*$/.test(header.name) || /^full\s*name$/i.test(header.name)) {
        const firstLines = resumeText.split('\n').slice(0, 10).map(s => s.trim()).filter(Boolean);
        const candidate = firstLines.find(l => /[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(l) && !/email|phone|linkedin|github|portfolio|curriculum vitae|resume/i.test(l));
        if (candidate) header.name = candidate.replace(/[^A-Za-z\s\-\.]/g, '').trim();
      }

      // 4) Skills heuristic
      const existingSkills = Array.isArray(header.skills) ? header.skills : [];
      if (existingSkills.length === 0) {
        const skillsSectionRegex = /\b(skills|technical skills|core competencies)\b[\s\:\-]*([\s\S]{0,400})/i;
        const sec = resumeText.match(skillsSectionRegex);
        if (sec && sec[2]) {
          const raw = sec[2].split(/\n|\u2022|\,|\||\/|\;/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 40);
          const uniq = [...new Set(raw)].slice(0, 20);
          if (uniq.length) header.skills = uniq;
        }
      }
    } catch (enrichErr) {
      console.warn('⚠️ Fallback enrichment skipped:', enrichErr.message);
    }

    // Enhanced link extraction and integration (temporarily disabled)
    try {
      // Fallback to basic URL extraction
      const urlRegex = /(https?:\/\/[^\s)]+|www\.[^\s)]+)/gi;
      const foundUrls = (typeof resumeText === 'string' ? (resumeText.match(urlRegex) || []) : [])
        .map(u => u.replace(/[\.,]$/, ''));

      if (foundUrls.length > 0) {
        resumeData.header = resumeData.header || { contacts: {} };
        resumeData.header.contacts = resumeData.header.contacts || {};
        if (!resumeData.header.contacts.website) {
          const personalSite = foundUrls.find(u => /\.(dev|app|me|io|com|in|ai)(\/|$)/.test(u) && !u.includes('github.com') && !u.includes('linkedin.com'));
          if (personalSite) resumeData.header.contacts.website = personalSite.startsWith('http') ? personalSite : `https://${personalSite}`;
        }
      }
      // If extractor provided structured hyperlinks, prefer them to populate contacts when missing
      if (Array.isArray(extractedHyperlinks) && extractedHyperlinks.length) {
        const urls = extractedHyperlinks.map(h => h.url).filter(Boolean);
        const getFirst = (re) => urls.find(u => re.test(u));
        resumeData.header = resumeData.header || { contacts: {} };
        resumeData.header.contacts = resumeData.header.contacts || {};
        if (!resumeData.header.contacts.github) {
          const gh = getFirst(/github\.com\//i);
          if (gh) {
            try { const u = new URL(gh); const username = u.pathname.split('/').filter(Boolean)[0]; if (username) resumeData.header.contacts.github = username; } catch {}
          }
        }
        if (!resumeData.header.contacts.linkedin) {
          const li = getFirst(/linkedin\.com\//i);
          if (li) {
            try { const u = new URL(li); const username = u.pathname.replace(/\/(in|pub)\//, '').split('/').filter(Boolean)[0]; if (username) resumeData.header.contacts.linkedin = username; } catch {}
          }
        }
        if (!resumeData.header.contacts.website) {
          const site = urls.find(u => /\.(dev|app|me|io|com|in|ai)(\/|$)/i.test(u) && !/github\.com|linkedin\.com/i.test(u));
          if (site) resumeData.header.contacts.website = site.startsWith('http') ? site : `https://${site}`;
        }
      }
    } catch (linkExtractionError) {
      console.warn('⚠️ Basic link extraction failed:', linkExtractionError.message);
    }

    console.log('✅ Structured and refined data extracted');

    // Generate URL slug from name
    const portfolioName = resumeData.header?.name || user.name || 'portfolio';
    const baseSlug = portfolioName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);

    let uniqueSlug = baseSlug || `portfolio-${Date.now()}`;
    let counter = 1;

    while (true) {
      const existing = await Portfolio.findOne({ urlSlug: uniqueSlug });
      if (!existing) break;
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // If we extracted a photo, attach it
    if (extractedPhotoUrl) {
      resumeData.header = resumeData.header || {};
      resumeData.header.photoUrl = extractedPhotoUrl;
    }
    // If multiple images extracted, store under extraSections as 'media'
    if (Array.isArray(allImages) && allImages.length > 0) {
      resumeData.extraSections = Array.isArray(resumeData.extraSections) ? resumeData.extraSections : [];
      const existingIdx = resumeData.extraSections.findIndex(s => (s.key||'').toLowerCase() === 'media');
      const mediaItems = allImages.map((url, i) => ({ id: `media-${i+1}`, order: i+1, fields: [{ key: 'image', value: url, type: 'url', displayName: 'Image', order: 1 }] }));
      const mediaSection = { key: 'media', title: 'Media', items: mediaItems };
      if (existingIdx === -1) {
        resumeData.extraSections.push(mediaSection);
      } else {
        const existing = resumeData.extraSections[existingIdx];
        existing.items = Array.isArray(existing.items) ? existing.items.concat(mediaItems) : mediaItems;
        resumeData.extraSections[existingIdx] = existing;
      }
    }

    // Create portfolio with enhanced data structure
    const portfolio = new Portfolio({
      userId: user._id.toString(),
      urlSlug: uniqueSlug,
      title: req.body.title || 'Professional Portfolio',
      header: resumeData.header,
      summary: resumeData.summary,
      workExperience: resumeData.workExperience || [],
      education: resumeData.education || [],
      themeKey: req.body.themeKey || 'indigoPurple',
      personaType: resumeData.personaType || 'professional',
      extraSections: Array.isArray(resumeData.extraSections) ? resumeData.extraSections : [],
      isPublished: false
    });

    await portfolio.save();

    // Add to user's portfolios
    user.portfolios = user.portfolios || [];
    user.portfolios.push(portfolio._id);
    await user.save();

    console.log(`✅ Portfolio created: ${portfolio.urlSlug}`);

    res.json({
      success: true,
      message: 'Portfolio created successfully',
      portfolio: portfolio
    });

  } catch (error) {
    console.error('❌ Create portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create portfolio',
      error: error.message
    });
  }
});

// Upload portfolio photo and set header.photoUrl
router.post('/user/:sessionId/portfolio/:portfolioId/photo', imageUpload.single('image'), async (req, res) => {
  try {
    const user = await User.findOne({ sessionId: req.params.sessionId });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid session' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, userId: user._id.toString() });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const relativeUrl = `/uploads/${req.file.filename}`;
    portfolio.header = portfolio.header || {};
    portfolio.header.photoUrl = relativeUrl;
    await portfolio.save();

    res.json({ success: true, message: 'Photo uploaded', photoUrl: relativeUrl, portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload photo', error: error.message });
  }
});

// Get user's portfolios
router.get('/user/:sessionId/portfolios', async (req, res) => {
  try {
    const user = await User.findOne({ sessionId: req.params.sessionId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session'
      });
    }

    const portfolios = await Portfolio.find({
      userId: user._id.toString()
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      portfolios: portfolios,
      total: portfolios.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolios',
      error: error.message
    });
  }
});

// Get portfolio by ID or slug
router.get('/user/:sessionId/portfolio/:portfolioIdentifier', async (req, res) => {
  try {
    const user = await User.findOne({ sessionId: req.params.sessionId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session'
      });
    }

    const { portfolioIdentifier } = req.params;
    
    // Try to find by MongoDB ObjectId first, then by slug
    let portfolio;
    
    // Check if identifier looks like a MongoDB ObjectId (24 hex characters)
    if (portfolioIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
      portfolio = await Portfolio.findOne({
        _id: portfolioIdentifier,
        userId: user._id.toString()
      });
    }
    
    // If not found by ID, try to find by slug
    if (!portfolio) {
      portfolio = await Portfolio.findOne({
        urlSlug: portfolioIdentifier,
        userId: user._id.toString()
      });
    }

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    res.json({
      success: true,
      portfolio: portfolio
    });

  } catch (error) {
    console.error('❌ Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio',
      error: error.message
    });
  }
});

// Get public portfolio by slug
router.get('/public/:slug', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      urlSlug: req.params.slug,
      isPublished: true
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found or not published'
      });
    }

    res.json({
      success: true,
      portfolio: portfolio
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio',
      error: error.message
    });
  }
});

// Update portfolio
router.put('/user/:sessionId/portfolio/:portfolioId', async (req, res) => {
  try {
    const user = await User.findOne({ sessionId: req.params.sessionId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session'
      });
    }

    const portfolio = await Portfolio.findOne({
      _id: req.params.portfolioId,
      userId: user._id.toString()
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Update portfolio fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'userId' && key !== 'urlSlug') {
        portfolio[key] = req.body[key];
      }
    });

    await portfolio.save();

    res.json({
      success: true,
      message: 'Portfolio updated successfully',
      portfolio: portfolio
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update portfolio',
      error: error.message
    });
  }
});

// Toggle publish status
router.put('/user/:sessionId/portfolio/:portfolioId/publish', async (req, res) => {
  try {
    const user = await User.findOne({ sessionId: req.params.sessionId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session'
      });
    }

    const portfolio = await Portfolio.findOne({
      _id: req.params.portfolioId,
      userId: user._id.toString()
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    portfolio.isPublished = req.body.isPublished;
    await portfolio.save();

    res.json({
      success: true,
      message: `Portfolio ${portfolio.isPublished ? 'published' : 'unpublished'} successfully`,
      portfolio: portfolio
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update portfolio status',
      error: error.message
    });
  }
});

// Delete portfolio
router.delete('/user/:sessionId/portfolio/:portfolioId', async (req, res) => {
  try {
    const user = await User.findOne({ sessionId: req.params.sessionId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session'
      });
    }

    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.portfolioId,
      userId: user._id.toString()
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Remove from user's portfolios
    user.portfolios = user.portfolios.filter(id => id.toString() !== portfolio._id.toString());
    await user.save();

    res.json({
      success: true,
      message: 'Portfolio deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete portfolio',
      error: error.message
    });
  }
});

export default router;

// New endpoint: Extract complete PDF contents (text, hyperlinks, images)
router.post('/pdf/extract', pdfUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'PDF file is required' });
    }

    const data = await pdfProcessor.extractAllPDFData(req.file.buffer);
    return res.json({ success: true, ...data });
  } catch (error) {
    console.error('❌ PDF extract endpoint error:', error);
    return res.status(500).json({ success: false, message: 'Failed to extract PDF', error: error.message });
  }
});
