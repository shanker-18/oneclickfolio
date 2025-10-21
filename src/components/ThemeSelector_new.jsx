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
  RefreshCw
} from "lucide-react";
import { useTheme } from '../context/ThemeContext';
import { themeCategories } from "../utils/themes";

const ThemeSelector = () => {
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
    previewTheme
  } = useTheme();

  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewedTheme, setPreviewedTheme] = useState(null);
  
  const dropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsThemeOpen(false);
        setIsTemplateOpen(false);
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
      portfolio: <Zap className="h-4 w-4" />
    };
    return icons[template.id] || <Layout className="h-4 w-4" />;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      professional: <Settings className="h-3 w-3" />,
      creative: <Sparkles className="h-3 w-3" />,
      nature: <RefreshCw className="h-3 w-3" />,
      minimalist: <Grid3x3 className="h-3 w-3" />,
      warm: <Sun className="h-3 w-3" />,
      artistic: <Palette className="h-3 w-3" />
    };
    return icons[category] || <Palette className="h-3 w-3" />;
  };

  const filteredThemes = selectedCategory === 'all' 
    ? availableThemes 
    : availableThemes.filter(theme => 
        themeCategories[selectedCategory]?.includes(theme.key)
      );

  const currentThemeData = availableThemes.find(t => t.key === currentTheme);
  const currentTemplateData = availableTemplates.find(t => t.id === currentTemplate);

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
          <Palette className="h-4 w-4" />
          <span className="text-sm">
            {currentThemeData?.name || 'Modern'}
          </span>
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
                "absolute top-12 left-0 w-80 rounded-xl shadow-2xl border backdrop-blur-sm z-50",
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
                    Choose Theme
                  </h3>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className={getThemeClass(
                        "p-1 rounded-md transition-colors",
                        "hover:bg-gray-100",
                        "hover:bg-gray-700"
                      )}
                      title="Preview Mode"
                    >
                      <Sparkles className={`h-4 w-4 ${isPreviewMode ? 'text-blue-500' : ''}`} />
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
                      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-gradient-to-r ' + themeColors.gradients.header + ' text-white'
                          : getThemeClass('', 'bg-gray-100 text-gray-700 hover:bg-gray-200', 'bg-gray-700 text-gray-300 hover:bg-gray-600')
                      }`}
                    >
                      All
                    </motion.button>
                    {Object.keys(themeCategories).map(category => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-full font-medium transition-colors ${
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
                <div className="space-y-2 max-h-80 overflow-y-auto">
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
                          changeTheme(theme.key);
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
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          currentTheme === theme.key
                            ? `bg-gradient-to-r ${themeColors.gradients.header} text-white shadow-lg`
                            : getThemeClass(
                                '',
                                'hover:bg-gray-50 border border-transparent hover:border-gray-200', 
                                'hover:bg-gray-700 border border-transparent hover:border-gray-600'
                              )
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className={`w-5 h-5 rounded-full bg-gradient-to-r ${theme.gradients.header} shadow-sm`}
                          />
                          <div className="text-left">
                            <div className={`text-sm font-medium ${
                              currentTheme === theme.key 
                                ? 'text-white' 
                                : getThemeClass('', 'text-gray-900', 'text-gray-100')
                            }`}>
                              {theme.name}
                            </div>
                            <div className={`text-xs ${
                              currentTheme === theme.key 
                                ? 'text-white/80'
                                : getThemeClass('', 'text-gray-500', 'text-gray-400')
                            }`}>
                              {theme.description}
                            </div>
                          </div>
                        </div>
                        {currentTheme === theme.key && (
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
          <span className="text-sm">
            {currentTemplateData?.name || 'Modern'}
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
                "absolute top-12 right-0 w-64 rounded-xl shadow-2xl border backdrop-blur-sm z-50",
                "bg-white/95 border-gray-200",
                "bg-gray-800/95 border-gray-600"
              )}
            >
              <div className="p-4">
                <h3 className={getThemeClass(
                  "text-sm font-semibold mb-3",
                  "text-gray-900",
                  "text-gray-100"
                )}>
                  Layout Template
                </h3>
                <div className="space-y-2">
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
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        currentTemplate === template.id
                          ? `bg-gradient-to-r ${themeColors.gradients.header} text-white`
                          : getThemeClass(
                              '', 
                              'hover:bg-gray-50 border border-transparent hover:border-gray-200',
                              'hover:bg-gray-700 border border-transparent hover:border-gray-600'
                            )
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {getTemplateIcon(template)}
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
        <span className="text-sm capitalize">
          {currentMode}
        </span>
      </motion.button>
    </div>
  );
};

export default ThemeSelector;
