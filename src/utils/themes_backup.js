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
    name: "Sunset Glow",
    description: "Warm orange and pink sunset theme",
    category: "warm",
    colors: {
      primary: {
        light: "from-orange-500 to-red-600",
        dark: "from-orange-400 to-red-500"
      },
      secondary: {
        light: "from-pink-500 to-rose-600",
        dark: "from-pink-400 to-rose-500"
      },
      accent: "orange-600",
      accentDark: "orange-400",
      background: {
        light: "bg-orange-50",
        dark: "bg-gray-900"
      },
      card: {
        light: "bg-white",
        dark: "bg-gray-800"
      },
      cardHover: {
        light: "bg-orange-50",
        dark: "bg-gray-700"
      },
      text: {
        primary: {
          light: "text-gray-900",
          dark: "text-gray-100"
        },
        secondary: {
          light: "text-gray-600",
          dark: "text-gray-400"
        },
        muted: {
          light: "text-gray-500",
          dark: "text-gray-500"
        }
      },
      border: {
        light: "border-orange-200",
        dark: "border-gray-700"
      },
      input: {
        light: "border-orange-300",
        dark: "border-gray-600"
      }
    },
    gradients: {
      header: "from-orange-500 to-red-600",
      skills: "from-pink-500 to-rose-600",
      languages: "from-yellow-500 to-orange-600"
    },
    animations: {
      transition: "all 0.3s ease",
      hover: "transform 0.2s ease",
      fadeIn: "fadeIn 0.6s ease-out"
    }
  },
  forest: {
    name: "Forest Green",
    description: "Natural green and earth tones",
    colors: {
      primary: {
        light: "from-green-600 to-emerald-700",
        dark: "from-green-500 to-emerald-600"
      },
      secondary: {
        light: "from-lime-500 to-green-600",
        dark: "from-lime-400 to-green-500"
      },
      accent: "green-600",
      accentDark: "green-400",
      background: {
        light: "bg-green-50",
        dark: "bg-gray-900"
      },
      card: {
        light: "bg-white",
        dark: "bg-gray-800"
      },
      cardHover: {
        light: "bg-green-50",
        dark: "bg-gray-700"
      },
      text: {
        primary: {
          light: "text-gray-900",
          dark: "text-gray-100"
        },
        secondary: {
          light: "text-gray-600",
          dark: "text-gray-400"
        },
        muted: {
          light: "text-gray-500",
          dark: "text-gray-500"
        }
      },
      border: {
        light: "border-green-200",
        dark: "border-gray-700"
      },
      input: {
        light: "border-green-300",
        dark: "border-gray-600"
      }
    },
    gradients: {
      header: "from-green-600 to-emerald-700",
      skills: "from-lime-500 to-green-600",
      languages: "from-emerald-500 to-teal-600"
    }
  },
  midnight: {
    name: "Midnight Blue",
    description: "Dark and sophisticated navy theme",
    colors: {
      primary: {
        light: "from-indigo-700 to-purple-800",
        dark: "from-indigo-600 to-purple-700"
      },
      secondary: {
        light: "from-blue-600 to-indigo-700",
        dark: "from-blue-500 to-indigo-600"
      },
      accent: "indigo-700",
      accentDark: "indigo-400",
      background: {
        light: "bg-indigo-50",
        dark: "bg-gray-900"
      },
      card: {
        light: "bg-white",
        dark: "bg-gray-800"
      },
      cardHover: {
        light: "bg-indigo-50",
        dark: "bg-gray-700"
      },
      text: {
        primary: {
          light: "text-gray-900",
          dark: "text-gray-100"
        },
        secondary: {
          light: "text-gray-600",
          dark: "text-gray-400"
        },
        muted: {
          light: "text-gray-500",
          dark: "text-gray-500"
        }
      },
      border: {
        light: "border-indigo-200",
        dark: "border-gray-700"
      },
      input: {
        light: "border-indigo-300",
        dark: "border-gray-600"
      }
    },
    gradients: {
      header: "from-indigo-700 to-purple-800",
      skills: "from-blue-600 to-indigo-700",
      languages: "from-purple-600 to-indigo-700"
    }
  },
  lavender: {
    name: "Lavender Dreams",
    description: "Soft purple and lavender theme",
    colors: {
      primary: {
        light: "from-purple-500 to-violet-600",
        dark: "from-purple-400 to-violet-500"
      },
      secondary: {
        light: "from-pink-400 to-purple-500",
        dark: "from-pink-300 to-purple-400"
      },
      accent: "purple-600",
      accentDark: "purple-400",
      background: {
        light: "bg-purple-50",
        dark: "bg-gray-900"
      },
      card: {
        light: "bg-white",
        dark: "bg-gray-800"
      },
      cardHover: {
        light: "bg-purple-50",
        dark: "bg-gray-700"
      },
      text: {
        primary: {
          light: "text-gray-900",
          dark: "text-gray-100"
        },
        secondary: {
          light: "text-gray-600",
          dark: "text-gray-400"
        },
        muted: {
          light: "text-gray-500",
          dark: "text-gray-500"
        }
      },
      border: {
        light: "border-purple-200",
        dark: "border-gray-700"
      },
      input: {
        light: "border-purple-300",
        dark: "border-gray-600"
      }
    },
    gradients: {
      header: "from-purple-500 to-violet-600",
      skills: "from-pink-400 to-purple-500",
      languages: "from-violet-500 to-purple-600"
    }
  },
  elegant: {
    name: "Elegant Purple",
    description: "Sophisticated purple and gold theme",
    colors: {
      primary: {
        light: "from-purple-600 to-purple-800",
        dark: "from-purple-500 to-purple-700"
      },
      secondary: {
        light: "from-amber-500 to-amber-700",
        dark: "from-amber-400 to-amber-600"
      },
      accent: "purple-600",
      accentDark: "purple-400",
      background: {
        light: "bg-slate-50",
        dark: "bg-slate-900"
      },
      card: {
        light: "bg-white",
        dark: "bg-slate-800"
      },
      cardHover: {
        light: "bg-slate-50",
        dark: "bg-slate-700"
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
        light: "border-slate-200",
        dark: "border-slate-700"
      },
      input: {
        light: "border-slate-300",
        dark: "border-slate-600"
      }
    },
    gradients: {
      header: "from-purple-600 to-purple-800",
      skills: "from-purple-600 to-purple-800",
      languages: "from-amber-500 to-amber-700"
    }
  },
  minimal: {
    name: "Minimal Gray",
    description: "Clean and minimal gray theme",
    category: "minimalist",
    colors: {
      primary: {
        light: "from-gray-600 to-gray-800",
        dark: "from-gray-500 to-gray-700"
      },
      secondary: {
        light: "from-teal-500 to-teal-700",
        dark: "from-teal-400 to-teal-600"
      },
      accent: "gray-600",
      accentDark: "gray-400",
      background: {
        light: "bg-gray-50",
        dark: "bg-gray-900"
      },
      card: {
        light: "bg-white",
        dark: "bg-gray-800"
      },
      cardHover: {
        light: "bg-gray-50",
        dark: "bg-gray-700"
      },
      text: {
        primary: {
          light: "text-gray-900",
          dark: "text-gray-100"
        },
        secondary: {
          light: "text-gray-600",
          dark: "text-gray-400"
        },
        muted: {
          light: "text-gray-500",
          dark: "text-gray-500"
        }
      },
      border: {
        light: "border-gray-200",
        dark: "border-gray-700"
      },
      input: {
        light: "border-gray-300",
        dark: "border-gray-600"
      }
    },
    gradients: {
      header: "from-gray-600 to-gray-800",
      skills: "from-gray-600 to-gray-800",
      languages: "from-teal-500 to-teal-700"
    },
    animations: {
      transition: "all 0.3s ease",
      hover: "transform 0.2s ease",
      fadeIn: "fadeIn 0.6s ease-out"
    }
  },
  cyberpunk: {
    name: "Cyberpunk Neon",
    description: "Futuristic neon theme with electric colors",
    category: "creative",
    colors: {
      primary: {
        light: "from-cyan-400 to-purple-600",
        dark: "from-cyan-300 to-purple-500"
      },
      secondary: {
        light: "from-pink-500 to-violet-600",
        dark: "from-pink-400 to-violet-500"
      },
      accent: "cyan-400",
      accentDark: "cyan-300",
      background: {
        light: "bg-gray-900",
        dark: "bg-black"
      },
      card: {
        light: "bg-gray-800/80 backdrop-blur-sm",
        dark: "bg-gray-900/80 backdrop-blur-sm"
      },
      cardHover: {
        light: "bg-gray-700/90",
        dark: "bg-gray-800/90"
      },
      text: {
        primary: {
          light: "text-white",
          dark: "text-cyan-100"
        },
        secondary: {
          light: "text-gray-300",
          dark: "text-gray-400"
        },
        muted: {
          light: "text-gray-500",
          dark: "text-gray-600"
        }
      },
      border: {
        light: "border-cyan-500/30",
        dark: "border-purple-500/30"
      },
      input: {
        light: "border-cyan-400",
        dark: "border-purple-400"
      }
    },
    gradients: {
      header: "from-cyan-400 via-purple-500 to-pink-500",
      skills: "from-pink-500 to-violet-600",
      languages: "from-cyan-400 to-blue-500"
    },
    animations: {
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      hover: "transform 0.3s ease",
      fadeIn: "fadeIn 0.8s ease-out",
      glow: "glow 2s ease-in-out infinite alternate"
    }
  },
  aurora: {
    name: "Aurora Borealis",
    description: "Mystical aurora-inspired gradients",
    category: "artistic",
    colors: {
      primary: {
        light: "from-emerald-400 via-cyan-500 to-blue-600",
        dark: "from-emerald-300 via-cyan-400 to-blue-500"
      },
      secondary: {
        light: "from-purple-500 via-pink-500 to-rose-500",
        dark: "from-purple-400 via-pink-400 to-rose-400"
      },
      accent: "emerald-500",
      accentDark: "emerald-400",
      background: {
        light: "bg-gradient-to-br from-slate-50 to-blue-50",
        dark: "bg-gradient-to-br from-slate-900 to-blue-900"
      },
      card: {
        light: "bg-white/70 backdrop-blur-md",
        dark: "bg-slate-800/70 backdrop-blur-md"
      },
      cardHover: {
        light: "bg-white/80",
        dark: "bg-slate-700/80"
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
        light: "border-emerald-200/50",
        dark: "border-emerald-700/50"
      },
      input: {
        light: "border-emerald-300",
        dark: "border-emerald-600"
      }
    },
    gradients: {
      header: "from-emerald-400 via-cyan-500 to-blue-600",
      skills: "from-purple-500 via-pink-500 to-rose-500",
      languages: "from-blue-500 via-teal-500 to-emerald-500"
    },
    animations: {
      transition: "all 0.5s ease",
      hover: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fadeIn: "fadeIn 1s ease-out",
      shimmer: "shimmer 3s ease-in-out infinite"
    }
  },
  monochrome: {
    name: "Monochrome Elite",
    description: "Sophisticated black and white theme",
    category: "professional",
    colors: {
      primary: {
        light: "from-gray-900 to-black",
        dark: "from-gray-100 to-white"
      },
      secondary: {
        light: "from-gray-700 to-gray-900",
        dark: "from-gray-300 to-gray-100"
      },
      accent: "gray-900",
      accentDark: "gray-100",
      background: {
        light: "bg-white",
        dark: "bg-gray-900"
      },
      card: {
        light: "bg-gray-50",
        dark: "bg-gray-800"
      },
      cardHover: {
        light: "bg-gray-100",
        dark: "bg-gray-700"
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
          light: "text-gray-500",
          dark: "text-gray-500"
        }
      },
      border: {
        light: "border-gray-300",
        dark: "border-gray-700"
      },
      input: {
        light: "border-gray-400",
        dark: "border-gray-600"
      }
    },
    gradients: {
      header: "from-gray-900 to-black",
      skills: "from-gray-700 to-gray-900",
      languages: "from-gray-600 to-gray-800"
    },
    animations: {
      transition: "all 0.3s ease",
      hover: "transform 0.2s ease",
      fadeIn: "fadeIn 0.5s ease-out"
    }
  },
  enterprise: {
    name: "Enterprise Pro",
    description: "Corporate-grade professional theme",
    category: "professional",
    colors: {
      primary: {
        light: "from-blue-900 to-indigo-900",
        dark: "from-blue-800 to-indigo-800"
      },
      secondary: {
        light: "from-gray-700 to-gray-800",
        dark: "from-gray-600 to-gray-700"
      },
      accent: "blue-900",
      accentDark: "blue-400",
      background: {
        light: "bg-slate-50",
        dark: "bg-slate-900"
      },
      card: {
        light: "bg-white",
        dark: "bg-slate-800"
      },
      cardHover: {
        light: "bg-slate-50",
        dark: "bg-slate-700"
      },
      text: {
        primary: {
          light: "text-slate-900",
          dark: "text-slate-100"
        },
        secondary: {
          light: "text-slate-700",
          dark: "text-slate-400"
        },
        muted: {
          light: "text-slate-600",
          dark: "text-slate-500"
        }
      },
      border: {
        light: "border-slate-200",
        dark: "border-slate-700"
      },
      input: {
        light: "border-slate-300",
        dark: "border-slate-600"
      }
    },
    gradients: {
      header: "from-blue-900 to-indigo-900",
      skills: "from-gray-700 to-gray-800",
      languages: "from-slate-600 to-slate-800"
    },
    animations: {
      transition: "all 0.25s ease",
      hover: "transform 0.15s ease",
      fadeIn: "fadeIn 0.4s ease-out"
    }
  }
};

// Theme Categories for Organization
export const themeCategories = {
  professional: ['modern', 'enterprise', 'monochrome', 'midnight'],
  creative: ['cyberpunk', 'sunset', 'aurora'],
  nature: ['ocean', 'forest'],
  minimalist: ['minimal', 'elegant'],
  warm: ['sunset', 'lavender'],
  artistic: ['aurora', 'lavender']
};

// Utility Functions
export const getThemeColors = (themeName, mode = 'light') => {
  const theme = themes[themeName] || themes.modern;
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

// Theme Persistence
export const saveThemePreference = (theme, mode, template) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('portfolio-theme', JSON.stringify({
      theme,
      mode,
      template,
      timestamp: Date.now()
    }));
  }
};

export const loadThemePreference = () => {
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if saved preference is not too old (30 days)
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - parsed.timestamp < thirtyDays) {
          return {
            theme: parsed.theme || 'modern',
            mode: parsed.mode || getSystemTheme(),
            template: parsed.template || 'modern'
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
  }
  return {
    theme: 'modern',
    mode: getSystemTheme(),
    template: 'modern'
  };
};
