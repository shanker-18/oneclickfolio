import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  ChevronDown, 
  Check, 
  Moon, 
  Sun, 
  Monitor,
  Sparkles,
  Grid3x3,
  Layout,
  Zap,
  Settings,
  RefreshCw,
  Shuffle,
  Eye,
  Crown,
  Star,
  Gem,
  Heart,
  Droplets,
  Type,
  PaintBucket
} from "lucide-react";
import { useTheme } from '../context/ThemeContext';

const ThemeSelectorEnhanced = () => {
  const {
    currentTheme,
    currentMode, 
    currentTemplate,
    availableThemes,
    availableTemplates,
    themeCategories,
    themeColors,
    changeTheme,
    changeMode,
    changeTemplate,
    toggleMode,
    getThemeClass,
    assignRandomTheme,
    switchThemeWithAnimation,
    isRandomlyAssigned
  } = useTheme();

  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewedTheme, setPreviewedTheme] = useState(null);
  const [customColors, setCustomColors] = useState({
    primaryText: '#1f2937',
    secondaryText: '#6b7280',
    headerGradientStart: '#667eea',
    headerGradientEnd: '#764ba2',
    skillsGradient: '#6a11cb',
    backgroundColor: '#f9fafb',
    cardBackground: '#ffffff'
  });
  const [livePreview, setLivePreview] = useState(false);
  const [isQuickColorOpen, setIsQuickColorOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsThemeOpen(false);
        setIsTemplateOpen(false);
        setIsColorOpen(false);
        setIsQuickColorOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'dark': return <Moon className="h-4 w-4" />;
      case 'light': return <Sun className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getTemplateIcon = (template) => {
    const icons = {
      modern: <Layout className="h-4 w-4" />,
      creative: <Sparkles className="h-4 w-4" />,
      minimalist: <Grid3x3 className="h-4 w-4" />,
      executive: <Settings className="h-4 w-4" />,
      portfolio: <Zap className="h-4 w-4" />,
      magazine: <RefreshCw className="h-4 w-4" />,
      startup: <Star className="h-4 w-4" />,
      academic: <Crown className="h-4 w-4" />,
      luxury: <Gem className="h-4 w-4" />
    };
    return icons[template?.id] || <Layout className="h-4 w-4" />;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      professional: <Settings className="h-3 w-3" />,
      creative: <Sparkles className="h-3 w-3" />,
      nature: <RefreshCw className="h-3 w-3" />,
      minimalist: <Grid3x3 className="h-3 w-3" />,
      warm: <Sun className="h-3 w-3" />,
      artistic: <Palette className="h-3 w-3" />,
      luxury: <Crown className="h-3 w-3" />,
      modern: <Zap className="h-3 w-3" />,
      elegant: <Heart className="h-3 w-3" />
    };
    return icons[category] || <Palette className="h-3 w-3" />;
  };

  const getThemeIcon = (themeKey) => {
    const icons = {
      default: <Layout className="h-4 w-4 text-gray-900" />,
      sapphire: <Gem className="h-4 w-4 text-blue-600" />,
      emerald: <RefreshCw className="h-4 w-4 text-emerald-600" />,
      sunset: <Sun className="h-4 w-4 text-orange-600" />,
      royal: <Crown className="h-4 w-4 text-purple-600" />,
      aurora: <Sparkles className="h-4 w-4 text-cyan-500" />,
      midnight: <Moon className="h-4 w-4 text-slate-700" />,
      coral: <Heart className="h-4 w-4 text-pink-500" />,
      obsidian: <Zap className="h-4 w-4 text-gray-900" />,
      cherry: <Heart className="h-4 w-4 text-rose-500" />
    };
    return icons[themeKey] || <Palette className="h-4 w-4" />;
  };

  const filteredThemes = selectedCategory === 'all' 
    ? availableThemes 
    : availableThemes.filter(theme => 
        themeCategories[selectedCategory]?.includes(theme.key)
      );

  const currentThemeData = availableThemes.find(t => t.key === currentTheme);
  const currentTemplateData = availableTemplates.find(t => t.id === currentTemplate);

  // Color customization handlers
  const handleColorChange = (colorKey, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
    
    // Apply immediately if live preview is enabled
    if (livePreview) {
      const root = document.documentElement;
      const cssVar = colorKey.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--color-${cssVar}`, value);
    }
  };

  const handleResetColors = () => {
    // Reset to current theme's default colors
    const themeDefaults = themeColors[currentTheme] || {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#6a11cb',
      text: '#1f2937',
      textSecondary: '#6b7280',
      background: '#f9fafb',
      surface: '#ffffff'
    };
    
    setCustomColors({
      primaryText: themeDefaults.text,
      secondaryText: themeDefaults.textSecondary,
      headerGradientStart: themeDefaults.primary,
      headerGradientEnd: themeDefaults.secondary,
      skillsGradient: themeDefaults.accent,
      backgroundColor: themeDefaults.background,
      cardBackground: themeDefaults.surface
    });
  };

  const handleApplyColors = () => {
    // Apply custom colors to CSS variables for the portfolio
    const root = document.documentElement;
    const body = document.body;
    
    // Apply to root CSS variables
    root.style.setProperty('--custom-primary-text', customColors.primaryText);
    root.style.setProperty('--custom-secondary-text', customColors.secondaryText);
    root.style.setProperty('--custom-background', customColors.backgroundColor);
    root.style.setProperty('--custom-card-background', customColors.cardBackground);
    root.style.setProperty('--custom-header-gradient-start', customColors.headerGradientStart);
    root.style.setProperty('--custom-header-gradient-end', customColors.headerGradientEnd);
    root.style.setProperty('--custom-skills-gradient', customColors.skillsGradient);
    
    // Apply to body for immediate effect
    body.style.setProperty('--text-primary', customColors.primaryText);
    body.style.setProperty('--text-secondary', customColors.secondaryText);
    body.style.setProperty('--bg-primary', customColors.backgroundColor);
    body.style.setProperty('--bg-card', customColors.cardBackground);
    body.style.setProperty('--header-gradient-start', customColors.headerGradientStart);
    body.style.setProperty('--header-gradient-end', customColors.headerGradientEnd);
    body.style.setProperty('--skills-gradient', customColors.skillsGradient);
    
    // Apply inline styles to portfolio text elements
    const portfolioElements = {
      // Primary text elements (headings, titles)
      'h1, h2, h3, h4, h5, h6': customColors.primaryText,
      '.text-3xl, .text-2xl, .text-xl, .text-lg': customColors.primaryText,
      '.font-bold, .font-semibold': customColors.primaryText,
      // Secondary text elements (descriptions, body text)
      'p, .text-sm, .text-base': customColors.secondaryText,
      '.opacity-90, .opacity-80': customColors.secondaryText
    };
    
    // Apply styles directly to elements
    Object.entries(portfolioElements).forEach(([selector, color]) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.setProperty('color', color, 'important');
      });
    });
    
    // Update header gradient specifically
    const headerElements = document.querySelectorAll('[class*="bg-gradient"], [class*="from-"], .portfolio-header, .resume-header');
    headerElements.forEach(element => {
      element.style.setProperty('background', `linear-gradient(135deg, ${customColors.headerGradientStart}, ${customColors.headerGradientEnd})`, 'important');
    });
    
    // Also update any gradient elements in the header
    const gradientElements = document.querySelectorAll('[style*="gradient"]');
    gradientElements.forEach(element => {
      if (element.closest('header') || element.classList.contains('gradient')) {
        element.style.setProperty('background', `linear-gradient(135deg, ${customColors.headerGradientStart}, ${customColors.headerGradientEnd})`, 'important');
      }
    });
    
    // Update all text elements with theme classes
    const primaryTextElements = document.querySelectorAll('[class*="text-slate-900"], [class*="text-gray-900"], [class*="text-primary"]');
    primaryTextElements.forEach(element => {
      element.style.color = customColors.primaryText + ' !important';
    });
    
    const secondaryTextElements = document.querySelectorAll('[class*="text-slate-600"], [class*="text-gray-600"], [class*="text-secondary"]');
    secondaryTextElements.forEach(element => {
      element.style.color = customColors.secondaryText + ' !important';
    });
    
    // Store in localStorage for persistence
    localStorage.setItem('customColors', JSON.stringify(customColors));
    
    // Add a temporary success indicator to the quick color changer Apply button
    const applyButtons = document.querySelectorAll('button');
    applyButtons.forEach(button => {
      if (button.textContent.includes('Apply Now')) {
        const originalText = button.textContent;
        button.textContent = '✓ Applied!';
        button.style.backgroundColor = '#10b981';
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = '#3b82f6';
        }, 2000);
      }
    });
    
    // Force a re-render of theme colors
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  };

  // Load custom colors from localStorage on component mount
  useEffect(() => {
    const savedColors = localStorage.getItem('customColors');
    if (savedColors) {
      try {
        const parsedColors = JSON.parse(savedColors);
        setCustomColors(parsedColors);
        // Apply the saved colors immediately
        setTimeout(() => {
          const tempCustomColors = customColors;
          Object.assign(tempCustomColors, parsedColors);
          applyColorsDirectly(parsedColors);
        }, 1000); // Wait for DOM to be ready
      } catch (error) {
        console.warn('Failed to load custom colors:', error);
      }
    }
  }, []);
  
  // Helper function to apply colors directly
  const applyColorsDirectly = (colors) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Apply to CSS variables
    root.style.setProperty('--custom-primary-text', colors.primaryText);
    root.style.setProperty('--custom-secondary-text', colors.secondaryText);
    body.style.setProperty('--text-primary', colors.primaryText);
    body.style.setProperty('--text-secondary', colors.secondaryText);
    
    // Apply to text elements
    const primaryElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .text-3xl, .text-2xl, .text-xl, .text-lg, .font-bold, .font-semibold');
    primaryElements.forEach(element => {
      element.style.setProperty('color', colors.primaryText, 'important');
    });
    
    const secondaryElements = document.querySelectorAll('p, .text-sm, .text-base, .opacity-90, .opacity-80');
    secondaryElements.forEach(element => {
      element.style.setProperty('color', colors.secondaryText, 'important');
    });
    
    // Apply header gradient
    const headerElements = document.querySelectorAll('[class*="bg-gradient"], [class*="from-"]');
    headerElements.forEach(element => {
      element.style.setProperty('background', `linear-gradient(135deg, ${colors.headerGradientStart}, ${colors.headerGradientEnd})`, 'important');
    });
  };

  // Update custom colors when theme changes - but don't auto-reset
  useEffect(() => {
    // Only reset if it's a significant theme change, not just mode toggle
    if (currentTheme && themeColors) {
      console.log(`🎨 Theme changed to ${currentTheme}, updating colors`);
    }
  }, [currentTheme]);

  const handleExportColors = () => {
    const colorConfig = {
      theme: currentTheme,
      customColors,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(colorConfig, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTheme}-custom-colors.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportColors = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const colorConfig = JSON.parse(e.target.result);
        if (colorConfig.customColors) {
          setCustomColors(colorConfig.customColors);
          // Auto-apply the imported colors
          setTimeout(() => {
            handleApplyColors();
          }, 100);
        }
      } catch (error) {
        console.error('Failed to import color configuration:', error);
        alert('Invalid color configuration file');
      }
    };
    reader.readAsText(file);
  };

  const handleCopyColorConfig = () => {
    const colorConfig = {
      theme: currentTheme,
      customColors,
      cssVariables: {
        '--color-primary-text': customColors.primaryText,
        '--color-secondary-text': customColors.secondaryText,
        '--color-background': customColors.backgroundColor,
        '--color-card-background': customColors.cardBackground,
        '--color-header-gradient-start': customColors.headerGradientStart,
        '--color-header-gradient-end': customColors.headerGradientEnd,
        '--color-skills-gradient': customColors.skillsGradient
      }
    };
    
    navigator.clipboard.writeText(JSON.stringify(colorConfig, null, 2))
      .then(() => {
        // You could add a toast notification here
        console.log('Color configuration copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy color configuration:', err);
      });
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex items-center space-x-3" ref={dropdownRef}>
      {/* Random Theme Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={assignRandomTheme}
        className={getThemeClass(
          "flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm border-2",
          "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900",
          "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white"
        )}
        title="Get a random theme and template combination"
      >
        <Shuffle className="h-4 w-4" />
        <span className="text-sm">Surprise Me!</span>
      </motion.button>
      
      {/* Quick Word Color Changer */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsQuickColorOpen(!isQuickColorOpen);
            setIsThemeOpen(false);
            setIsTemplateOpen(false);
            setIsColorOpen(false);
          }}
          className={getThemeClass(
            "flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm border-2",
            "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900",
            "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white"
          )}
          title="Quick text color adjustment"
        >
          <Type className="h-4 w-4" />
          <span className="text-sm">Word Colors</span>
          <motion.div
            animate={{ rotate: isQuickColorOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-3 w-3" />
          </motion.div>
        </motion.button>
        
        <AnimatePresence>
          {isQuickColorOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dropdownVariants}
              className={getThemeClass(
                "absolute top-full mt-2 w-80 rounded-xl shadow-2xl border backdrop-blur-md z-50",
                "bg-white/95 border-gray-200",
                "bg-gray-800/95 border-gray-600"
              )}
            >
              <div className="p-4 space-y-4">
                <div className="text-center">
                  <h3 className={getThemeClass(
                    "text-sm font-semibold mb-2",
                    "text-gray-800",
                    "text-gray-200"
                  )}>Quick Text Colors</h3>
                  <p className={getThemeClass(
                    "text-xs",
                    "text-gray-600",
                    "text-gray-400"
                  )}>Instantly change your text colors</p>
                </div>
                
                <div className="space-y-3">
                  {/* Primary Text Color */}
                  <div className="flex items-center justify-between">
                    <label className={getThemeClass(
                      "text-sm font-medium",
                      "text-gray-700",
                      "text-gray-300"
                    )}>Main Text</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customColors.primaryText}
                        onChange={(e) => {
                          handleColorChange('primaryText', e.target.value);
                          if (livePreview) {
                            const root = document.documentElement;
                            root.style.setProperty('--custom-primary-text', e.target.value);
                            // Force update theme colors
                            document.body.style.setProperty('--text-primary', e.target.value);
                          }
                        }}
                        className="w-8 h-8 rounded-md border-2 border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColors.primaryText}
                        onChange={(e) => {
                          handleColorChange('primaryText', e.target.value);
                          if (livePreview) {
                            const root = document.documentElement;
                            root.style.setProperty('--color-primary-text', e.target.value);
                          }
                        }}
                        className={getThemeClass(
                          "w-20 px-2 py-1 text-xs rounded border font-mono",
                          "bg-white border-gray-300 text-gray-900",
                          "bg-gray-700 border-gray-500 text-gray-100"
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Secondary Text Color */}
                  <div className="flex items-center justify-between">
                    <label className={getThemeClass(
                      "text-sm font-medium",
                      "text-gray-700",
                      "text-gray-300"
                    )}>Sub Text</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customColors.secondaryText}
                        onChange={(e) => {
                          handleColorChange('secondaryText', e.target.value);
                          if (livePreview) {
                            const root = document.documentElement;
                            root.style.setProperty('--custom-secondary-text', e.target.value);
                            // Force update theme colors
                            document.body.style.setProperty('--text-secondary', e.target.value);
                          }
                        }}
                        className="w-8 h-8 rounded-md border-2 border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColors.secondaryText}
                        onChange={(e) => {
                          handleColorChange('secondaryText', e.target.value);
                          if (livePreview) {
                            const root = document.documentElement;
                            root.style.setProperty('--color-secondary-text', e.target.value);
                          }
                        }}
                        className={getThemeClass(
                          "w-20 px-2 py-1 text-xs rounded border font-mono",
                          "bg-white border-gray-300 text-gray-900",
                          "bg-gray-700 border-gray-500 text-gray-100"
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Header Gradient Start */}
                  <div className="flex items-center justify-between">
                    <label className={getThemeClass(
                      "text-sm font-medium",
                      "text-gray-700",
                      "text-gray-300"
                    )}>Header Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customColors.headerGradientStart}
                        onChange={(e) => {
                          handleColorChange('headerGradientStart', e.target.value);
                          if (livePreview) {
                            const root = document.documentElement;
                            root.style.setProperty('--custom-header-gradient-start', e.target.value);
                            // Force update theme colors
                            document.body.style.setProperty('--header-gradient-start', e.target.value);
                          }
                        }}
                        className="w-8 h-8 rounded-md border-2 border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColors.headerGradientStart}
                        onChange={(e) => {
                          handleColorChange('headerGradientStart', e.target.value);
                          if (livePreview) {
                            const root = document.documentElement;
                            root.style.setProperty('--color-header-gradient-start', e.target.value);
                          }
                        }}
                        className={getThemeClass(
                          "w-20 px-2 py-1 text-xs rounded border font-mono",
                          "bg-white border-gray-300 text-gray-900",
                          "bg-gray-700 border-gray-500 text-gray-100"
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => setLivePreview(!livePreview)}
                    className={`flex-1 px-3 py-2 text-xs rounded-md font-medium transition-colors ${
                      livePreview 
                        ? 'bg-green-500 text-white'
                        : getThemeClass(
                            '',
                            'bg-gray-100 text-gray-700 hover:bg-gray-200',
                            'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          )
                    }`}
                  >
                    {livePreview ? '✓ Live On' : 'Live Off'}
                  </button>
                  
                  <button
                    onClick={handleApplyColors}
                    className="flex-1 px-3 py-2 text-xs rounded-md font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    Apply Now
                  </button>
                  
                  <button
                    onClick={handleResetColors}
                    className={getThemeClass(
                      "flex-1 px-3 py-2 text-xs rounded-md font-medium transition-colors",
                      "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    )}
                  >
                    Reset
                  </button>
                </div>
                
                {/* Preview */}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-center space-y-1">
                    <p style={{ color: customColors.primaryText }} className="text-sm font-semibold">
                      Main Text Preview
                    </p>
                    <p style={{ color: customColors.secondaryText }} className="text-xs">
                      Secondary text preview
                    </p>
                    <div 
                      className="h-6 rounded text-white text-xs flex items-center justify-center font-medium"
                      style={{ background: `linear-gradient(135deg, ${customColors.headerGradientStart}, ${customColors.headerGradientEnd})` }}
                    >
                      Header Preview
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Theme Selector */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsThemeOpen(!isThemeOpen);
            setIsTemplateOpen(false);
          }}
          className={getThemeClass(
            "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm",
            "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
            "bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500"
          )}
        >
          {getThemeIcon(currentTheme)}
          <span className="text-sm font-semibold">
            {currentThemeData?.name || 'Clean Professional'}
          </span>
          {isRandomlyAssigned && (
            <Star className="h-3 w-3 text-yellow-500" title="Randomly assigned theme" />
          )}
          <motion.div
            animate={{ rotate: isThemeOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-3 w-3" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isThemeOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={getThemeClass(
                "absolute top-12 left-0 w-96 rounded-xl shadow-2xl border backdrop-blur-sm z-50 max-h-[500px] overflow-hidden",
                "bg-white/95 border-gray-200",
                "bg-gray-800/95 border-gray-600"
              )}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className={getThemeClass(
                    "text-lg font-semibold",
                    "text-gray-900",
                    "text-gray-100"
                  )}>
                    Choose Premium Theme
                  </h3>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className={getThemeClass(
                        "p-2 rounded-md transition-colors",
                        "hover:bg-gray-100",
                        "hover:bg-gray-700"
                      )}
                      title="Preview Mode"
                    >
                      <Eye className={`h-4 w-4 ${isPreviewMode ? 'text-blue-500' : ''}`} />
                    </motion.button>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-gradient-to-r ' + themeColors.gradients.header + ' text-white'
                          : getThemeClass('', 'bg-gray-100 text-gray-700 hover:bg-gray-200', 'bg-gray-700 text-gray-300 hover:bg-gray-600')
                      }`}
                    >
                      All Themes
                    </motion.button>
                    {Object.keys(themeCategories).map(category => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`flex items-center space-x-1 px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r ' + themeColors.gradients.header + ' text-white'
                            : getThemeClass('', 'bg-gray-100 text-gray-700 hover:bg-gray-200', 'bg-gray-700 text-gray-300 hover:bg-gray-600')
                        }`}
                      >
                        {getCategoryIcon(category)}
                        <span className="capitalize">{category}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Theme Grid */}
                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {filteredThemes.map((theme, index) => (
                      <motion.button
                        key={theme.key}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          switchThemeWithAnimation(theme.key);
                          setIsThemeOpen(false);
                        }}
                        onMouseEnter={() => {
                          if (isPreviewMode) {
                            setPreviewedTheme(theme.key);
                          }
                        }}
                        onMouseLeave={() => {
                          if (isPreviewMode) {
                            setPreviewedTheme(null);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 group ${
                          currentTheme === theme.key
                            ? `bg-gradient-to-r ${themeColors.gradients.header} text-white shadow-lg transform scale-105`
                            : getThemeClass(
                                'hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-md hover:scale-102',
                                'hover:bg-gray-50 border border-transparent hover:border-gray-200',
                                'hover:bg-gray-700 border border-transparent hover:border-gray-600'
                              )
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            className={`flex-shrink-0`}
                          >
                            {getThemeIcon(theme.key)}
                          </motion.div>
                          <div className="text-left flex-1">
                            <div className={`text-sm font-semibold mb-1 ${
                              currentTheme === theme.key 
                                ? 'text-white' 
                                : getThemeClass('', 'text-gray-900', 'text-gray-100')
                            }`}>
                              {theme.name}
                            </div>
                            <div className={`text-xs ${
                              currentTheme === theme.key 
                                ? 'text-white/90'
                                : getThemeClass('', 'text-gray-500', 'text-gray-400')
                            }`}>
                              {theme.description}
                            </div>
                            <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${
                              currentTheme === theme.key 
                                ? 'bg-white/20 text-white/90'
                                : 'bg-gradient-to-r ' + theme.gradients?.header + ' text-white'
                            }`}>
                              {theme.category || 'Premium'}
                            </div>
                          </div>
                        </div>
                        {currentTheme === theme.key && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Check className="h-5 w-5 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Template Selector */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsTemplateOpen(!isTemplateOpen);
            setIsThemeOpen(false);
          }}
          className={getThemeClass(
            "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm",
            "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
            "bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500"
          )}
        >
          {getTemplateIcon(currentTemplateData)}
          <span className="text-sm font-semibold">
            {currentTemplateData?.name || 'Modern Professional'}
          </span>
          <motion.div
            animate={{ rotate: isTemplateOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-3 w-3" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isTemplateOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={getThemeClass(
                "absolute top-12 right-0 w-80 rounded-xl shadow-2xl border backdrop-blur-sm z-50 max-h-[400px] overflow-hidden",
                "bg-white/95 border-gray-200",
                "bg-gray-800/95 border-gray-600"
              )}
            >
              <div className="p-4">
                <h3 className={getThemeClass(
                  "text-sm font-semibold mb-4",
                  "text-gray-900",
                  "text-gray-100"
                )}>
                  Premium Layout Templates
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                  {availableTemplates.map((template, index) => (
                    <motion.button
                      key={template.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        changeTemplate(template.id);
                        setIsTemplateOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                        currentTemplate === template.id
                          ? `bg-gradient-to-r ${themeColors.gradients.header} text-white shadow-lg`
                          : getThemeClass(
                              'hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm',
                              'hover:bg-gray-50 border border-transparent hover:border-gray-200',
                              'hover:bg-gray-700 border border-transparent hover:border-gray-600'
                            )
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div whileHover={{ scale: 1.1 }}>
                          {getTemplateIcon(template)}
                        </motion.div>
                        <div className="text-left">
                          <div className={`text-sm font-medium ${
                            currentTemplate === template.id 
                              ? 'text-white' 
                              : getThemeClass('', 'text-gray-900', 'text-gray-100')
                          }`}>
                            {template.name}
                          </div>
                          <div className={`text-xs ${
                            currentTemplate === template.id 
                              ? 'text-white/80'
                              : getThemeClass('', 'text-gray-500', 'text-gray-400')
                          }`}>
                            {template.description}
                          </div>
                        </div>
                      </div>
                      {currentTemplate === template.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <Check className="h-4 w-4 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mode Toggle */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={toggleMode}
        className={getThemeClass(
          "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm",
          "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
          "bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500"
        )}
        title={`Switch to ${currentMode === 'light' ? 'dark' : 'light'} mode`}
      >
        <motion.div
          key={currentMode}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {getModeIcon(currentMode)}
        </motion.div>
        <span className="text-sm capitalize font-semibold">
          {currentMode}
        </span>
      </motion.button>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
      `}</style>
    </div>
  );
};

export default ThemeSelectorEnhanced;