import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  themes, 
  templates, 
  getThemeColors, 
  getTemplateConfig,
  getSystemTheme,
  saveThemePreference,
  loadThemePreference,
  getAllThemes,
  getAllTemplates,
  themeCategories,
  initializeUserTheme,
  getRandomThemeAndTemplate,
  customAnimations
} from '../utils/themes';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize state with saved preferences or default clean theme for new users
  const [currentTheme, setCurrentTheme] = useState('default');
  const [currentMode, setCurrentMode] = useState('light');
  const [currentTemplate, setCurrentTemplate] = useState('modern');
  const [isInitialized, setIsInitialized] = useState(false);
  const [systemTheme, setSystemTheme] = useState('light');
  const [isRandomlyAssigned, setIsRandomlyAssigned] = useState(false);
  const [isStabilityPeriod, setIsStabilityPeriod] = useState(true);

  // Initialize theme preferences ONCE on mount - prevent unwanted switching
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const preferences = initializeUserTheme();
        console.log('🎨 Theme initialization:', preferences);
        
        // Use the actual preferences without forcing defaults
        const themeToSet = preferences.theme || 'default';
        const modeToSet = preferences.mode || 'light';
        const templateToSet = preferences.template || 'modern';
        
        console.log(`🎨 Final theme selection: ${themeToSet}, mode: ${modeToSet}, template: ${templateToSet}`);
        
        // Set all states at once to prevent conflicts
        setCurrentTheme(themeToSet);
        setCurrentMode(modeToSet);
        setCurrentTemplate(templateToSet);
        setIsRandomlyAssigned(preferences.isRandomlyAssigned || false);
        setSystemTheme(getSystemTheme());
        
        // Force save the current state to localStorage to prevent any overwrites
        saveThemePreference(themeToSet, modeToSet, templateToSet);
        
        setIsInitialized(true);
        
        // Remove stability period completely - allow immediate theme changes
        setIsStabilityPeriod(false);
        
        // Show welcome message
        if (preferences.isFirstTime) {
          console.log(`🎨 Welcome! Your portfolio is ready with a clean, professional look.`);
        } else {
          console.log(`🎨 Loaded saved theme: ${themeToSet}`);
        }
      } catch (error) {
        console.error('🚨 Theme initialization error:', error);
        // Fallback to default
        setCurrentTheme('default');
        setCurrentMode('light');
        setCurrentTemplate('modern');
        setIsInitialized(true);
      }
    };

    initializeTheme();
  }, []); // Empty dependency array - only run once

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e) => {
        setSystemTheme(e.matches ? 'dark' : 'light');
        // If user hasn't set a manual preference, follow system
        if (currentMode === 'system') {
          setCurrentMode(e.matches ? 'dark' : 'light');
        }
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [currentMode]);

  // Save preferences whenever they change (but not during initialization)
  useEffect(() => {
    if (isInitialized && currentTheme && currentMode && currentTemplate) {
      // Add a small delay to prevent conflicts during initialization
      const timeoutId = setTimeout(() => {
        console.log(`💾 Saving preferences: ${currentTheme}, ${currentMode}, ${currentTemplate}`);
        saveThemePreference(currentTheme, currentMode, currentTemplate);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentTheme, currentMode, currentTemplate, isInitialized]);

  // Theme change handlers with improved stability
  const changeTheme = useCallback((themeName) => {
    if (isStabilityPeriod) {
      console.log('⚠️ Theme change blocked during stability period');
      return;
    }
    
    if (themes[themeName] && themeName !== currentTheme) {
      console.log(`🎨 Changing theme from ${currentTheme} to ${themeName}`);
      setCurrentTheme(themeName);
      setIsRandomlyAssigned(false);
      
      // Force immediate save to prevent reverting
      if (isInitialized) {
        saveThemePreference(themeName, currentMode, currentTemplate);
      }
    }
  }, [currentTheme, currentMode, currentTemplate, isInitialized, isStabilityPeriod]);

  const changeMode = useCallback((mode) => {
    if (['light', 'dark', 'system'].includes(mode)) {
      if (mode === 'system') {
        setCurrentMode(systemTheme);
      } else {
        setCurrentMode(mode);
      }
    }
  }, [systemTheme]);

  const changeTemplate = useCallback((templateId) => {
    if (templates[templateId]) {
      setCurrentTemplate(templateId);
    }
  }, []);

  const toggleMode = useCallback(() => {
    setCurrentMode(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Get current theme configuration (early return if not initialized)
  const baseThemeColors = getThemeColors(currentTheme, currentMode);
  const templateConfig = getTemplateConfig(currentTemplate);
  const themeData = themes[currentTheme];
  
  // Return early if theme data is not loaded yet
  if (!baseThemeColors || !templateConfig || !themeData) {
    return (
      <ThemeContext.Provider value={{
        currentTheme: 'default',
        currentMode: 'light', 
        currentTemplate: 'modern',
        isInitialized: false,
        themeColors: {
          text: {
            primary: { light: 'text-gray-900', dark: 'text-gray-100' },
            secondary: { light: 'text-gray-600', dark: 'text-gray-300' }
          },
          background: { light: 'bg-white', dark: 'bg-gray-900' },
          surface: { light: 'bg-white shadow-sm border border-gray-100', dark: 'bg-gray-800 shadow-lg border border-gray-700' },
          gradients: { header: 'from-blue-600 via-purple-600 to-blue-800', skills: 'from-green-500 to-blue-600' }
        },
        availableThemes: [],
        availableTemplates: [],
        getThemeClass: (base, light, dark) => `${base} ${light}`,
        changeTheme: () => {},
        changeMode: () => {},
        changeTemplate: () => {},
        toggleMode: () => {},
        assignRandomTheme: () => {}
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  // Check for custom colors from localStorage or CSS variables
  const getCustomColorValue = (property) => {
    if (typeof document !== 'undefined') {
      const customValue = document.documentElement.style.getPropertyValue(property);
      return customValue || null;
    }
    return null;
  };

  // Merge base theme colors with any custom overrides (with null safety)
  const themeColors = baseThemeColors ? {
    ...baseThemeColors,
    text: {
      ...baseThemeColors.text,
      primary: {
        light: getCustomColorValue('--color-primary-text') || baseThemeColors.text?.primary?.light || 'text-slate-900',
        dark: getCustomColorValue('--color-primary-text') || baseThemeColors.text?.primary?.dark || 'text-slate-100'
      },
      secondary: {
        light: getCustomColorValue('--color-secondary-text') || baseThemeColors.text?.secondary?.light || 'text-slate-600',
        dark: getCustomColorValue('--color-secondary-text') || baseThemeColors.text?.secondary?.dark || 'text-slate-300'
      }
    },
    background: {
      light: getCustomColorValue('--color-background') || baseThemeColors.background?.light || 'bg-white',
      dark: getCustomColorValue('--color-background') || baseThemeColors.background?.dark || 'bg-slate-900'
    },
    surface: {
      light: getCustomColorValue('--color-card-background') || baseThemeColors.surface?.light || 'bg-white',
      dark: getCustomColorValue('--color-card-background') || baseThemeColors.surface?.dark || 'bg-slate-800'
    },
    gradients: {
      ...baseThemeColors.gradients,
      header: (() => {
        const startColor = getCustomColorValue('--color-header-gradient-start');
        const endColor = getCustomColorValue('--color-header-gradient-end');
        if (startColor && endColor) {
          return `from-[${startColor}] to-[${endColor}]`;
        }
        return baseThemeColors.gradients?.header || 'from-blue-600 to-purple-600';
      })(),
      skills: (() => {
        const skillsColor = getCustomColorValue('--color-skills-gradient');
        if (skillsColor) {
          return `from-[${skillsColor}] to-[${skillsColor}]`;
        }
        return baseThemeColors.gradients?.skills || 'from-green-500 to-green-600';
      })()
    }
  } : {
    // Fallback theme colors if baseThemeColors is undefined
    text: {
      primary: {
        light: 'text-gray-900',
        dark: 'text-gray-100'
      },
      secondary: {
        light: 'text-slate-600',
        dark: 'text-slate-300'
      }
    },
    background: {
      light: 'bg-white',
      dark: 'bg-slate-900'
    },
    surface: {
      light: 'bg-white',
      dark: 'bg-slate-800'
    },
    gradients: {
      header: 'from-blue-600 to-purple-600',
      skills: 'from-green-500 to-green-600'
    }
  };

  // Theme utility functions
  const getThemeClass = useCallback((baseClass, lightClass, darkClass) => {
    const mode = currentMode === 'system' ? systemTheme : currentMode;
    return `${baseClass} ${mode === 'light' ? lightClass : darkClass}`;
  }, [currentMode, systemTheme]);

  const getAnimationClass = useCallback((animationType) => {
    const animations = themeData?.animations || {};
    return animations[animationType] || '';
  }, [themeData]);

  // CSS custom properties for dynamic theming
  const cssVariables = {
    '--theme-primary-gradient': themeColors.gradients.header,
    '--theme-secondary-gradient': themeColors.gradients.skills,
    '--theme-accent-color': themeColors.accent,
    '--theme-transition': themeData?.animations?.transition || 'all 0.3s ease',
    '--theme-hover-transform': themeData?.animations?.hover || 'transform 0.2s ease',
    '--theme-border-radius': templateConfig.cardStyle === 'rounded' ? '0.75rem' : '0.5rem',
    '--theme-shadow': templateConfig.cardStyle === 'elevated' 
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
      : 'none'
  };

  // Apply CSS variables to document root and inject custom animations
  useEffect(() => {
    if (typeof document !== 'undefined' && isInitialized) {
      const root = document.documentElement;
      Object.entries(cssVariables).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });

      // Add theme class to body for global styling
      document.body.className = `theme-${currentTheme} mode-${currentMode} template-${currentTemplate}`;
      
      // Apply theme colors to CSS variables for immediate effect
      root.style.setProperty('--theme-primary', themeColors.gradients?.header || 'from-blue-600 to-purple-600');
      root.style.setProperty('--theme-secondary', themeColors.gradients?.skills || 'from-green-500 to-green-600');
      
      // Dispatch custom theme change event
      const themeChangeEvent = new CustomEvent('themeChanged', {
        detail: {
          theme: currentTheme,
          mode: currentMode,
          template: currentTemplate,
          colors: themeColors,
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(themeChangeEvent);
      console.log('📢 Dispatched themeChanged event');
      
      // Update header colors immediately
      const headerElements = document.querySelectorAll('.portfolio-header, [class*="bg-gradient"]');
      headerElements.forEach(element => {
        // Only update if no custom colors are applied
        if (!localStorage.getItem('customColors')) {
          // Clear existing gradient classes
          element.classList.remove(
            ...Array.from(element.classList).filter(cls => 
              cls.startsWith('from-') || cls.startsWith('to-') || cls.startsWith('via-')
            )
          );
          
          // Add base gradient class
          element.classList.add('bg-gradient-to-br');
          
          // Add the new theme gradient classes
          const gradientClasses = themeColors.gradients?.header?.split(' ') || ['from-blue-600', 'via-purple-600', 'to-blue-800'];
          gradientClasses.forEach(cls => {
            if (cls.startsWith('from-') || cls.startsWith('to-') || cls.startsWith('via-')) {
              element.classList.add(cls);
            }
          });
          
          // Update data attribute for CSS targeting
          element.setAttribute('data-theme', currentTheme);
        }
      });
      
      // Inject custom animations if not already present
      if (!document.getElementById('theme-animations')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'theme-animations';
        styleElement.innerHTML = customAnimations;
        document.head.appendChild(styleElement);
      }
    }
  }, [currentTheme, currentMode, currentTemplate, isInitialized, themeColors]);

  const value = {
    // Current state
    currentTheme,
    currentMode,
    currentTemplate,
    systemTheme,
    isInitialized,
    isRandomlyAssigned,

    // Theme data
    themeColors,
    baseThemeColors, // Original theme colors without custom overrides
    templateConfig,
    themeData,
    
    // Available options
    availableThemes: getAllThemes(),
    availableTemplates: getAllTemplates(),
    themeCategories,

    // Change handlers
    changeTheme,
    changeMode,
    changeTemplate,
    toggleMode,

    // Utility functions
    getThemeClass,
    getAnimationClass,

    // CSS variables
    cssVariables,

    // Theme preview function
    previewTheme: (themeName, mode = currentMode) => {
      return getThemeColors(themeName, mode);
    },

    // Batch update function
    updateThemeConfig: ({ theme, mode, template }) => {
      if (theme && themes[theme]) setCurrentTheme(theme);
      if (mode && ['light', 'dark', 'system'].includes(mode)) {
        if (mode === 'system') {
          setCurrentMode(systemTheme);
        } else {
          setCurrentMode(mode);
        }
      }
      if (template && templates[template]) setCurrentTemplate(template);
      setIsRandomlyAssigned(false); // User manually changed settings
    },

    // Random assignment functions
    assignRandomTheme: () => {
      const randomConfig = getRandomThemeAndTemplate();
      setCurrentTheme(randomConfig.theme);
      setCurrentTemplate(randomConfig.template);
      setIsRandomlyAssigned(true);
    },

    // Reset to defaults
    resetToDefaults: () => {
      setCurrentTheme('default');
      setCurrentMode('light');
      setCurrentTemplate('modern');
      setIsRandomlyAssigned(false);
    },

    // Enhanced theme switching with animation support
    switchThemeWithAnimation: (themeName) => {
      if (isStabilityPeriod) {
        console.log('⚠️ Animated theme change blocked during stability period');
        return;
      }
      
      if (themes[themeName] && themeName !== currentTheme) {
        console.log(`🎨 Switching theme with animation from ${currentTheme} to ${themeName}`);
        
        // Add transition class to body for smooth theme switching
        document.body.style.transition = 'all 0.5s ease';
        setCurrentTheme(themeName);
        setIsRandomlyAssigned(false);
        
        // Force immediate save to prevent reverting
        if (isInitialized) {
          saveThemePreference(themeName, currentMode, currentTemplate);
        }
        
        // Remove transition after animation completes
        setTimeout(() => {
          if (document.body.style) {
            document.body.style.transition = '';
          }
        }, 500);
      }
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;