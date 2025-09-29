/**
 * Enhanced Link Extraction Utility
 * Extracts and categorizes various types of links from PDF resume text
 */

class LinkExtractor {
  constructor() {
    // Comprehensive URL regex patterns
    this.patterns = {
      // General URL pattern (most comprehensive)
      general: /(https?:\/\/[^\s)]+|www\.[^\s)]+|[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}(?:\/[^\s)]*)?)/gi,
      
      // Social media and professional platforms
      github: /(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)?/gi,
      linkedin: /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi,
      twitter: /(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+/gi,
      behance: /(https?:\/\/)?(www\.)?behance\.net\/[a-zA-Z0-9_-]+/gi,
      dribbble: /(https?:\/\/)?(www\.)?dribbble\.com\/[a-zA-Z0-9_-]+/gi,
      medium: /(https?:\/\/)?(www\.)?medium\.com\/@?[a-zA-Z0-9_-]+/gi,
      
      // Development platforms
      gitlab: /(https?:\/\/)?(www\.)?gitlab\.com\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)?/gi,
      bitbucket: /(https?:\/\/)?(www\.)?bitbucket\.org\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)?/gi,
      codepen: /(https?:\/\/)?(www\.)?codepen\.io\/[a-zA-Z0-9_-]+/gi,
      
      // Portfolio and hosting platforms
      vercel: /(https?:\/\/)?[a-zA-Z0-9_-]+\.vercel\.app(?:\/[^\s)]*)?/gi,
      netlify: /(https?:\/\/)?[a-zA-Z0-9_-]+\.netlify\.app(?:\/[^\s)]*)?/gi,
      herokuapp: /(https?:\/\/)?[a-zA-Z0-9_-]+\.herokuapp\.com(?:\/[^\s)]*)?/gi,
      firebase: /(https?:\/\/)?[a-zA-Z0-9_-]+\.firebaseapp\.com(?:\/[^\s)]*)?/gi,
      githubPages: /(https?:\/\/)?[a-zA-Z0-9_-]+\.github\.io(?:\/[a-zA-Z0-9_-]+)?(?:\/[^\s)]*)?/gi,
      
      // Academic and research platforms
      googleScholar: /(https?:\/\/)?(www\.)?scholar\.google\.com\/citations\?user=[a-zA-Z0-9_-]+/gi,
      researchGate: /(https?:\/\/)?(www\.)?researchgate\.net\/profile\/[a-zA-Z0-9_-]+/gi,
      orcid: /(https?:\/\/)?(www\.)?orcid\.org\/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}/gi,
      
      // Company and organization websites
      company: /(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*\.(com|org|net|edu|gov|io|co|ai|tech|dev)(?:\/[^\s)]*)?/gi,
      
      // Email patterns (for completeness)
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
      
      // Phone patterns (basic)
      phone: /(?:\+?1[-.\s]?)?(?:\(?[0-9]{3}\)?[-.\s]?)[0-9]{3}[-.\s]?[0-9]{4}/g
    };
    
    // Link categories for portfolio placement
    this.categories = {
      social: ['github', 'linkedin', 'twitter', 'behance', 'dribbble', 'medium'],
      development: ['github', 'gitlab', 'bitbucket', 'codepen'],
      hosting: ['vercel', 'netlify', 'herokuapp', 'firebase', 'githubPages'],
      academic: ['googleScholar', 'researchGate', 'orcid'],
      professional: ['linkedin', 'company'],
      portfolio: ['vercel', 'netlify', 'herokuapp', 'firebase', 'githubPages', 'behance', 'dribbble'],
      projects: ['github', 'gitlab', 'vercel', 'netlify', 'herokuapp', 'firebase', 'githubPages', 'codepen']
    };
  }

  /**
   * Extract all links from text and categorize them
   * @param {string} text - The text to extract links from
   * @returns {Object} Categorized links object
   */
  extractAndCategorizeLinks(text) {
    if (!text || typeof text !== 'string') {
      return { all: [], categorized: {}, contacts: {} };
    }

    const foundLinks = {
      all: [],
      categorized: {},
      contacts: {}
    };

    // Extract links by type
    Object.entries(this.patterns).forEach(([type, pattern]) => {
      const matches = [...text.matchAll(pattern)];
      if (matches.length > 0) {
        foundLinks.categorized[type] = matches.map(match => this.normalizeUrl(match[0]));
        foundLinks.all.push(...foundLinks.categorized[type]);
      }
    });

    // Remove duplicates
    foundLinks.all = [...new Set(foundLinks.all)];

    // Categorize for contacts section
    foundLinks.contacts = this.categorizeForContacts(foundLinks.categorized);

    return foundLinks;
  }

  /**
   * Normalize URLs to ensure they have proper protocols
   * @param {string} url - The URL to normalize
   * @returns {string} Normalized URL
   */
  normalizeUrl(url) {
    if (!url) return '';
    
    // Remove trailing punctuation
    url = url.replace(/[,.;!?]+$/, '');
    
    // Add protocol if missing
    if (!url.match(/^https?:\/\//)) {
      // Don't add protocol to email addresses or phone numbers
      if (url.includes('@') || url.match(/^\+?[\d\s\-\(\)]+$/)) {
        return url;
      }
      return `https://${url}`;
    }
    
    return url;
  }

  /**
   * Categorize links for the contacts section
   * @param {Object} categorizedLinks - Links categorized by type
   * @returns {Object} Contact links object
   */
  categorizeForContacts(categorizedLinks) {
    const contacts = {};

    // GitHub
    if (categorizedLinks.github && categorizedLinks.github.length > 0) {
      const githubUrl = categorizedLinks.github[0];
      contacts.github = this.extractUsername(githubUrl, 'github.com');
    }

    // LinkedIn
    if (categorizedLinks.linkedin && categorizedLinks.linkedin.length > 0) {
      const linkedinUrl = categorizedLinks.linkedin[0];
      contacts.linkedin = this.extractUsername(linkedinUrl, 'linkedin.com/in');
    }

    // Twitter
    if (categorizedLinks.twitter && categorizedLinks.twitter.length > 0) {
      const twitterUrl = categorizedLinks.twitter[0];
      contacts.twitter = this.extractUsername(twitterUrl, ['twitter.com', 'x.com']);
    }

    // Website (prioritize personal portfolio sites)
    const portfolioSites = [
      ...(categorizedLinks.vercel || []),
      ...(categorizedLinks.netlify || []),
      ...(categorizedLinks.firebase || []),
      ...(categorizedLinks.githubPages || [])
    ];

    if (portfolioSites.length > 0) {
      contacts.website = portfolioSites[0];
    } else if (categorizedLinks.company && categorizedLinks.company.length > 0) {
      // Use the first company/personal website found
      const personalSite = categorizedLinks.company.find(url => 
        !url.includes('github.com') && 
        !url.includes('linkedin.com') && 
        !url.includes('twitter.com') &&
        !url.includes('x.com')
      );
      if (personalSite) {
        contacts.website = personalSite;
      }
    }

    // Email
    if (categorizedLinks.email && categorizedLinks.email.length > 0) {
      contacts.email = categorizedLinks.email[0];
    }

    // Phone
    if (categorizedLinks.phone && categorizedLinks.phone.length > 0) {
      contacts.phone = categorizedLinks.phone[0];
    }

    return contacts;
  }

  /**
   * Extract username from social media URLs
   * @param {string} url - The URL to extract username from
   * @param {string|Array} domains - Domain(s) to match
   * @returns {string} Extracted username or empty string
   */
  extractUsername(url, domains) {
    if (!url) return '';
    
    const domainsArray = Array.isArray(domains) ? domains : [domains];
    
    for (const domain of domainsArray) {
      const regex = new RegExp(`${domain.replace('.', '\\.')}\/([a-zA-Z0-9_-]+)`, 'i');
      const match = url.match(regex);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return '';
  }

  /**
   * Extract project-related links
   * @param {string} text - Text to search for project links
   * @returns {Array} Array of project link objects
   */
  extractProjectLinks(text) {
    const projectLinks = [];
    const lines = text.split('\n');
    
    lines.forEach((line, index) => {
      // Look for project descriptions with links
      if (this.looksLikeProjectLine(line)) {
        const links = this.extractLinksFromLine(line);
        if (links.length > 0) {
          projectLinks.push({
            description: line.trim(),
            links: links,
            lineNumber: index
          });
        }
      }
    });

    return projectLinks;
  }

  /**
   * Check if a line contains project-related content
   * @param {string} line - Line of text to check
   * @returns {boolean} Whether the line looks like a project description
   */
  looksLikeProjectLine(line) {
    const projectKeywords = [
      'project', 'built', 'developed', 'created', 'implemented', 'designed',
      'app', 'application', 'website', 'platform', 'system', 'tool',
      'github', 'repo', 'repository', 'demo', 'live'
    ];
    
    const lowerLine = line.toLowerCase();
    return projectKeywords.some(keyword => lowerLine.includes(keyword)) &&
           this.patterns.general.test(line);
  }

  /**
   * Extract links from a single line of text
   * @param {string} line - Line of text to extract links from
   * @returns {Array} Array of links found in the line
   */
  extractLinksFromLine(line) {
    const links = [];
    const matches = [...line.matchAll(this.patterns.general)];
    
    matches.forEach(match => {
      const url = this.normalizeUrl(match[0]);
      if (url && !links.includes(url)) {
        links.push(url);
      }
    });

    return links;
  }

  /**
   * Enhance work experience entries with company links
   * @param {Array} workExperience - Array of work experience objects
   * @param {Object} categorizedLinks - Categorized links from text
   * @returns {Array} Enhanced work experience with links
   */
  enhanceWorkExperienceWithLinks(workExperience, categorizedLinks) {
    if (!Array.isArray(workExperience)) return workExperience;

    const companyLinks = categorizedLinks.company || [];
    
    return workExperience.map(experience => {
      if (experience.company && !experience.link) {
        // Try to find a company website that matches
        const companyName = experience.company.toLowerCase().replace(/[^a-z0-9]/g, '');
        const matchingLink = companyLinks.find(link => {
          const linkDomain = link.replace(/https?:\/\/(www\.)?/, '').split('/')[0].toLowerCase();
          return linkDomain.includes(companyName) || companyName.includes(linkDomain.replace(/\.(com|org|net|io|co)$/, ''));
        });
        
        if (matchingLink) {
          experience.link = matchingLink;
        }
      }
      return experience;
    });
  }

  /**
   * Enhance projects with appropriate links
   * @param {Array} projects - Array of project objects
   * @param {Object} categorizedLinks - Categorized links from text
   * @returns {Array} Enhanced projects with links
   */
  enhanceProjectsWithLinks(projects, categorizedLinks) {
    if (!Array.isArray(projects)) return projects;

    const projectLinks = [
      ...(categorizedLinks.github || []),
      ...(categorizedLinks.gitlab || []),
      ...(categorizedLinks.vercel || []),
      ...(categorizedLinks.netlify || []),
      ...(categorizedLinks.herokuapp || []),
      ...(categorizedLinks.firebase || []),
      ...(categorizedLinks.githubPages || []),
      ...(categorizedLinks.codepen || [])
    ];

    return projects.map((project, index) => {
      if (!project.link && projectLinks[index]) {
        project.link = projectLinks[index];
      }
      return project;
    });
  }

  /**
   * Extract and categorize all links with context information
   * @param {string} text - Full text to analyze
   * @returns {Object} Complete link analysis with context
   */
  extractLinksWithContext(text) {
    const result = this.extractAndCategorizeLinks(text);
    
    // Add context information
    result.projectLinks = this.extractProjectLinks(text);
    result.stats = {
      totalLinks: result.all.length,
      socialLinks: this.categories.social.reduce((count, type) => 
        count + (result.categorized[type] ? result.categorized[type].length : 0), 0),
      projectLinks: this.categories.projects.reduce((count, type) => 
        count + (result.categorized[type] ? result.categorized[type].length : 0), 0),
      professionalLinks: this.categories.professional.reduce((count, type) => 
        count + (result.categorized[type] ? result.categorized[type].length : 0), 0)
    };

    return result;
  }
}

const linkExtractor = new LinkExtractor();
export default linkExtractor;
