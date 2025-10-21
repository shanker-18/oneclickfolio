// Portfolio Layout Templates - 9 Premium Templates
export const templates = {
  modern: {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean card-based layout with modern spacing and subtle animations',
    layout: 'card',
    spacing: 'relaxed',
    cardStyle: 'elevated',
    sectionLayout: 'stacked',
    animations: 'smooth',
    borderRadius: 'rounded-xl',
    shadow: 'shadow-lg hover:shadow-xl transition-shadow duration-300',
    typography: {
      headingFont: 'font-bold',
      bodyFont: 'font-normal',
      headingSize: 'text-2xl',
      bodySize: 'text-base'
    }
  },
  executive: {
    id: 'executive',
    name: 'Executive Elite',
    description: 'Sophisticated corporate layout with premium typography',
    layout: 'two-column',
    spacing: 'balanced',
    cardStyle: 'bordered',
    sectionLayout: 'sidebar',
    animations: 'subtle',
    borderRadius: 'rounded-lg',
    shadow: 'shadow-md',
    typography: {
      headingFont: 'font-semibold',
      bodyFont: 'font-normal',
      headingSize: 'text-xl',
      bodySize: 'text-sm'
    }
  },
  creative: {
    id: 'creative',
    name: 'Creative Showcase',
    description: 'Dynamic grid layout with artistic flair and bold visuals',
    layout: 'masonry',
    spacing: 'dynamic',
    cardStyle: 'artistic',
    sectionLayout: 'masonry',
    animations: 'bouncy',
    borderRadius: 'rounded-2xl',
    shadow: 'shadow-2xl hover:shadow-3xl transition-all duration-500',
    typography: {
      headingFont: 'font-extrabold',
      bodyFont: 'font-medium',
      headingSize: 'text-3xl',
      bodySize: 'text-base'
    }
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist Zen',
    description: 'Ultra-clean design focused on content with maximum white space',
    layout: 'single-column',
    spacing: 'generous',
    cardStyle: 'flat',
    sectionLayout: 'linear',
    animations: 'fade',
    borderRadius: 'rounded-none',
    shadow: 'shadow-none border-l-4',
    typography: {
      headingFont: 'font-light',
      bodyFont: 'font-light',
      headingSize: 'text-xl',
      bodySize: 'text-base'
    }
  },
  magazine: {
    id: 'magazine',
    name: 'Magazine Editorial',
    description: 'Editorial-style layout with sophisticated typography and spacing',
    layout: 'magazine',
    spacing: 'editorial',
    cardStyle: 'editorial',
    sectionLayout: 'columns',
    animations: 'slide',
    borderRadius: 'rounded-lg',
    shadow: 'shadow-lg',
    typography: {
      headingFont: 'font-bold',
      bodyFont: 'font-normal',
      headingSize: 'text-2xl',
      bodySize: 'text-base'
    }
  },
  startup: {
    id: 'startup',
    name: 'Startup Innovator',
    description: 'Modern tech-focused layout with bold colors and animations',
    layout: 'startup',
    spacing: 'compact',
    cardStyle: 'tech',
    sectionLayout: 'blocks',
    animations: 'tech',
    borderRadius: 'rounded-xl',
    shadow: 'shadow-xl hover:shadow-2xl transition-all duration-300',
    typography: {
      headingFont: 'font-black',
      bodyFont: 'font-medium',
      headingSize: 'text-2xl',
      bodySize: 'text-sm'
    }
  },
  academic: {
    id: 'academic',
    name: 'Academic Scholar',
    description: 'Research-focused layout with emphasis on publications and education',
    layout: 'academic',
    spacing: 'structured',
    cardStyle: 'academic',
    sectionLayout: 'structured',
    animations: 'professional',
    borderRadius: 'rounded-md',
    shadow: 'shadow-sm',
    typography: {
      headingFont: 'font-semibold',
      bodyFont: 'font-normal',
      headingSize: 'text-xl',
      bodySize: 'text-sm'
    }
  },
  portfolio: {
    id: 'portfolio',
    name: 'Creative Portfolio',
    description: 'Showcase-focused design perfect for artists and designers',
    layout: 'gallery',
    spacing: 'showcase',
    cardStyle: 'gallery',
    sectionLayout: 'featured',
    animations: 'artistic',
    borderRadius: 'rounded-3xl',
    shadow: 'shadow-2xl hover:shadow-3xl transition-all duration-700',
    typography: {
      headingFont: 'font-bold',
      bodyFont: 'font-normal',
      headingSize: 'text-3xl',
      bodySize: 'text-lg'
    }
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury Premium',
    description: 'High-end luxury design with gold accents and premium typography',
    layout: 'luxury',
    spacing: 'luxurious',
    cardStyle: 'premium',
    sectionLayout: 'elegant',
    animations: 'elegant',
    borderRadius: 'rounded-xl',
    shadow: 'shadow-2xl',
    typography: {
      headingFont: 'font-light',
      bodyFont: 'font-light',
      headingSize: 'text-4xl',
      bodySize: 'text-lg'
    }
  }
};

// 9 Premium Themes with Distinct Visual Styles
export const themes = {
  sapphire: {
    key: "sapphire",
    name: "Sapphire Elegance",
    description: "Sophisticated blue and silver theme with luxury aesthetics",
    category: "professional",
    colors: {
      primary: {
        light: "from-blue-700 to-indigo-800",
        dark: "from-blue-600 to-indigo-700"
      },
      secondary: {
        light: "from-slate-600 to-slate-800",
        dark: "from-slate-500 to-slate-700"
      },
      accent: "blue-700",
      accentDark: "blue-400",
      background: {
        light: "bg-gradient-to-br from-slate-50 to-blue-50",
        dark: "bg-gradient-to-br from-slate-900 to-blue-900"
      },
      card: {
        light: "bg-white/80 backdrop-blur-md",
        dark: "bg-slate-800/80 backdrop-blur-md"
      },
      cardHover: {
        light: "bg-white/90 backdrop-blur-lg",
        dark: "bg-slate-700/90 backdrop-blur-lg"
      },
      text: {
        primary: {
          light: "text-slate-900",
          dark: "text-slate-100"
        },
        secondary: {
          light: "text-slate-600",
          dark: "text-slate-400"
        },
        muted: {
          light: "text-slate-500",
          dark: "text-slate-500"
        }
      },
      border: {
        light: "border-blue-200/50",
        dark: "border-blue-700/50"
      },
      input: {
        light: "border-blue-300",
        dark: "border-blue-600"
      }
    },
    gradients: {
      header: "from-blue-700 via-indigo-700 to-blue-800",
      skills: "from-slate-600 to-slate-800",
      languages: "from-blue-600 to-indigo-700"
    },
    animations: {
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      hover: "transform 0.3s ease",
      fadeIn: "fadeIn 0.8s ease-out",
      shimmer: "shimmer 2s ease-in-out infinite"
    }
  },
  emerald: {
    key: "emerald",
    name: "Emerald Garden",
    description: "Vibrant green theme inspired by nature and growth",
    category: "nature",
    colors: {
      primary: {
        light: "from-emerald-600 to-green-800",
        dark: "from-emerald-500 to-green-700"
      },
      secondary: {
        light: "from-teal-500 to-cyan-600",
        dark: "from-teal-400 to-cyan-500"
      },
      accent: "emerald-600",
      accentDark: "emerald-400",
      background: {
        light: "bg-gradient-to-br from-emerald-50 to-green-50",
        dark: "bg-gradient-to-br from-green-900 to-emerald-900"
      },
      card: {
        light: "bg-white/85 backdrop-blur-sm",
        dark: "bg-green-800/85 backdrop-blur-sm"
      },
      cardHover: {
        light: "bg-white/95 backdrop-blur-md",
        dark: "bg-green-700/95 backdrop-blur-md"
      },
      text: {
        primary: {
          light: "text-green-900",
          dark: "text-green-100"
        },
        secondary: {
          light: "text-green-700",
          dark: "text-green-300"
        },
        muted: {
          light: "text-green-600",
          dark: "text-green-400"
        }
      },
      border: {
        light: "border-emerald-200/60",
        dark: "border-emerald-700/60"
      },
      input: {
        light: "border-emerald-300",
        dark: "border-emerald-600"
      }
    },
    gradients: {
      header: "from-emerald-600 via-green-600 to-teal-700",
      skills: "from-teal-500 to-cyan-600",
      languages: "from-green-500 to-emerald-600"
    },
    animations: {
      transition: "all 0.35s ease",
      hover: "transform 0.25s ease",
      fadeIn: "fadeIn 0.7s ease-out",
      pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
    }
  },
  sunset: {
    key: "sunset",
    name: "Sunset Blaze",
    description: "Warm orange and coral theme with golden accents",
    category: "warm",
    colors: {
      primary: {
        light: "from-orange-600 to-red-700",
        dark: "from-orange-500 to-red-600"
      },
      secondary: {
        light: "from-amber-500 to-orange-600",
        dark: "from-amber-400 to-orange-500"
      },
      accent: "orange-600",
      accentDark: "orange-400",
      background: {
        light: "bg-gradient-to-br from-orange-50 to-amber-50",
        dark: "bg-gradient-to-br from-orange-900 to-red-900"
      },
      card: {
        light: "bg-white/90 backdrop-blur-sm",
        dark: "bg-red-800/90 backdrop-blur-sm"
      },
      cardHover: {
        light: "bg-orange-50/95",
        dark: "bg-red-700/95"
      },
      text: {
        primary: {
          light: "text-orange-900",
          dark: "text-orange-100"
        },
        secondary: {
          light: "text-orange-700",
          dark: "text-orange-300"
        },
        muted: {
          light: "text-orange-600",
          dark: "text-orange-400"
        }
      },
      border: {
        light: "border-orange-200/70",
        dark: "border-orange-700/70"
      },
      input: {
        light: "border-orange-300",
        dark: "border-orange-600"
      }
    },
    gradients: {
      header: "from-orange-600 via-red-500 to-pink-600",
      skills: "from-amber-500 to-orange-600",
      languages: "from-yellow-500 to-red-500"
    },
    animations: {
      transition: "all 0.3s ease",
      hover: "transform 0.2s ease",
      fadeIn: "fadeIn 0.6s ease-out",
      glow: "glow 3s ease-in-out infinite"
    }
  },
  royal: {
    key: "royal",
    name: "Royal Purple",
    description: "Majestic purple theme with gold highlights",
    category: "luxury",
    colors: {
      primary: {
        light: "from-purple-700 to-indigo-800",
        dark: "from-purple-600 to-indigo-700"
      },
      secondary: {
        light: "from-amber-500 to-yellow-600",
        dark: "from-amber-400 to-yellow-500"
      },
      accent: "purple-700",
      accentDark: "purple-400",
      background: {
        light: "bg-gradient-to-br from-purple-50 to-indigo-50",
        dark: "bg-gradient-to-br from-purple-900 to-indigo-900"
      },
      card: {
        light: "bg-white/85 backdrop-blur-md",
        dark: "bg-purple-800/85 backdrop-blur-md"
      },
      cardHover: {
        light: "bg-purple-50/95",
        dark: "bg-purple-700/95"
      },
      text: {
        primary: {
          light: "text-purple-900",
          dark: "text-purple-100"
        },
        secondary: {
          light: "text-purple-700",
          dark: "text-purple-300"
        },
        muted: {
          light: "text-purple-600",
          dark: "text-purple-400"
        }
      },
      border: {
        light: "border-purple-200/60",
        dark: "border-purple-700/60"
      },
      input: {
        light: "border-purple-300",
        dark: "border-purple-600"
      }
    },
    gradients: {
      header: "from-purple-700 via-indigo-600 to-blue-700",
      skills: "from-amber-500 to-yellow-600",
      languages: "from-pink-500 to-purple-600"
    },
    animations: {
      transition: "all 0.4s ease",
      hover: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fadeIn: "fadeIn 0.8s ease-out",
      luxury: "luxury-glow 4s ease-in-out infinite"
    }
  },
  aurora: {
    key: "aurora",
    name: "Aurora Borealis",
    description: "Mystical multi-color theme with northern lights inspiration",
    category: "artistic",
    colors: {
      primary: {
        light: "from-cyan-500 via-purple-500 to-pink-500",
        dark: "from-cyan-400 via-purple-400 to-pink-400"
      },
      secondary: {
        light: "from-green-500 to-blue-600",
        dark: "from-green-400 to-blue-500"
      },
      accent: "cyan-500",
      accentDark: "cyan-300",
      background: {
        light: "bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50",
        dark: "bg-gradient-to-br from-cyan-900 via-purple-900 to-pink-900"
      },
      card: {
        light: "bg-white/75 backdrop-blur-lg border border-white/20",
        dark: "bg-gray-800/75 backdrop-blur-lg border border-white/10"
      },
      cardHover: {
        light: "bg-white/85 backdrop-blur-xl",
        dark: "bg-gray-700/85 backdrop-blur-xl"
      },
      text: {
        primary: {
          light: "text-gray-900",
          dark: "text-white"
        },
        secondary: {
          light: "text-gray-700",
          dark: "text-gray-300"
        },
        muted: {
          light: "text-gray-600",
          dark: "text-gray-400"
        }
      },
      border: {
        light: "border-purple-200/40",
        dark: "border-purple-600/40"
      },
      input: {
        light: "border-purple-300",
        dark: "border-purple-500"
      }
    },
    gradients: {
      header: "from-cyan-500 via-purple-500 to-pink-500",
      skills: "from-green-500 to-blue-600",
      languages: "from-pink-500 to-cyan-500"
    },
    animations: {
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      hover: "transform 0.4s ease",
      fadeIn: "fadeIn 1s ease-out",
      aurora: "aurora-dance 8s ease-in-out infinite"
    }
  },
  midnight: {
    key: "midnight",
    name: "Midnight Steel",
    description: "Dark sophisticated theme with steel blue accents",
    category: "professional",
    colors: {
      primary: {
        light: "from-slate-700 to-slate-900",
        dark: "from-slate-600 to-slate-800"
      },
      secondary: {
        light: "from-blue-600 to-slate-700",
        dark: "from-blue-500 to-slate-600"
      },
      accent: "slate-700",
      accentDark: "slate-400",
      background: {
        light: "bg-slate-100",
        dark: "bg-gradient-to-br from-slate-900 to-gray-900"
      },
      card: {
        light: "bg-white/90",
        dark: "bg-slate-800/90 backdrop-blur-sm"
      },
      cardHover: {
        light: "bg-slate-50",
        dark: "bg-slate-700/95"
      },
      text: {
        primary: {
          light: "text-slate-900",
          dark: "text-slate-100"
        },
        secondary: {
          light: "text-slate-700",
          dark: "text-slate-300"
        },
        muted: {
          light: "text-slate-600",
          dark: "text-slate-400"
        }
      },
      border: {
        light: "border-slate-300",
        dark: "border-slate-600/50"
      },
      input: {
        light: "border-slate-400",
        dark: "border-slate-500"
      }
    },
    gradients: {
      header: "from-slate-700 to-slate-900",
      skills: "from-blue-600 to-slate-700",
      languages: "from-slate-600 to-blue-700"
    },
    animations: {
      transition: "all 0.3s ease",
      hover: "transform 0.2s ease",
      fadeIn: "fadeIn 0.5s ease-out",
      steel: "steel-shimmer 5s linear infinite"
    }
  },
  coral: {
    key: "coral",
    name: "Coral Reef",
    description: "Vibrant coral and turquoise ocean theme",
    category: "nature",
    colors: {
      primary: {
        light: "from-coral-500 to-pink-600",
        dark: "from-coral-400 to-pink-500"
      },
      secondary: {
        light: "from-teal-500 to-cyan-600",
        dark: "from-teal-400 to-cyan-500"
      },
      accent: "coral-500",
      accentDark: "coral-300",
      background: {
        light: "bg-gradient-to-br from-coral-50 to-teal-50",
        dark: "bg-gradient-to-br from-coral-900 to-teal-900"
      },
      card: {
        light: "bg-white/80 backdrop-blur-sm",
        dark: "bg-teal-800/80 backdrop-blur-sm"
      },
      cardHover: {
        light: "bg-coral-50/90",
        dark: "bg-teal-700/90"
      },
      text: {
        primary: {
          light: "text-coral-900",
          dark: "text-coral-100"
        },
        secondary: {
          light: "text-teal-700",
          dark: "text-teal-300"
        },
        muted: {
          light: "text-teal-600",
          dark: "text-teal-400"
        }
      },
      border: {
        light: "border-coral-200/60",
        dark: "border-coral-700/60"
      },
      input: {
        light: "border-coral-300",
        dark: "border-coral-600"
      }
    },
    gradients: {
      header: "from-coral-500 via-pink-500 to-rose-600",
      skills: "from-teal-500 to-cyan-600",
      languages: "from-turquoise-500 to-teal-600"
    },
    animations: {
      transition: "all 0.35s ease",
      hover: "transform 0.25s ease",
      fadeIn: "fadeIn 0.7s ease-out",
      wave: "wave-motion 6s ease-in-out infinite"
    }
  },
  obsidian: {
    key: "obsidian",
    name: "Obsidian Edge",
    description: "Sleek black theme with neon accents for modern professionals",
    category: "modern",
    colors: {
      primary: {
        light: "from-gray-800 to-black",
        dark: "from-gray-700 to-gray-900"
      },
      secondary: {
        light: "from-cyan-500 to-blue-600",
        dark: "from-cyan-400 to-blue-500"
      },
      accent: "cyan-500",
      accentDark: "cyan-300",
      background: {
        light: "bg-gray-100",
        dark: "bg-black"
      },
      card: {
        light: "bg-white",
        dark: "bg-gray-900/95 backdrop-blur-sm border border-gray-800"
      },
      cardHover: {
        light: "bg-gray-50",
        dark: "bg-gray-800/95"
      },
      text: {
        primary: {
          light: "text-black",
          dark: "text-white"
        },
        secondary: {
          light: "text-gray-700",
          dark: "text-gray-300"
        },
        muted: {
          light: "text-gray-600",
          dark: "text-gray-400"
        }
      },
      border: {
        light: "border-gray-300",
        dark: "border-gray-700/50"
      },
      input: {
        light: "border-gray-400",
        dark: "border-gray-600"
      }
    },
    gradients: {
      header: "from-gray-800 via-black to-gray-900",
      skills: "from-cyan-500 to-blue-600",
      languages: "from-purple-500 to-cyan-500"
    },
    animations: {
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      hover: "transform 0.2s ease",
      fadeIn: "fadeIn 0.6s ease-out",
      neon: "neon-pulse 3s ease-in-out infinite"
    }
  },
  cherry: {
    key: "cherry",
    name: "Cherry Blossom",
    description: "Elegant pink theme inspired by Japanese cherry blossoms",
    category: "elegant",
    colors: {
      primary: {
        light: "from-pink-500 to-rose-600",
        dark: "from-pink-400 to-rose-500"
      },
      secondary: {
        light: "from-purple-500 to-pink-600",
        dark: "from-purple-400 to-pink-500"
      },
      accent: "rose-500",
      accentDark: "rose-300",
      background: {
        light: "bg-gradient-to-br from-pink-50 to-rose-50",
        dark: "bg-gradient-to-br from-rose-900 to-pink-900"
      },
      card: {
        light: "bg-white/85 backdrop-blur-sm",
        dark: "bg-rose-800/85 backdrop-blur-sm"
      },
      cardHover: {
        light: "bg-pink-50/95",
        dark: "bg-rose-700/95"
      },
      text: {
        primary: {
          light: "text-rose-900",
          dark: "text-rose-100"
        },
        secondary: {
          light: "text-rose-700",
          dark: "text-rose-300"
        },
        muted: {
          light: "text-rose-600",
          dark: "text-rose-400"
        }
      },
      border: {
        light: "border-rose-200/60",
        dark: "border-rose-700/60"
      },
      input: {
        light: "border-rose-300",
        dark: "border-rose-600"
      }
    },
    gradients: {
      header: "from-pink-500 via-rose-500 to-purple-600",
      skills: "from-purple-500 to-pink-600",
      languages: "from-rose-400 to-pink-500"
    },
    animations: {
      transition: "all 0.4s ease",
      hover: "transform 0.3s ease",
      fadeIn: "fadeIn 0.7s ease-out",
      blossom: "cherry-float 4s ease-in-out infinite"
    }
  }
};

// Theme Categories for Organization
export const themeCategories = {
  professional: ['sapphire', 'midnight', 'obsidian'],
  nature: ['emerald', 'coral'],
  warm: ['sunset', 'cherry'],
  luxury: ['royal', 'aurora'],
  modern: ['obsidian', 'sapphire'],
  artistic: ['aurora', 'coral'],
  elegant: ['cherry', 'royal']
};

// Utility Functions
export const getThemeColors = (themeName, mode = 'light') => {
  const theme = themes[themeName] || themes.sapphire;
  return {
    ...theme.colors,
    mode,
    gradients: theme.gradients,
    animations: theme.animations || {}
  };
};

export const getThemesByCategory = (category) => {
  const themeKeys = themeCategories[category] || [];
  return themeKeys.map(key => ({ key, ...themes[key] }));
};

export const getTemplateConfig = (templateId) => {
  return templates[templateId] || templates.modern;
};

export const getAllThemes = () => {
  return Object.entries(themes).map(([key, theme]) => ({ key, ...theme }));
};

export const getAllTemplates = () => {
  return Object.values(templates);
};

export const getThemePreview = (themeName) => {
  const theme = themes[themeName];
  if (!theme) return null;
  
  return {
    name: theme.name,
    description: theme.description,
    category: theme.category || 'general',
    primaryColor: theme.gradients.header,
    colors: {
      background: theme.colors.background.light,
      card: theme.colors.card.light,
      text: theme.colors.text.primary.light
    }
  };
};

// System Theme Detection
export const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// Random Assignment for New Users
export const getRandomThemeAndTemplate = () => {
  const themeKeys = Object.keys(themes);
  const templateKeys = Object.keys(templates);
  
  const randomTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
  const randomTemplate = templateKeys[Math.floor(Math.random() * templateKeys.length)];
  
  return {
    theme: randomTheme,
    template: randomTemplate,
    mode: getSystemTheme()
  };
};

// Check if user is new and assign random theme/template
export const initializeUserTheme = () => {
  const THEME_KEY = 'portfolio-theme-preferences';
  const USER_INITIALIZED_KEY = 'portfolio-user-initialized';
  
  try {
    // Check if user has been initialized before
    const userInitialized = localStorage.getItem(USER_INITIALIZED_KEY);
    
    if (!userInitialized) {
      // New user - assign random theme and template
      const randomConfig = getRandomThemeAndTemplate();
      
      const themeConfig = {
        theme: randomConfig.theme,
        mode: randomConfig.mode,
        template: randomConfig.template,
        timestamp: Date.now(),
        isRandomlyAssigned: true
      };
      
      localStorage.setItem(THEME_KEY, JSON.stringify(themeConfig));
      localStorage.setItem(USER_INITIALIZED_KEY, 'true');
      
      return themeConfig;
    } else {
      // Existing user - load their preferences
      return loadThemePreference();
    }
  } catch (error) {
    console.warn('Failed to initialize user theme:', error);
    // Fallback to default
    return {
      theme: 'sapphire',
      mode: getSystemTheme(),
      template: 'modern'
    };
  }
};

// Enhanced Theme Persistence with Random Assignment Support
export const saveThemePreference = (theme, mode, template) => {
  if (typeof localStorage !== 'undefined') {
    const existing = loadThemePreference();
    localStorage.setItem('portfolio-theme-preferences', JSON.stringify({
      theme,
      mode,
      template,
      timestamp: Date.now(),
      isRandomlyAssigned: existing.isRandomlyAssigned || false
    }));
  }
};

export const loadThemePreference = () => {
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('portfolio-theme-preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if saved preference is not too old (30 days)
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - parsed.timestamp < thirtyDays) {
          return {
            theme: parsed.theme || 'sapphire',
            mode: parsed.mode || getSystemTheme(),
            template: parsed.template || 'modern',
            isRandomlyAssigned: parsed.isRandomlyAssigned || false
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
  }
  return {
    theme: 'sapphire',
    mode: getSystemTheme(),
    template: 'modern',
    isRandomlyAssigned: false
  };
};

// CSS Animation Keyframes for Custom Animations
export const customAnimations = `
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(255, 165, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 165, 0, 0.8); }
}

@keyframes luxury-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(147, 51, 234, 0.3); }
  50% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.6); }
}

@keyframes aurora-dance {
  0%, 100% { 
    background: linear-gradient(45deg, #06b6d4, #8b5cf6, #ec4899);
    transform: translateY(0px);
  }
  33% { 
    background: linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4);
    transform: translateY(-2px);
  }
  66% { 
    background: linear-gradient(45deg, #ec4899, #06b6d4, #8b5cf6);
    transform: translateY(2px);
  }
}

@keyframes steel-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes wave-motion {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(1deg); }
}

@keyframes neon-pulse {
  0%, 100% { box-shadow: 0 0 5px #06b6d4, 0 0 10px #06b6d4, 0 0 15px #06b6d4; }
  50% { box-shadow: 0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #06b6d4; }
}

@keyframes cherry-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-2px) rotate(0.5deg); }
  75% { transform: translateY(2px) rotate(-0.5deg); }
}
`;