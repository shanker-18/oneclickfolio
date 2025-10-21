import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaCopy, FaShare, FaDownload, FaPalette, FaCog, FaArrowLeft, FaExclamationTriangle, FaGlobe, FaEnvelope, FaPhone, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext';
import portfolioService from '../services/portfolioService.js';
import { API_BASE_URL } from '../config/api.js';
import ThemeSelectorEnhanced from './ThemeSelectorEnhanced';

const PortfolioDisplay = ({ portfolio: propPortfolio, onEdit, onDelete, onDuplicate }) => {
    const { user, loading: authLoading } = useAuth();
    const { themeColors, getThemeClass, currentMode } = useTheme();
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

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading Portfolio...</p>
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

    // Use current theme from context
    const backgroundClass = getThemeClass(
        "min-h-screen",
        themeColors.background.light,
        themeColors.background.dark
    );

    return (
        <div className={backgroundClass}>
            {/* Floating Theme Selector - Top Right */}
            {portfolioId && (
                <div className="fixed top-4 right-4 z-50">
                    <ThemeSelectorEnhanced />
                </div>
            )}

            {/* Header */}
            <div className={`bg-gradient-to-br ${themeColors.gradients.header} text-white shadow-lg`}>
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {portfolio.header?.photoUrl && (
                                <img
                                    src={
                                        portfolio.header.photoUrl.startsWith('http')
                                            ? portfolio.header.photoUrl
                                            : `${API_BASE_URL}${portfolio.header.photoUrl}`
                                    }
                                    alt={portfolio.header?.name || 'Profile'}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
                                />
                            )}
                            <div>
                                <h1 className="text-3xl font-bold">{portfolio.header?.name || portfolio.title}</h1>
                                <p className="opacity-90 mt-2">
                                    {portfolio.header?.shortAbout || 'Professional Portfolio'}
                                </p>
                                {portfolio.header?.location && (
                                    <p className="opacity-80 mt-1">
                                        📍 {portfolio.header.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        {portfolioId && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleTogglePublish}
                                    disabled={isUpdating}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isPublished
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-yellow-600 hover:bg-yellow-700'
                                        }`}
                                >
                                    {isUpdating ? 'Updating...' : (isPublished ? 'Published' : 'Draft')}
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
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isUploadingPhoto ? 'bg-gray-400' : 'bg-white text-blue-700 hover:bg-blue-50'}`}
                                >
                                    {isUploadingPhoto ? 'Uploading...' : (portfolio.header?.photoUrl ? 'Change Photo' : 'Upload Photo')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Portfolio Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Contact Information */}
                {portfolio.header?.contacts && (
                    <div className={getThemeClass(
                        "rounded-lg shadow-sm border p-6 mb-6",
                        `${themeColors.card.light} ${themeColors.border.light}`,
                        `${themeColors.card.dark} ${themeColors.border.dark}`
                    )}>
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
                    <div className={getThemeClass(
                        "rounded-lg shadow-sm border p-6 mb-6",
                        `${themeColors.card.light} ${themeColors.border.light}`,
                        `${themeColors.card.dark} ${themeColors.border.dark}`
                    )}>
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
                    <div className={getThemeClass(
                        "rounded-lg shadow-sm border p-6 mb-6",
                        `${themeColors.card.light} ${themeColors.border.light}`,
                        `${themeColors.card.dark} ${themeColors.border.dark}`
                    )}>
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
                    <div className={getThemeClass(
                        "rounded-lg shadow-sm border p-6 mb-6",
                        `${themeColors.card.light} ${themeColors.border.light}`,
                        `${themeColors.card.dark} ${themeColors.border.dark}`
                    )}>
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
                    <div className={getThemeClass(
                        "rounded-lg shadow-sm border p-6",
                        `${themeColors.card.light} ${themeColors.border.light}`,
                        `${themeColors.card.dark} ${themeColors.border.dark}`
                    )}>
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
            </div>
        </div>
    );
};

export default PortfolioDisplay;