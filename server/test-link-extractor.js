/**
 * Test utility for link extraction functionality
 */
import linkExtractor from './utils/linkExtractor.js';
import fs from 'fs';
import path from 'path';

// Sample resume text with various links
const sampleResumeText = `
John Doe
Senior Software Engineer
johndoe@example.com | +1 (555) 123-4567 | New York, NY
https://johndoe.dev | https://github.com/johndoe | https://linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years specializing in full-stack development.
Passionate about building scalable web applications and mentoring junior developers.

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | https://techcorp.com
January 2020 - Present | New York, NY
- Led development of company's flagship product, increasing user engagement by 40%
- Built RESTful APIs using Node.js and Express
- Mentored junior developers and conducted code reviews

Software Engineer | DataSystems | www.datasystems.io
March 2017 - December 2019 | Remote
- Developed frontend components using React and TypeScript
- Implemented CI/CD pipelines using GitHub Actions

PROJECTS
Personal Portfolio - Redesigned my personal website using Next.js and Tailwind CSS.
https://johndoe.dev

Task Manager - A productivity app built with React and Firebase.
https://github.com/johndoe/task-manager | https://task-manager-demo.vercel.app

Weather Dashboard - Real-time weather forecasting tool using OpenWeather API.
Check it out at: https://weather-app.netlify.app

EDUCATION
Master of Computer Science | Stanford University
2015 - 2017

Bachelor of Science in Computer Engineering | MIT
2011 - 2015

SKILLS
JavaScript, TypeScript, React, Node.js, Express, MongoDB, PostgreSQL, AWS, Docker

CERTIFICATIONS
AWS Certified Developer - Associate | aws.amazon.com/certification
February 2021 | Credential ID: ABC123XYZ

PUBLICATIONS
"Modern JavaScript Patterns" | Published on Medium | medium.com/@johndoe/modern-js-patterns
March 2022
`;

// Test function to run the link extraction
const testLinkExtraction = () => {
  console.log('🧪 Testing link extraction functionality...\n');
  
  try {
    // Test basic extraction
    const extractedLinks = linkExtractor.extractAndCategorizeLinks(sampleResumeText);
    console.log('📝 Basic Link Extraction Results:');
    console.log('------------------------------');
    console.log(`Total Links Found: ${extractedLinks.all.length}`);
    console.log('\n🔍 Categorized Links:');
    
    Object.entries(extractedLinks.categorized).forEach(([category, links]) => {
      if (links.length > 0) {
        console.log(`\n${category.toUpperCase()} Links (${links.length}):`)
        links.forEach(link => console.log(`  - ${link}`));
      }
    });
    
    console.log('\n👤 Contact Information:');
    Object.entries(extractedLinks.contacts).forEach(([type, value]) => {
      if (value) console.log(`  - ${type}: ${value}`);
    });
    
    // Test contextual extraction
    console.log('\n\n🔎 Testing Contextual Link Extraction:');
    console.log('----------------------------------');
    const contextResults = linkExtractor.extractLinksWithContext(sampleResumeText);
    
    console.log(`Found ${contextResults.projectLinks.length} project-related links:`);
    contextResults.projectLinks.forEach((project, index) => {
      console.log(`\nProject ${index + 1}:`);
      console.log(`Description: ${project.description}`);
      console.log(`Links:`);
      project.links.forEach(link => console.log(`  - ${link}`));
    });
    
    console.log('\n\n📊 Link Statistics:');
    console.log(`Total links: ${contextResults.stats.totalLinks}`);
    console.log(`Social links: ${contextResults.stats.socialLinks}`);
    console.log(`Project links: ${contextResults.stats.projectLinks}`);
    console.log(`Professional links: ${contextResults.stats.professionalLinks}`);
    
    // Test work experience enhancement
    const sampleWorkExperience = [
      {
        company: 'TechCorp',
        title: 'Senior Developer',
        description: 'Worked on various projects'
      },
      {
        company: 'DataSystems',
        title: 'Software Engineer',
        description: 'Built data processing pipelines'
      }
    ];
    
    console.log('\n\n🏢 Testing Work Experience Link Enhancement:');
    console.log('------------------------------------------');
    const enhancedWorkExperience = linkExtractor.enhanceWorkExperienceWithLinks(
      sampleWorkExperience,
      contextResults.categorized
    );
    
    enhancedWorkExperience.forEach((job, index) => {
      console.log(`\nJob ${index + 1}: ${job.company}`);
      console.log(`Title: ${job.title}`);
      console.log(`Link: ${job.link || 'None'}`);
    });
    
    // Test project enhancement
    const sampleProjects = [
      {
        name: 'Task Manager',
        description: 'A productivity app'
      },
      {
        name: 'Weather Dashboard',
        description: 'Weather forecasting tool'
      }
    ];
    
    console.log('\n\n💻 Testing Project Link Enhancement:');
    console.log('----------------------------------');
    const enhancedProjects = linkExtractor.enhanceProjectsWithLinks(
      sampleProjects,
      contextResults.categorized
    );
    
    enhancedProjects.forEach((project, index) => {
      console.log(`\nProject ${index + 1}: ${project.name}`);
      console.log(`Description: ${project.description}`);
      console.log(`Link: ${project.link || 'None'}`);
    });
    
    console.log('\n✅ Link extraction tests completed successfully!');
  } catch (error) {
    console.error('❌ Error during link extraction testing:', error);
  }
};

// Run the test
testLinkExtraction();
