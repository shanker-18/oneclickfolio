import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const DynamicTemplateRenderer = ({ portfolio, children }) => {
  const { currentTemplate, templateConfig, themeColors, getThemeClass } = useTheme();

  // Template-specific container styles
  const getTemplateContainerStyles = () => {
    switch (currentTemplate) {
      case 'modern':
        return `max-w-7xl mx-auto px-4 py-8 space-y-8`;
      
      case 'executive':
        return `max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8`;
      
      case 'creative':
        return `max-w-full px-4 py-8 columns-1 md:columns-2 lg:columns-3 gap-8`;
      
      case 'minimalist':
        return `max-w-4xl mx-auto px-8 py-16 space-y-12`;
      
      case 'magazine':
        return `max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8`;
      
      case 'startup':
        return `max-w-7xl mx-auto px-4 py-8 space-y-6`;
      
      case 'academic':
        return `max-w-5xl mx-auto px-6 py-12 space-y-10`;
      
      case 'portfolio':
        return `max-w-full px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`;
      
      case 'luxury':
        return `max-w-6xl mx-auto px-8 py-16 space-y-16`;
      
      default:
        return `max-w-7xl mx-auto px-4 py-8 space-y-8`;
    }
  };

  // Template-specific card styles
  const getCardStyles = () => {
    const baseStyles = templateConfig?.shadow || 'shadow-lg';
    const borderRadius = templateConfig?.borderRadius || 'rounded-xl';
    
    switch (currentTemplate) {
      case 'modern':
        return `${baseStyles} ${borderRadius} ${themeColors.card.light} border ${themeColors.border.light}`;
      
      case 'executive':
        return `shadow-md rounded-lg ${themeColors.card.light} border-l-4 border-blue-600`;
      
      case 'creative':
        return `shadow-2xl rounded-2xl ${themeColors.card.light} transform hover:scale-105 transition-all duration-300`;
      
      case 'minimalist':
        return `shadow-none border-l-4 ${themeColors.card.light} ${themeColors.border.light}`;
      
      case 'magazine':
        return `shadow-lg rounded-lg ${themeColors.card.light} overflow-hidden`;
      
      case 'startup':
        return `shadow-xl rounded-xl ${themeColors.card.light} border ${themeColors.border.light} hover:shadow-2xl transition-shadow duration-300`;
      
      case 'academic':
        return `shadow-sm rounded-md ${themeColors.card.light} border ${themeColors.border.light}`;
      
      case 'portfolio':
        return `shadow-2xl rounded-3xl ${themeColors.card.light} overflow-hidden hover:shadow-3xl transition-all duration-700`;
      
      case 'luxury':
        return `shadow-2xl rounded-xl ${themeColors.card.light} border-2 border-gold-200`;
      
      default:
        return `${baseStyles} ${borderRadius} ${themeColors.card.light} border ${themeColors.border.light}`;
    }
  };

  // Template-specific section styles
  const getSectionStyles = () => {
    switch (currentTemplate) {
      case 'modern':
        return `p-6 space-y-4`;
      
      case 'executive':
        return `p-8 space-y-6`;
      
      case 'creative':
        return `p-6 space-y-6`;
      
      case 'minimalist':
        return `p-8 space-y-8`;
      
      case 'magazine':
        return `p-6 space-y-4`;
      
      case 'startup':
        return `p-6 space-y-4`;
      
      case 'academic':
        return `p-8 space-y-6`;
      
      case 'portfolio':
        return `p-8 space-y-6`;
      
      case 'luxury':
        return `p-12 space-y-8`;
      
      default:
        return `p-6 space-y-4`;
    }
  };

  // Template-specific typography styles
  const getTypographyStyles = () => {
    const typography = templateConfig?.typography || {};
    return {
      heading: `${typography.headingFont || 'font-bold'} ${typography.headingSize || 'text-2xl'} ${themeColors.text.primary.light}`,
      body: `${typography.bodyFont || 'font-normal'} ${typography.bodySize || 'text-base'} ${themeColors.text.secondary.light}`
    };
  };

  // Animation variants based on template
  const getAnimationVariants = () => {
    switch (currentTemplate) {
      case 'creative':
        return {
          container: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          },
          item: {
            hidden: { opacity: 0, y: 20, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1 }
          }
        };
      
      case 'luxury':
        return {
          container: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.4 }
            }
          },
          item: {
            hidden: { opacity: 0, y: 40 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { type: "spring", stiffness: 100 }
            }
          }
        };
      
      case 'startup':
        return {
          container: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          },
          item: {
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }
        };
      
      default:
        return {
          container: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          },
          item: {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }
        };
    }
  };

  const containerStyles = getTemplateContainerStyles();
  const cardStyles = getCardStyles();
  const sectionStyles = getSectionStyles();
  const typographyStyles = getTypographyStyles();
  const animationVariants = getAnimationVariants();

  // Executive template layout (sidebar)
  if (currentTemplate === 'executive' && portfolio) {
    return (
      <motion.div 
        className={containerStyles}
        variants={animationVariants.container}
        initial="hidden"
        animate="visible"
      >
        {/* Left Sidebar - Contact & Skills */}
        <motion.div 
          className="lg:col-span-1 space-y-6"
          variants={animationVariants.item}
        >
          <div className={cardStyles}>
            <div className={sectionStyles}>
              {/* Contact Info */}
              {portfolio.header?.contacts && (
                <div>
                  <h3 className={typographyStyles.heading}>Contact</h3>
                  <div className="space-y-2 mt-4">
                    {portfolio.header.contacts.email && (
                      <div className={typographyStyles.body}>{portfolio.header.contacts.email}</div>
                    )}
                    {portfolio.header.contacts.phone && (
                      <div className={typographyStyles.body}>{portfolio.header.contacts.phone}</div>
                    )}
                    {portfolio.header.location && (
                      <div className={typographyStyles.body}>{portfolio.header.location}</div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Skills */}
              {portfolio.header?.skills && portfolio.header.skills.length > 0 && (
                <div>
                  <h3 className={typographyStyles.heading}>Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {portfolio.header.skills.map((skill, index) => (
                      <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${themeColors.gradients.skills}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="lg:col-span-2 space-y-6"
          variants={animationVariants.item}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  // Magazine template layout (multi-column)
  if (currentTemplate === 'magazine' && portfolio) {
    return (
      <motion.div 
        className={containerStyles}
        variants={animationVariants.container}
        initial="hidden"
        animate="visible"
      >
        {/* Header spans full width */}
        <motion.div 
          className="md:col-span-4 mb-8"
          variants={animationVariants.item}
        >
          <div className={cardStyles}>
            <div className={sectionStyles}>
              <h1 className={`${typographyStyles.heading} text-4xl`}>{portfolio.header?.name}</h1>
              <p className={`${typographyStyles.body} text-lg mt-2`}>{portfolio.header?.shortAbout}</p>
            </div>
          </div>
        </motion.div>

        {/* Main content in columns */}
        <motion.div 
          className="md:col-span-3"
          variants={animationVariants.item}
        >
          {children}
        </motion.div>

        {/* Sidebar */}
        <motion.div 
          className="md:col-span-1"
          variants={animationVariants.item}
        >
          <div className={cardStyles}>
            <div className={sectionStyles}>
              {portfolio.header?.skills && (
                <div>
                  <h3 className={typographyStyles.heading}>Skills</h3>
                  <div className="space-y-2 mt-4">
                    {portfolio.header.skills.map((skill, index) => (
                      <div key={index} className={`${typographyStyles.body} py-1`}>{skill}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Portfolio template layout (gallery grid)
  if (currentTemplate === 'portfolio') {
    return (
      <motion.div 
        className={containerStyles}
        variants={animationVariants.container}
        initial="hidden"
        animate="visible"
      >
        {React.Children.map(children, (child, index) => (
          <motion.div 
            key={index}
            variants={animationVariants.item}
            className="break-inside-avoid mb-6"
          >
            <div className={cardStyles}>
              <div className={sectionStyles}>
                {child}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // Default template layout
  return (
    <motion.div 
      className={containerStyles}
      variants={animationVariants.container}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div 
          key={index}
          variants={animationVariants.item}
        >
          <div className={cardStyles}>
            <div className={sectionStyles}>
              {child}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DynamicTemplateRenderer;