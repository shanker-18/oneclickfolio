import htmlPdf from 'html-pdf-node';

class PDFGenerator {
  /**
   * Generate a professional PDF from portfolio data
   * @param {Object} portfolio - Portfolio data object
   * @param {Object} options - PDF generation options
   * @returns {Buffer} PDF buffer
   */
  async generateProfessionalPDF(portfolio, options = {}) {
    try {
      const html = this.generateProfessionalHTML(portfolio);
      
      const pdfOptions = {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        ...options
      };

      const file = { content: html };
      const pdfBuffer = await htmlPdf.generatePdf(file, pdfOptions);
      
      return pdfBuffer;
    } catch (error) {
      console.error('❌ PDF Generation Error:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  /**
   * Generate professional HTML template for PDF
   * @param {Object} portfolio - Portfolio data
   * @returns {String} HTML string
   */
  generateProfessionalHTML(portfolio) {
    const {
      header,
      summary,
      workExperience = [],
      education = [],
      projects = []
    } = portfolio;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${header?.name || 'Professional Portfolio'} - Resume</title>
  <style>
    ${this.getProfessionalCSS()}
  </style>
</head>
<body>
  <div class="resume-container">
    <!-- Header Section -->
    ${this.generateHeaderHTML(header)}
    
    <!-- Summary Section -->
    ${summary ? this.generateSummaryHTML(summary) : ''}
    
    <!-- Work Experience Section -->
    ${workExperience.length > 0 ? this.generateWorkExperienceHTML(workExperience) : ''}
    
    <!-- Projects Section -->
    ${projects.length > 0 ? this.generateProjectsHTML(projects) : ''}
    
    <!-- Education Section -->
    ${education.length > 0 ? this.generateEducationHTML(education) : ''}
    
    <!-- Skills Section -->
    ${header?.skills?.length > 0 ? this.generateSkillsHTML(header.skills) : ''}
  </div>
</body>
</html>`;
  }

  /**
   * Generate header HTML section
   */
  generateHeaderHTML(header) {
    if (!header) return '';

    const { name, shortAbout, location, contacts = {}, photoUrl } = header;
    const contactLinks = [];

    // Build contact information
    if (contacts.email) contactLinks.push(`📧 ${contacts.email}`);
    if (contacts.phone) contactLinks.push(`📞 ${contacts.phone}`);
    if (contacts.website) contactLinks.push(`🌐 ${contacts.website}`);
    if (contacts.linkedin) contactLinks.push(`💼 linkedin.com/in/${contacts.linkedin}`);
    if (contacts.github) contactLinks.push(`💻 github.com/${contacts.github}`);

    return `
    <header class="resume-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="name">${name || 'Professional Name'}</h1>
          ${shortAbout ? `<p class="tagline">${shortAbout}</p>` : ''}
          ${location ? `<p class="location">📍 ${location}</p>` : ''}
          ${contactLinks.length > 0 ? `
            <div class="contact-info">
              ${contactLinks.map(contact => `<span class="contact-item">${contact}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    </header>`;
  }

  /**
   * Generate summary HTML section
   */
  generateSummaryHTML(summary) {
    return `
    <section class="resume-section">
      <h2 class="section-title">Professional Summary</h2>
      <div class="section-content">
        <p class="summary-text">${summary}</p>
      </div>
    </section>`;
  }

  /**
   * Generate work experience HTML section
   */
  generateWorkExperienceHTML(workExperience) {
    return `
    <section class="resume-section">
      <h2 class="section-title">Professional Experience</h2>
      <div class="section-content">
        ${workExperience.map(job => `
          <div class="experience-item">
            <div class="experience-header">
              <div class="job-info">
                <h3 class="job-title">${job.title || 'Position Title'}</h3>
                <h4 class="company">${job.company || 'Company Name'}${job.location ? ` • ${job.location}` : ''}</h4>
              </div>
              <div class="date-range">
                <span class="dates">${job.start || 'Start'} - ${job.end || 'End'}</span>
                ${job.contract ? `<span class="contract-type">${job.contract}</span>` : ''}
              </div>
            </div>
            ${job.description ? `<p class="job-description">${job.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </section>`;
  }

  /**
   * Generate projects HTML section
   */
  generateProjectsHTML(projects) {
    return `
    <section class="resume-section">
      <h2 class="section-title">Key Projects</h2>
      <div class="section-content">
        ${projects.map(project => `
          <div class="project-item">
            <div class="project-header">
              <h3 class="project-title">${project.name || project.title || 'Project Name'}</h3>
              ${(project.startDate || project.endDate || project.duration) ? `
                <span class="project-dates">
                  ${project.startDate && project.endDate ? `${project.startDate} - ${project.endDate}` : 
                    project.duration ? project.duration : 
                    project.startDate ? project.startDate : 
                    project.endDate || ''}
                </span>
              ` : ''}
            </div>
            ${project.description ? `<p class="project-description">${project.description}</p>` : ''}
            ${project.technologies && project.technologies.length > 0 ? `
              <div class="tech-stack">
                <strong>Technologies:</strong> ${project.technologies.join(', ')}
              </div>
            ` : ''}
            ${(project.liveUrl || project.githubUrl || project.demoUrl) ? `
              <div class="project-links">
                ${project.liveUrl ? `<span class="project-link">🌐 ${project.liveUrl}</span>` : ''}
                ${project.githubUrl ? `<span class="project-link">💻 ${project.githubUrl}</span>` : ''}
                ${project.demoUrl ? `<span class="project-link">🎯 ${project.demoUrl}</span>` : ''}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </section>`;
  }

  /**
   * Generate education HTML section
   */
  generateEducationHTML(education) {
    return `
    <section class="resume-section">
      <h2 class="section-title">Education</h2>
      <div class="section-content">
        ${education.map(edu => `
          <div class="education-item">
            <div class="education-header">
              <div class="education-info">
                <h3 class="degree">${edu.degree || 'Degree'}</h3>
                <h4 class="school">${edu.school || 'Institution'}</h4>
              </div>
              <div class="education-dates">
                <span class="dates">${edu.start || 'Start'} - ${edu.end || 'End'}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>`;
  }

  /**
   * Generate skills HTML section
   */
  generateSkillsHTML(skills) {
    return `
    <section class="resume-section">
      <h2 class="section-title">Core Skills</h2>
      <div class="section-content">
        <div class="skills-grid">
          ${skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
        </div>
      </div>
    </section>`;
  }

  /**
   * Professional CSS styles for PDF
   */
  getProfessionalCSS() {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 11pt;
        line-height: 1.4;
        color: #2c3e50;
        background: #ffffff;
      }

      .resume-container {
        max-width: 100%;
        margin: 0 auto;
        padding: 0;
      }

      /* Header Styles */
      .resume-header {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        color: white;
        padding: 20pt 0;
        margin-bottom: 20pt;
        text-align: center;
      }

      .header-content {
        padding: 0 20pt;
      }

      .name {
        font-size: 24pt;
        font-weight: bold;
        margin-bottom: 5pt;
        letter-spacing: 1px;
      }

      .tagline {
        font-size: 12pt;
        margin-bottom: 5pt;
        font-style: italic;
        opacity: 0.9;
      }

      .location {
        font-size: 10pt;
        margin-bottom: 10pt;
        opacity: 0.8;
      }

      .contact-info {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 15pt;
        font-size: 9pt;
      }

      .contact-item {
        white-space: nowrap;
      }

      /* Section Styles */
      .resume-section {
        margin-bottom: 20pt;
        page-break-inside: avoid;
      }

      .section-title {
        font-size: 14pt;
        font-weight: bold;
        color: #2c3e50;
        border-bottom: 2px solid #3498db;
        padding-bottom: 5pt;
        margin-bottom: 12pt;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .section-content {
        padding-left: 10pt;
      }

      /* Summary Styles */
      .summary-text {
        font-size: 11pt;
        line-height: 1.5;
        text-align: justify;
      }

      /* Experience Styles */
      .experience-item {
        margin-bottom: 15pt;
        page-break-inside: avoid;
      }

      .experience-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8pt;
      }

      .job-title {
        font-size: 12pt;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 2pt;
      }

      .company {
        font-size: 11pt;
        color: #7f8c8d;
        font-weight: normal;
      }

      .date-range {
        text-align: right;
        font-size: 10pt;
        color: #7f8c8d;
      }

      .dates {
        display: block;
        font-weight: bold;
      }

      .contract-type {
        display: block;
        font-style: italic;
        margin-top: 2pt;
      }

      .job-description {
        font-size: 10pt;
        line-height: 1.4;
        text-align: justify;
        margin-top: 5pt;
      }

      /* Project Styles */
      .project-item {
        margin-bottom: 12pt;
        page-break-inside: avoid;
      }

      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 5pt;
      }

      .project-title {
        font-size: 11pt;
        font-weight: bold;
        color: #2c3e50;
      }

      .project-dates {
        font-size: 9pt;
        color: #7f8c8d;
        font-weight: bold;
      }

      .project-description {
        font-size: 10pt;
        line-height: 1.4;
        margin-bottom: 5pt;
        text-align: justify;
      }

      .tech-stack {
        font-size: 9pt;
        color: #34495e;
        margin-bottom: 3pt;
      }

      .project-links {
        font-size: 9pt;
        color: #3498db;
      }

      .project-link {
        display: inline-block;
        margin-right: 15pt;
      }

      /* Education Styles */
      .education-item {
        margin-bottom: 10pt;
        page-break-inside: avoid;
      }

      .education-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .degree {
        font-size: 11pt;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 2pt;
      }

      .school {
        font-size: 10pt;
        color: #7f8c8d;
        font-weight: normal;
      }

      .education-dates {
        font-size: 9pt;
        color: #7f8c8d;
        font-weight: bold;
      }

      /* Skills Styles */
      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120pt, 1fr));
        gap: 5pt;
      }

      .skill-item {
        background: #ecf0f1;
        color: #2c3e50;
        padding: 4pt 8pt;
        border-radius: 3pt;
        font-size: 9pt;
        font-weight: 500;
        text-align: center;
        border-left: 3px solid #3498db;
      }

      /* Print Optimization */
      @media print {
        body {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        
        .resume-section {
          page-break-inside: avoid;
        }
        
        .experience-item,
        .project-item,
        .education-item {
          page-break-inside: avoid;
        }
      }

      /* Page breaks */
      .page-break {
        page-break-before: always;
      }
    `;
  }
}

export default new PDFGenerator();