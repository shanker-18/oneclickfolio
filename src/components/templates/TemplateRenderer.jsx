import React from 'react';
import { getThemeColors } from '../../utils/themes';
import { API_BASE_URL } from '../../config/api.js';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import ElegantTemplate from './ElegantTemplate';
import MinimalTemplate from './MinimalTemplate';
import CreativeTemplate from './CreativeTemplate';
import TechTemplate from './TechTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import CreativeTemplateNew from './CreativeTemplateNew';

const TemplateRenderer = ({ 
  portfolio, 
  templateKey = 'modern', 
  themeKey = 'indigoPurple', 
  isEditing = false,
  onEdit,
  onPhotoUpload,
  colorMode = 'light'
}) => {
  // Get theme colors
  const themeColors = getThemeColors(themeKey, colorMode);
  
  // Normalize portfolio data for template consumption
  const normalizePortfolioData = (portfolio) => {
    if (!portfolio) return null;
    
    // Helper function to construct proper image URL
    const getImageUrl = (photoUrl) => {
      if (!photoUrl) return '';
      if (photoUrl.startsWith('http')) return photoUrl;
      const fullUrl = `${API_BASE_URL}${photoUrl}`;
      console.log('Constructed image URL:', fullUrl);
      return fullUrl;
    };
    
    return {
      // Header information
      name: portfolio.header?.name || portfolio.title || 'Portfolio',
      title: portfolio.header?.shortAbout || 'Professional Portfolio',
      location: portfolio.header?.location || '',
      photoUrl: getImageUrl(portfolio.header?.photoUrl),
      
      // Contact information
      email: portfolio.header?.contacts?.email || '',
      phone: portfolio.header?.contacts?.phone || '',
      website: portfolio.header?.contacts?.website || '',
      linkedin: portfolio.header?.contacts?.linkedin || '',
      github: portfolio.header?.contacts?.github || '',
      twitter: portfolio.header?.contacts?.twitter || '',
      
      // Content sections
      summary: portfolio.summary || '',
      skills: portfolio.header?.skills || [],
      workExperience: portfolio.workExperience || [],
      education: portfolio.education || [],
      
      // Extra sections (projects, certifications, etc.)
      extraSections: portfolio.extraSections || [],
      
      // Projects (extract from extra sections or use dedicated field)
      projects: portfolio.projects || extractProjectsFromExtraSections(portfolio.extraSections),
      
      // Certifications
      certifications: extractCertificationsFromExtraSections(portfolio.extraSections),
      
      // Languages
      languages: extractLanguagesFromExtraSections(portfolio.extraSections),
      
      // Meta information
      templateKey,
      themeKey,
      isPublished: portfolio.isPublished,
      updatedAt: portfolio.updatedAt
    };
  };
  
  // Helper functions to extract data from extra sections
  const extractProjectsFromExtraSections = (extraSections) => {
    if (!extraSections) return [];
    const projectsSection = extraSections.find(section => 
      section.key?.toLowerCase().includes('project') || 
      section.title?.toLowerCase().includes('project')
    );
    const projects = projectsSection?.items || [];
    
    // Enhance project data with proper URL formatting
    return projects.map(project => ({
      ...project,
      title: project.title || project.name || 'Untitled Project',
      name: project.name || project.title || 'Untitled Project',
      description: project.description || '',
      tech: Array.isArray(project.tech) ? project.tech : (project.technologies ? project.technologies : []),
      link: formatProjectLink(project.link || project.url || project.github || project.demo || '')
    }));
  };
  
  // Helper function to format and validate project links
  const formatProjectLink = (link) => {
    if (!link || typeof link !== 'string') return '';
    
    // Clean up the link
    const cleanLink = link.trim();
    if (!cleanLink) return '';
    
    // If it already has a protocol, return as is
    if (cleanLink.startsWith('http://') || cleanLink.startsWith('https://')) {
      return cleanLink;
    }
    
    // If it starts with www., add https://
    if (cleanLink.startsWith('www.')) {
      return `https://${cleanLink}`;
    }
    
    // If it looks like a domain (contains a dot), add https://
    if (cleanLink.includes('.') && !cleanLink.includes(' ')) {
      return `https://${cleanLink}`;
    }
    
    // If it's a GitHub repo reference (user/repo format), make it a GitHub URL
    if (/^[\w-]+\/[\w-]+$/.test(cleanLink) && !cleanLink.includes('.')) {
      return `https://github.com/${cleanLink}`;
    }
    
    // Return as is if we can't determine the format (might be a relative URL or special format)
    return cleanLink;
  };
  
  const extractCertificationsFromExtraSections = (extraSections) => {
    if (!extraSections) return [];
    const certSection = extraSections.find(section => 
      section.key?.toLowerCase().includes('certification') || 
      section.title?.toLowerCase().includes('certification')
    );
    return certSection?.items || [];
  };
  
  const extractLanguagesFromExtraSections = (extraSections) => {
    if (!extraSections) return [];
    const langSection = extraSections.find(section => 
      section.key?.toLowerCase().includes('language') || 
      section.title?.toLowerCase().includes('language')
    );
    return langSection?.items || [];
  };
  
  // Normalize the portfolio data
  const normalizedData = normalizePortfolioData(portfolio);
  
  if (!normalizedData) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No portfolio data available</p>
      </div>
    );
  }
  
  // Common props for all templates
  const templateProps = {
    displayData: normalizedData,
    portfolio: normalizedData,
    isEditing,
    onEdit,
    onPhotoUpload,
    currentTheme: themeKey,
    theme: colorMode,
    themeColors
  };
  
  // Render the appropriate template
  switch (templateKey) {
    case 'classic':
      return <ClassicTemplate {...templateProps} />;
    case 'modern':
      return <ModernTemplate {...templateProps} />;
    case 'elegant':
      return <ElegantTemplate {...templateProps} />;
    case 'minimal':
      return <MinimalTemplate {...templateProps} />;
    case 'creative':
      return <CreativeTemplate {...templateProps} />;
    case 'creative-new':
      return <CreativeTemplateNew {...templateProps} />;
    case 'tech':
      return <TechTemplate {...templateProps} />;
    case 'professional':
      return <ProfessionalTemplate {...templateProps} />;
    default:
      // Fallback to modern template
      return <ModernTemplate {...templateProps} />;
  }
};

export default TemplateRenderer;
