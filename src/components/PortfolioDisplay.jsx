import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaCopy, FaShare, FaDownload, FaPalette, FaCog, FaArrowLeft, FaExclamationTriangle, FaGlobe, FaEnvelope, FaPhone, FaTwitter, FaLinkedin, FaGithub, FaFilePdf, FaCertificate, FaTrophy } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext';
import portfolioService from '../services/portfolioService.js';
import { API_BASE_URL } from '../config/api.js';
import ThemeSelectorEnhanced from './ThemeSelectorEnhanced';
import DynamicTemplateRenderer from './DynamicTemplateRenderer';
import PortfolioActions from './PortfolioActions';
import './Portfolio.css';

// Helper function to convert Tailwind gradient classes to CSS colors
const getGradientColors = (gradientString) => {
  const gradientMap = {
    'from-black': '#000000',
    'from-gray-900': '#111827',
    'from-gray-800': '#1f2937',
    'from-gray-700': '#374151',
    'from-blue-700': '#1d4ed8',
    'from-indigo-700': '#4338ca',
    'from-indigo-800': '#3730a3',
    'from-blue-800': '#1e40af',
    'from-purple-700': '#7c3aed',
    'from-purple-600': '#9333ea',
    'from-indigo-600': '#4f46e5',
    'from-green-700': '#15803d',
    'from-emerald-600': '#059669',
    'from-teal-600': '#0d9488',
    'from-slate-600': '#475569',
    'from-slate-800': '#1e293b',
    'from-pink-500': '#ec4899',
    'from-rose-500': '#f43f5e',
    'from-amber-500': '#f59e0b',
    'from-yellow-600': '#ca8a04',
    'via-gray-900': '#111827',
    'via-gray-800': '#1f2937',
    'via-indigo-700': '#4338ca',
    'via-indigo-600': '#4f46e5',
    'via-blue-700': '#1d4ed8',
    'via-purple-600': '#9333ea',
    'to-black': '#000000',
    'to-gray-900': '#111827',
    'to-gray-800': '#1f2937',
    'to-blue-800': '#1e40af',
    'to-indigo-800': '#3730a3',
    'to-purple-600': '#9333ea',
    'to-green-600': '#16a34a',
    'to-emerald-600': '#059669',
    'to-slate-800': '#1e293b',
    'to-pink-600': '#db2777',
    'to-rose-600': '#dc2626'
  };

  if (!gradientString) return '#000000, #1f2937, #000000';
  
  const colors = gradientString
    .split(' ')
    .map(part => gradientMap[part] || '#000000')
    .filter(color => color !== undefined);
    
  return colors.length > 0 ? colors.join(', ') : '#000000, #1f2937, #000000';
};

const PortfolioDisplay = ({ portfolio: propPortfolio, onEdit, onDelete, onDuplicate }) => {
    const { user, loading: authLoading } = useAuth();
    const { themeColors, getThemeClass, currentMode, currentTemplate, templateConfig, currentTheme } = useTheme();
    const { portfolioId, slug } = useParams();
    const navigate = useNavigate();

    // State for portfolio data
    const [portfolio, setPortfolio] = useState(propPortfolio);
    const [loading, setLoading] = useState(!propPortfolio);
    const [error, setError] = useState(null);
    const [isPublished, setIsPublished] = useState(portfolio?.isPublished || false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const fileInputRef = useRef(null);

    // Local edit state
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editData, setEditData] = useState(null);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const [headerKey, setHeaderKey] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [themeReady, setThemeReady] = useState(false);

    // Initialize theme readiness to prevent flickering
    useEffect(() => {
        // Small delay to ensure theme context is fully loaded
        const timer = setTimeout(() => {
            setThemeReady(true);
            setIsInitialLoad(false);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Simple theme change handler - no automatic switching
    useEffect(() => {
        if (!themeReady) return;
        
        console.log(`🎨 Theme changed: ${currentTheme}, header gradient: ${themeColors.gradients?.header}`);
        setHeaderKey(prev => prev + 1);
    }, [currentTheme, currentMode, themeReady, themeColors.gradients?.header]);

    // Fetch portfolio data if not provided as prop
    useEffect(() => {
        const fetchPortfolio = async () => {
            if (propPortfolio) {
                setPortfolio(propPortfolio);
                setLoading(false);
                return;
            }

            if (!portfolioId && !slug) {
                setError('No portfolio identifier provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                let response;

                if (portfolioId) {
                    if (!user || !user.sessionId) {
                        setError('User not authenticated');
                        setLoading(false);
                        return;
                    }
                    response = await portfolioService.getPortfolio(user.sessionId, portfolioId);
                } else if (slug) {
                    response = await portfolioService.getPublicPortfolio(slug);
                }

                if (response.success && response.portfolio) {
                    setPortfolio(response.portfolio);
                    setIsPublished(response.portfolio.isPublished);
                } else {
                    setError('Portfolio not found');
                }
            } catch (err) {
                setError(err.message || 'Failed to load portfolio');
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [propPortfolio, portfolioId, slug, user]);

    // When portfolio changes, reset edit buffer
    useEffect(() => {
        if (portfolio) {
            setEditData({
                header: {
                    name: portfolio.header?.name || '',
                    shortAbout: portfolio.header?.shortAbout || '',
                    location: portfolio.header?.location || '',
                    contacts: {
                        website: portfolio.header?.contacts?.website || '',
                        email: portfolio.header?.contacts?.email || '',
                        phone: portfolio.header?.contacts?.phone || '',
                        twitter: portfolio.header?.contacts?.twitter || '',
                        linkedin: portfolio.header?.contacts?.linkedin || '',
                        github: portfolio.header?.contacts?.github || ''
                    },
                    skills: Array.isArray(portfolio.header?.skills) ? portfolio.header.skills : []
                },
                summary: portfolio.summary || '',
                workExperience: Array.isArray(portfolio.workExperience) ? portfolio.workExperience.map(w => ({ ...w })) : [],
                education: Array.isArray(portfolio.education) ? portfolio.education.map(e => ({ ...e })) : []
            });
        }
    }, [portfolio]);

    const handleTogglePublish = async () => {
        if (!portfolio) return;

        setIsUpdating(true);
        try {
            const response = await portfolioService.togglePublish(user.sessionId, portfolio._id, !isPublished);
            if (response.success) {
                setIsPublished(!isPublished);
            }
        } catch (error) {
            console.error('Failed to update publish status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const openPhotoPicker = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handlePhotoSelected = async (e) => {
        if (!portfolio || !user) return;
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingPhoto(true);
        try {
            const response = await portfolioService.uploadPortfolioPhoto(user.sessionId, portfolio._id, file);
            if (response.success && response.photoUrl) {
                setPortfolio({ ...portfolio, header: { ...(portfolio.header || {}), photoUrl: response.photoUrl } });
            }
        } catch (err) {
            console.error('Failed to upload photo:', err);
        } finally {
            setIsUploadingPhoto(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownloadPDF = async () => {
        if (!portfolio) return;
        
        setDownloadingPDF(true);
        try {
            if (portfolioId && user?.sessionId) {
                // Download for authenticated user
                await portfolioService.downloadPortfolioPDF(user.sessionId, portfolio._id);
            } else if (slug) {
                // Download for public portfolio
                await portfolioService.downloadPublicPortfolioPDF(slug);
            }
        } catch (error) {
            console.error('Failed to download PDF:', error);
            // You could add a toast notification here
            alert('Failed to download PDF. Please try again.');
        } finally {
            setDownloadingPDF(false);
        }
    };

    // Check if auth is still loading
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading Authentication...</p>
                </div>
            </div>
        );
    }

    // Check authentication for portfolio ID routes
    if (portfolioId && (!user || !user.sessionId)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <FaExclamationTriangle className="h-12 w-12 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-4">Please log in to view this portfolio.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // Loading state with theme-aware styling
    if (loading || !themeReady) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
                themeReady ? getThemeClass('', themeColors.background.light, themeColors.background.dark) : 'bg-gray-50'
            }`}>
                <div className="text-center">
                    <div className={`animate-spin rounded-full h-32 w-32 border-b-2 mx-auto mb-4 ${
                        themeReady ? 'border-purple-600' : 'border-blue-600'
                    }`}></div>
                    <p className={`text-lg font-medium ${
                        themeReady 
                            ? getThemeClass('', themeColors.text.primary.light, themeColors.text.primary.dark)
                            : 'text-gray-600'
                    }`}>
                        {isInitialLoad ? 'Loading Portfolio...' : 'Applying Theme...'}
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <FaExclamationTriangle className="h-12 w-12 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Portfolio</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <FaArrowLeft />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // No portfolio data
    if (!portfolio) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FaExclamationTriangle className="h-12 w-12 text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested portfolio could not be found.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <FaArrowLeft />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Use current theme from context with smooth transitions
    const backgroundClass = getThemeClass(
        "min-h-screen transition-all duration-500",
        themeColors.background.light,
        themeColors.background.dark
    );

    const handlePortfolioUpdate = (updatedPortfolio) => {
        setPortfolio(updatedPortfolio);
    };

    const handlePortfolioDelete = (portfolioId) => {
        navigate('/dashboard');
    };

    return (
        <div className={backgroundClass} style={{ opacity: themeReady ? 1 : 0 }}>
            {/* Floating Theme Selector - Top Right */}
            {portfolioId && (
                <div className="fixed top-4 right-4 z-50">
                    <ThemeSelectorEnhanced />
                </div>
            )}

            {/* Header - Professional with High Visibility */}
            <div 
                className="portfolio-header text-white shadow-xl transition-all duration-500 ease-in-out"
                key={`header-${currentTheme}-${currentMode}-${headerKey}`}
                data-theme={currentTheme}
                style={{
                    minHeight: '200px',
                    background: `linear-gradient(135deg, ${getGradientColors(themeColors.gradients?.header || 'from-black via-gray-900 to-black')})`
                }}
            >
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-8">
                            {portfolio.header?.photoUrl && (
                                <div className="relative">
                                    <img
                                        src={
                                            portfolio.header.photoUrl.startsWith('http')
                                                ? portfolio.header.photoUrl
                                                : `${API_BASE_URL}${portfolio.header.photoUrl}`
                                        }
                                        alt={portfolio.header?.name || 'Profile'}
                                        className="w-24 h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <h1 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                                    {portfolio.header?.name || portfolio.title}
                                </h1>
                                <p className="text-lg lg:text-xl text-white opacity-95 mt-3 font-medium">
                                    {portfolio.header?.shortAbout || 'Professional Portfolio'}
                                </p>
                                {portfolio.header?.location && (
                                    <p className="text-white opacity-90 mt-2 flex items-center gap-2">
                                        <span className="text-lg">📍</span>
                                        <span className="font-medium">{portfolio.header.location}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            {/* PDF Download Button - Always visible */}
                            <button
                                onClick={handleDownloadPDF}
                                disabled={downloadingPDF}
                                className="px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                                title="Download as Professional PDF Resume"
                            >
                                <FaFilePdf className="w-4 h-4" />
                                {downloadingPDF ? 'Generating...' : 'Download PDF'}
                            </button>
                            
                            {portfolioId && (
                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={handleTogglePublish}
                                        disabled={isUpdating}
                                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                            isPublished
                                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                        }`}
                                    >
                                        {isUpdating ? 'Updating...' : (isPublished ? '✓ Published' : '📝 Draft')}
                                    </button>
                                    
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={handlePhotoSelected}
                                    />
                                    <button
                                        onClick={openPhotoPicker}
                                        disabled={isUploadingPhoto}
                                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                            isUploadingPhoto 
                                                ? 'bg-gray-400 text-white cursor-not-allowed' 
                                                : 'bg-white text-gray-800 hover:bg-gray-100 border-2 border-white'
                                        }`}
                                    >
                                        {isUploadingPhoto ? 'Uploading...' : (portfolio.header?.photoUrl ? '📸 Change Photo' : '📸 Add Photo')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Portfolio Content with Dynamic Template */}
            <DynamicTemplateRenderer portfolio={portfolio}>
                {/* Contact Information */}
                {portfolio.header?.contacts && (
                    <div>
                        <h2 className={getThemeClass(
                            "text-xl font-semibold mb-4",
                            themeColors.text.primary.light,
                            themeColors.text.primary.dark
                        )}>Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {portfolio.header.contacts.email && (
                                <div className="flex items-center gap-3">
                                    <FaEnvelope className="text-gray-400" />
                                    <span className={getThemeClass(
                                        "",
                                        themeColors.text.primary.light,
                                        themeColors.text.primary.dark
                                    )}>{portfolio.header.contacts.email}</span>
                                </div>
                            )}
                            {portfolio.header.contacts.phone && (
                                <div className="flex items-center gap-3">
                                    <FaPhone className="text-gray-400" />
                                    <span className={getThemeClass(
                                        "",
                                        themeColors.text.primary.light,
                                        themeColors.text.primary.dark
                                    )}>{portfolio.header.contacts.phone}</span>
                                </div>
                            )}
                            {portfolio.header.location && (
                                <div className="flex items-center gap-3">
                                    <FaGlobe className="text-gray-400" />
                                    <span className={getThemeClass(
                                        "",
                                        themeColors.text.primary.light,
                                        themeColors.text.primary.dark
                                    )}>{portfolio.header.location}</span>
                                </div>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-4">
                            {portfolio.header.contacts.linkedin && (
                                <a href={`https://linkedin.com/in/${portfolio.header.contacts.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                    <FaLinkedin className="w-5 h-5" />
                                </a>
                            )}
                            {portfolio.header.contacts.github && (
                                <a href={`https://github.com/${portfolio.header.contacts.github}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                                    <FaGithub className="w-5 h-5" />
                                </a>
                            )}
                            {portfolio.header.contacts.twitter && (
                                <a href={`https://twitter.com/${portfolio.header.contacts.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                                    <FaTwitter className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Summary */}
                {portfolio.summary && (
                    <div>
                        <h2 className={getThemeClass(
                            "text-xl font-semibold mb-4",
                            themeColors.text.primary.light,
                            themeColors.text.primary.dark
                        )}>About</h2>
                        <p className={getThemeClass(
                            "leading-relaxed",
                            themeColors.text.secondary.light,
                            themeColors.text.secondary.dark
                        )}>{portfolio.summary}</p>
                    </div>
                )}

                {/* Skills */}
                {portfolio.header?.skills && portfolio.header.skills.length > 0 && (
                    <div>
                        <h2 className={getThemeClass(
                            "text-xl font-semibold mb-4",
                            themeColors.text.primary.light,
                            themeColors.text.primary.dark
                        )}>Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {portfolio.header.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${themeColors.gradients.skills}`}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Work Experience */}
                {portfolio.workExperience && portfolio.workExperience.length > 0 && (
                    <div>
                        <h2 className={getThemeClass(
                            "text-xl font-semibold mb-4",
                            themeColors.text.primary.light,
                            themeColors.text.primary.dark
                        )}>Work Experience</h2>
                        <div className="space-y-6">
                            {portfolio.workExperience.map((exp, index) => (
                                <div key={index} className="border-l-4 border-blue-500 pl-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className={getThemeClass(
                                                "text-lg font-semibold",
                                                themeColors.text.primary.light,
                                                themeColors.text.primary.dark
                                            )}>{exp.title}</h3>
                                            <p className="font-medium">{exp.company}</p>
                                            {exp.location && (
                                                <p className={getThemeClass(
                                                    "text-sm",
                                                    themeColors.text.secondary.light,
                                                    themeColors.text.secondary.dark
                                                )}>{exp.location}</p>
                                            )}
                                        </div>
                                        <div className="text-right text-sm text-gray-500">
                                            <p>{exp.start} - {exp.end}</p>
                                            {exp.contract && (
                                                <p className="text-xs opacity-80">{exp.contract}</p>
                                            )}
                                        </div>
                                    </div>
                                    <p className={getThemeClass(
                                        "leading-relaxed",
                                        themeColors.text.secondary.light,
                                        themeColors.text.secondary.dark
                                    )}>{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {portfolio.education && portfolio.education.length > 0 && (
                    <div>
                        <h2 className={getThemeClass(
                            "text-xl font-semibold mb-4",
                            themeColors.text.primary.light,
                            themeColors.text.primary.dark
                        )}>Education</h2>
                        <div className="space-y-4">
                            {portfolio.education.map((edu, index) => (
                                <div key={index} className="border-l-4 border-green-500 pl-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className={getThemeClass(
                                                "text-lg font-semibold",
                                                themeColors.text.primary.light,
                                                themeColors.text.primary.dark
                                            )}>{edu.degree}</h3>
                                            <p className="font-medium">{edu.school}</p>
                                        </div>
                                        <div className="text-right text-sm text-gray-500">
                                            <p>{edu.start} - {edu.end}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {(() => {
                    // Get projects from main projects field or from extraSections
                    const mainProjects = portfolio.projects || [];
                    const projectsFromExtra = portfolio.extraSections?.find(section => section.key === 'projects')?.items || [];
                    const allProjects = mainProjects.length > 0 ? mainProjects : projectsFromExtra;
                    
                    return allProjects && allProjects.length > 0 ? (
                    <div>
                        <h2 className={getThemeClass(
                            "text-xl font-semibold mb-4",
                            themeColors.text.primary.light,
                            themeColors.text.primary.dark
                        )}>Projects</h2>
                        <div className="space-y-6">
                            {allProjects.map((project, index) => (
                                <div key={index} className={`border-l-4 border-purple-500 pl-4 p-4 rounded-r-lg ${getThemeClass(
                                    "bg-opacity-50",
                                    "bg-gray-50",
                                    "bg-gray-800"
                                )}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className={getThemeClass(
                                                "text-lg font-semibold mb-1",
                                                themeColors.text.primary.light,
                                                themeColors.text.primary.dark
                                            )}>{project.name || project.title}</h3>
                                            
                                            {project.description && (
                                                <p className={getThemeClass(
                                                    "leading-relaxed mb-3",
                                                    themeColors.text.secondary.light,
                                                    themeColors.text.secondary.dark
                                                )}>{project.description}</p>
                                            )}
                                            
                                            {/* Technologies/Skills used */}
                                            {project.technologies && project.technologies.length > 0 && (
                                                <div className="mb-3">
                                                    <p className={getThemeClass(
                                                        "text-sm font-medium mb-2",
                                                        themeColors.text.primary.light,
                                                        themeColors.text.primary.dark
                                                    )}>Technologies:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {project.technologies.map((tech, techIndex) => (
                                                            <span
                                                                key={techIndex}
                                                                className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md font-medium"
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Project Links */}
                                            {(project.liveUrl || project.githubUrl || project.demoUrl) && (
                                                <div className="flex gap-3 mt-2">
                                                    {project.liveUrl && (
                                                        <a 
                                                            href={project.liveUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                                        >
                                                            <FaGlobe className="w-3 h-3" />
                                                            Live Demo
                                                        </a>
                                                    )}
                                                    {project.githubUrl && (
                                                        <a 
                                                            href={project.githubUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                                        >
                                                            <FaGithub className="w-3 h-3" />
                                                            Source Code
                                                        </a>
                                                    )}
                                                    {project.demoUrl && (
                                                        <a 
                                                            href={project.demoUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800 transition-colors"
                                                        >
                                                            <FaEye className="w-3 h-3" />
                                                            Demo
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Project Duration/Date */}
                                        {(project.startDate || project.endDate || project.duration) && (
                                            <div className="text-right text-sm text-gray-500 ml-4">
                                                {project.startDate && project.endDate ? (
                                                    <p>{project.startDate} - {project.endDate}</p>
                                                ) : project.duration ? (
                                                    <p>{project.duration}</p>
                                                ) : project.startDate ? (
                                                    <p>{project.startDate}</p>
                                                ) : project.endDate ? (
                                                    <p>{project.endDate}</p>
                                                ) : null}
                                                
                                                {project.status && (
                                                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                                        project.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {project.status}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    ) : null;
                })()}

                {/* Certificates */}
                {portfolio.certificates && portfolio.certificates.length > 0 && (
                    <div>
                        <h2 className={getThemeClass(
                            "text-xl font-semibold mb-4",
                            themeColors.text.primary.light,
                            themeColors.text.primary.dark
                        )}>Certificates</h2>
                        <div className="space-y-4">
                            {portfolio.certificates.map((cert, index) => (
                                <div key={index} className={`border-l-4 border-yellow-500 pl-4 p-4 rounded-r-lg ${getThemeClass(
                                    "bg-opacity-50",
                                    "bg-yellow-50",
                                    "bg-yellow-900 bg-opacity-20"
                                )}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaCertificate className="text-yellow-600" />
                                                <h3 className={getThemeClass(
                                                    "text-lg font-semibold",
                                                    themeColors.text.primary.light,
                                                    themeColors.text.primary.dark
                                                )}>{cert.name}</h3>
                                            </div>
                                            <p className={getThemeClass(
                                                "font-medium mb-1",
                                                themeColors.text.secondary.light,
                                                themeColors.text.secondary.dark
                                            )}>{cert.issuer}</p>
                                            {cert.credentialId && (
                                                <p className={getThemeClass(
                                                    "text-sm opacity-75",
                                                    themeColors.text.secondary.light,
                                                    themeColors.text.secondary.dark
                                                )}>Credential ID: {cert.credentialId}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">{cert.year}</p>
                                            {cert.link && (
                                                <a 
                                                    href={cert.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    Verify
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements */}
                {portfolio.achievements && portfolio.achievements.length > 0 && (
                    <div>
                        <h2 className={getThemeClass(
                            "text-xl font-semibold mb-4",
                            themeColors.text.primary.light,
                            themeColors.text.primary.dark
                        )}>Achievements & Awards</h2>
                        <div className="space-y-4">
                            {portfolio.achievements.map((achievement, index) => (
                                <div key={index} className={`border-l-4 border-orange-500 pl-4 p-4 rounded-r-lg ${getThemeClass(
                                    "bg-opacity-50",
                                    "bg-orange-50",
                                    "bg-orange-900 bg-opacity-20"
                                )}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaTrophy className="text-orange-600" />
                                                <h3 className={getThemeClass(
                                                    "text-lg font-semibold",
                                                    themeColors.text.primary.light,
                                                    themeColors.text.primary.dark
                                                )}>{achievement.title}</h3>
                                            </div>
                                            <p className={getThemeClass(
                                                "font-medium mb-1",
                                                themeColors.text.secondary.light,
                                                themeColors.text.secondary.dark
                                            )}>{achievement.issuer}</p>
                                            {achievement.description && (
                                                <p className={getThemeClass(
                                                    "text-sm leading-relaxed",
                                                    themeColors.text.secondary.light,
                                                    themeColors.text.secondary.dark
                                                )}>{achievement.description}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">{achievement.year}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </DynamicTemplateRenderer>

            {/* Portfolio Action Buttons */}
            {portfolio && (
                <PortfolioActions 
                    portfolio={portfolio} 
                    onUpdate={handlePortfolioUpdate}
                    onDelete={handlePortfolioDelete}
                />
            )}
        </div>
    );
};

export default PortfolioDisplay;
