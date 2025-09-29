import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import TemplateRenderer from './templates/TemplateRenderer';

const TemplatePreviewModal = ({ 
  isOpen, 
  onClose, 
  templateKey, 
  portfolio, 
  currentTheme, 
  onApplyTemplate 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (isOpen && templateKey) {
      setIsLoading(true);
      // Simulate loading time for template
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, templateKey]);

  const handleApplyTemplate = async () => {
    setIsApplying(true);
    try {
      await onApplyTemplate(templateKey);
      onClose();
    } catch (error) {
      console.error('Failed to apply template:', error);
    } finally {
      setIsApplying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Template Preview</h2>
            <p className="text-white/90 text-sm">
              Preview how your portfolio will look with the selected template
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && (
              <button
                onClick={handleApplyTemplate}
                disabled={isApplying}
                className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isApplying ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Apply Template
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Loading template preview...</p>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg mb-4 inline-block">
                  <span className="font-medium">📱 Preview Mode</span>
                </div>
                <p className="text-gray-600">
                  This is how your portfolio will look with the selected template. 
                  You can scroll through to see all sections.
                </p>
              </div>

              {/* Template Preview */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <TemplateRenderer
                    portfolio={portfolio}
                    templateKey={templateKey}
                    themeKey={currentTheme}
                    isEditing={false}
                    colorMode="light"
                  />
                </div>
              </div>

              {/* Template Info */}
              <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Template Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Features</h4>
                    <ul className="space-y-1 text-gray-600">
                      {getTemplateFeatures(templateKey).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Best For</h4>
                    <div className="flex flex-wrap gap-2">
                      {getTemplateTags(templateKey).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Template changes can be reverted at any time
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyTemplate}
              disabled={isApplying || isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {isApplying ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <FaCheck />
                  Apply Template
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions to get template metadata
const getTemplateFeatures = (templateKey) => {
  const features = {
    classic: [
      'Clean, professional layout',
      'Traditional resume structure',
      'ATS-friendly design',
      'Perfect for corporate roles'
    ],
    modern: [
      'Contemporary card-based design',
      'Interactive elements',
      'Modern typography',
      'Great for creative industries'
    ],
    elegant: [
      'Sophisticated premium design',
      'Luxury styling',
      'Gold and purple accents',
      'Perfect for senior positions'
    ],
    minimal: [
      'Clean, distraction-free design',
      'Focus on content',
      'Centered layout',
      'Great for any profession'
    ],
    creative: [
      'Bold, artistic design',
      'Colorful gradients',
      'Eye-catching layouts',
      'Perfect for designers & artists'
    ],
    tech: [
      'Terminal/console aesthetic',
      'Code-friendly styling',
      'Dark theme with green accents',
      'Perfect for developers'
    ]
  };
  
  return features[templateKey] || [];
};

const getTemplateTags = (templateKey) => {
  const tags = {
    classic: ['Professional', 'Corporate', 'Traditional', 'Business'],
    modern: ['Creative', 'Contemporary', 'Startup', 'Design'],
    elegant: ['Luxury', 'Executive', 'Premium', 'Senior'],
    minimal: ['Clean', 'Simple', 'Universal', 'Focused'],
    creative: ['Artistic', 'Designer', 'Creative', 'Bold'],
    tech: ['Developer', 'Engineer', 'Technical', 'Coding']
  };
  
  return tags[templateKey] || [];
};

export default TemplatePreviewModal;
