import React, { useState } from 'react';
import { FaPalette, FaTimes, FaCheck, FaEye, FaLayerGroup, FaStar, FaRocket, FaMagic, FaBolt } from 'react-icons/fa';
import TemplatePreviewModal from './TemplatePreviewModal';

const UITemplateSelector = ({ currentTemplate, currentTheme, onTemplateChange, onThemeChange, portfolio }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('themes');
  const [previewModal, setPreviewModal] = useState({ isOpen: false, templateKey: null });

  const portfolioTemplates = {
    classic: {
      name: 'Classic Professional',
      description: 'Traditional, formal business style',
      category: 'Professional',
      preview: '📄',
      features: ['Clean Layout', 'Professional Styling', 'ATS Friendly'],
      gradient: 'from-gray-600 to-gray-800'
    },
    modern: {
      name: 'Modern Creative',
      description: 'Contemporary design with visual flair',
      category: 'Creative',
      preview: '🎨',
      features: ['Card-based Design', 'Modern Typography', 'Interactive Elements'],
      gradient: 'from-blue-500 to-purple-600'
    },
    elegant: {
      name: 'Elegant Luxury',
      description: 'Sophisticated premium appearance',
      category: 'Luxury',
      preview: '💎',
      features: ['Premium Design', 'Gold Accents', 'Sophisticated Layout'],
      gradient: 'from-purple-600 to-pink-600'
    },
    minimal: {
      name: 'Minimal Clean',
      description: 'Simple, focused, and distraction-free',
      category: 'Minimal',
      preview: '✨',
      features: ['Minimalist Design', 'Focus on Content', 'Clean Typography'],
      gradient: 'from-gray-400 to-gray-600'
    },
    creative: {
      name: 'Creative Showcase',
      description: 'Bold design for creative professionals',
      category: 'Creative',
      preview: '🎭',
      features: ['Bold Colors', 'Creative Layout', 'Portfolio Focus'],
      gradient: 'from-orange-500 to-red-600'
    },
    tech: {
      name: 'Tech Professional',
      description: 'Perfect for developers and tech roles',
      category: 'Technology',
      preview: '💻',
      features: ['Code-friendly', 'Tech Aesthetic', 'Dark Mode Support'],
      gradient: 'from-green-500 to-blue-600'
    },
    'creative-new': {
      name: 'Creative Enhanced',
      description: 'Enhanced creative design with animations',
      category: 'Creative',
      preview: '🌟',
      features: ['Animated Elements', 'Creative Layout', 'Interactive Design'],
      gradient: 'from-pink-500 to-purple-600'
    },
    professional: {
      name: 'Professional Clean',
      description: 'Clean professional layout for business',
      category: 'Professional',
      preview: '💼',
      features: ['Business Focus', 'Clean Layout', 'Professional Styling'],
      gradient: 'from-indigo-600 to-blue-800'
    }
  };

  const colorThemes = {
    indigoPurple: {
      name: 'Indigo Purple',
      description: 'Professional indigo with purple accents',
      preview: 'from-indigo-600 to-purple-600',
      category: 'Professional'
    },
    blueGreen: {
      name: 'Ocean Blue',
      description: 'Calm blue-green ocean vibes',
      preview: 'from-blue-500 to-teal-500',
      category: 'Calm'
    },
    warmSunset: {
      name: 'Warm Sunset',
      description: 'Orange-red sunset warmth',
      preview: 'from-orange-500 to-red-500',
      category: 'Energetic'
    },
    forestGreen: {
      name: 'Forest Green',
      description: 'Natural green with earth tones',
      preview: 'from-green-600 to-emerald-600',
      category: 'Natural'
    },
    royalPurple: {
      name: 'Royal Purple',
      description: 'Elegant purple royalty',
      preview: 'from-purple-600 to-violet-600',
      category: 'Elegant'
    },
    monochrome: {
      name: 'Monochrome',
      description: 'Classic black and white',
      preview: 'from-gray-800 to-gray-900',
      category: 'Classic'
    },
    cyberpunk: {
      name: 'Cyberpunk Neon',
      description: 'Futuristic neon cyberpunk vibes',
      preview: 'from-pink-500 to-purple-600',
      category: 'Futuristic'
    },
    tropical: {
      name: 'Tropical Paradise',
      description: 'Vibrant tropical colors',
      preview: 'from-emerald-500 to-teal-600',
      category: 'Vibrant'
    },
    midnight: {
      name: 'Midnight Blue',
      description: 'Deep midnight blue elegance',
      preview: 'from-slate-800 to-slate-900',
      category: 'Elegant'
    },
    roseGold: {
      name: 'Rose Gold',
      description: 'Luxurious rose gold theme',
      preview: 'from-rose-400 to-pink-500',
      category: 'Luxury'
    }
  };

  const handleTemplateSelect = (templateKey) => {
    onTemplateChange(templateKey);
    // Auto-close after selection
    setTimeout(() => setIsOpen(false), 500);
  };

  const handleThemeSelect = (themeKey) => {
    onThemeChange(themeKey);
    // Auto-close after selection
    setTimeout(() => setIsOpen(false), 500);
  };

  const handlePreview = (templateKey) => {
    setPreviewModal({ isOpen: true, templateKey });
  };

  const handleClosePreview = () => {
    setPreviewModal({ isOpen: false, templateKey: null });
  };

  const handleApplyFromPreview = async (templateKey) => {
    await onTemplateChange(templateKey);
    handleClosePreview();
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl border border-gray-200 rounded-xl px-4 py-3 transition-all duration-300 flex items-center gap-2 group"
        title="Customize UI & Theme"
      >
        <FaLayerGroup className="text-blue-600 group-hover:text-purple-600 transition-colors" />
        <span className="text-gray-700 font-medium hidden sm:block">Customize UI</span>
      </button>

      {/* Full Screen Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaPalette className="text-yellow-300" />
                  Customize Your Portfolio
                </h2>
                <p className="text-white/90 mt-1">Choose the perfect template and theme for your professional brand</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setSelectedCategory('templates')}
                className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                  selectedCategory === 'templates'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <FaLayerGroup />
                Templates
              </button>
              <button
                onClick={() => setSelectedCategory('themes')}
                className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                  selectedCategory === 'themes'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <FaPalette />
                Color Themes
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              {selectedCategory === 'templates' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Templates</h3>
                    <p className="text-gray-600">Choose a layout that best represents your professional style</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(portfolioTemplates).map(([key, template]) => (
                      <div
                        key={key}
                        className={`relative bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          currentTemplate === key
                            ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleTemplateSelect(key)}
                      >
                        {/* Selected Badge */}
                        {currentTemplate === key && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <FaCheck className="text-white text-xs" />
                          </div>
                        )}

                        {/* Template Preview */}
                        <div className={`h-32 bg-gradient-to-br ${template.gradient} rounded-lg mb-4 flex items-center justify-center text-white text-4xl relative overflow-hidden`}>
                          <span className="text-6xl opacity-80">{template.preview}</span>
                          <div className="absolute inset-0 bg-black/20"></div>
                          <div className="absolute bottom-2 right-2">
                            <span className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                              {template.category}
                            </span>
                          </div>
                        </div>

                        {/* Template Info */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                          <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                          
                          {/* Features */}
                          <div className="space-y-1 mb-4">
                            {template.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTemplateSelect(key);
                              }}
                              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                currentTemplate === key
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              }`}
                            >
                              {currentTemplate === key ? 'Selected' : 'Select'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreview(key);
                              }}
                              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <FaEye className="text-gray-600 text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCategory === 'themes' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Color Themes</h3>
                    <p className="text-gray-600">Select colors that match your professional brand</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(colorThemes).map(([key, theme]) => (
                      <div
                        key={key}
                        className={`relative bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          currentTheme === key
                            ? 'border-purple-500 shadow-lg ring-2 ring-purple-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleThemeSelect(key)}
                      >
                        {/* Selected Badge */}
                        {currentTheme === key && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <FaCheck className="text-white text-xs" />
                          </div>
                        )}

                        {/* Color Preview */}
                        <div className={`h-24 bg-gradient-to-r ${theme.preview} rounded-lg mb-4 relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                              <div className="text-xs font-medium text-gray-800">{theme.category}</div>
                            </div>
                          </div>
                        </div>

                        {/* Theme Info */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{theme.name}</h4>
                          <p className="text-gray-600 text-sm mb-4">{theme.description}</p>

                          {/* Action Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleThemeSelect(key);
                            }}
                            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                              currentTheme === key
                                ? 'bg-purple-500 text-white'
                                : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                            }`}
                          >
                            {currentTheme === key ? 'Selected' : 'Apply Theme'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <FaMagic className="inline mr-2 text-blue-500" />
                Changes are applied instantly to your portfolio
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        isOpen={previewModal.isOpen}
        onClose={handleClosePreview}
        templateKey={previewModal.templateKey}
        portfolio={portfolio}
        currentTheme={currentTheme}
        onApplyTemplate={handleApplyFromPreview}
      />
    </>
  );
};

export default UITemplateSelector;
