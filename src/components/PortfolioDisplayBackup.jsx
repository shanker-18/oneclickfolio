import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaCopy, FaShare, FaDownload, FaPalette, FaCog, FaArrowLeft, FaExclamationTriangle, FaGlobe, FaEnvelope, FaPhone, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext';
import portfolioService from '../services/portfolioService.js';
import { API_BASE_URL } from '../config/api.js';
import { getThemeColors } from '../utils/themes';
import ThemeSelectorEnhanced from './ThemeSelectorEnhanced';
import DynamicTemplateRenderer from './DynamicTemplateRenderer';

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
                education: Array.isArray(portfolio.education) ? portfolio.education.map(e => ({ ...e })) : [],
                extraSections: Array.isArray(portfolio.extraSections) ? portfolio.extraSections.map(s => ({
                    key: s.key,
                    title: s.title,
                    items: Array.isArray(s.items) ? s.items.map(i => ({ ...i })) : []
                })) : []
            });
        }
    }, [portfolio]);

    const handleStartEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        // Reset edits to current portfolio values
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
                summary: portfolio.summary || ''
            });
        }
        setIsEditing(false);
    };

    const handleSaveEdit = async () => {
        if (!user || !portfolio) return;
        setSaving(true);
        try {
            const payload = {
                header: {
                    ...(portfolio.header || {}),
                    name: editData.header.name,
                    shortAbout: editData.header.shortAbout,
                    location: editData.header.location,
                    contacts: { ...(portfolio.header?.contacts || {}), ...editData.header.contacts },
                    skills: Array.isArray(editData.header.skills) ? editData.header.skills : []
                },
                summary: editData.summary,
                workExperience: Array.isArray(editData.workExperience) ? editData.workExperience : [],
                education: Array.isArray(editData.education) ? editData.education : [],
                extraSections: Array.isArray(editData.extraSections) ? editData.extraSections : []
            };
            const resp = await portfolioService.updatePortfolio(user.sessionId, portfolio._id, payload);
            if (resp.success && resp.portfolio) {
                setPortfolio(resp.portfolio);
                setIsEditing(false);
            }
        } catch (e) {
            console.error('Failed to save edits', e);
        } finally {
            setSaving(false);
        }
    };

    // Helpers to update arrays
    const updateWorkField = (index, key, value) => {
        setEditData(prev => {
            const list = [...(prev.workExperience || [])];
            list[index] = { ...(list[index] || {}), [key]: value };
            return { ...prev, workExperience: list };
        });
    };

    const addWorkItem = () => {
        setEditData(prev => ({
            ...prev,
            workExperience: [...(prev.workExperience || []), { company: '', link: '', location: '', contract: '', title: '', start: '', end: '', description: '' }]
        }));
    };

    const removeWorkItem = (index) => {
        setEditData(prev => ({
            ...prev,
            workExperience: (prev.workExperience || []).filter((_, i) => i !== index)
        }));
    };

    const updateEduField = (index, key, value) => {
        setEditData(prev => {
            const list = [...(prev.education || [])];
            list[index] = { ...(list[index] || {}), [key]: value };
            return { ...prev, education: list };
        });
    };

    const addEduItem = () => {
        setEditData(prev => ({
            ...prev,
            education: [...(prev.education || []), { school: '', degree: '', start: '', end: '' }]
        }));
    };

    const removeEduItem = (index) => {
        setEditData(prev => ({
            ...prev,
            education: (prev.education || []).filter((_, i) => i !== index)
        }));
    };

    const updateExtraSectionTitle = (sIdx, title) => {
        setEditData(prev => {
            const sections = [...(prev.extraSections || [])];
            sections[sIdx] = { ...(sections[sIdx] || {}), title };
            return { ...prev, extraSections: sections };
        });
    };

    const addExtraSection = () => {
        setEditData(prev => ({
            ...prev,
            extraSections: [...(prev.extraSections || []), { key: `custom-${Date.now()}`, title: 'New Section', items: [] }]
        }));
    };

    const removeExtraSection = (sIdx) => {
        setEditData(prev => ({
            ...prev,
            extraSections: (prev.extraSections || []).filter((_, i) => i !== sIdx)
        }));
    };

    const addExtraItem = (sIdx) => {
        setEditData(prev => {
            const sections = [...(prev.extraSections || [])];
            const items = [...(sections[sIdx]?.items || [])];
            items.push({ title: '', name: '', description: '', link: '', year: '', venue: '', tech: [] });
            sections[sIdx] = { ...(sections[sIdx] || {}), items };
            return { ...prev, extraSections: sections };
        });
    };

    const removeExtraItem = (sIdx, iIdx) => {
        setEditData(prev => {
            const sections = [...(prev.extraSections || [])];
            const items = (sections[sIdx]?.items || []).filter((_, idx) => idx !== iIdx);
            sections[sIdx] = { ...(sections[sIdx] || {}), items };
            return { ...prev, extraSections: sections };
        });
    };

    const updateExtraItemField = (sIdx, iIdx, key, value) => {
        setEditData(prev => {
            const sections = [...(prev.extraSections || [])];
            const items = [...(sections[sIdx]?.items || [])];
            items[iIdx] = { ...(items[iIdx] || {}), [key]: value };
            sections[sIdx] = { ...(sections[sIdx] || {}), items };
            return { ...prev, extraSections: sections };
        });
    };

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
                                
                                {/* Enhanced Theme and Template Selector */}
                                <ThemeSelectorEnhanced />
                                
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
                <div className={getThemeClass(
                    "rounded-lg shadow-sm border",
                    `${themeColors.card.light} ${themeColors.border.light}`,
                    `${themeColors.card.dark} ${themeColors.border.dark}`
                )}>
                    {/* Simple inline editor for key fields */}
                    {isEditing && editData && (
                        <div className={getThemeClass(
                            "p-6 border-b",
                            `${themeColors.border.light}`,
                            `${themeColors.border.dark}`
                        )}>
                            <h2 className={getThemeClass(
                                "text-xl font-semibold mb-4",
                                `${themeColors.text.primary.light}`,
                                `${themeColors.text.primary.dark}`
                            )}>Edit Basics</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Name</label>
                                    <input
                                        value={editData.header.name}
                                        onChange={(e) => setEditData({ ...editData, header: { ...editData.header, name: e.target.value } })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Tagline</label>
                                    <input
                                        value={editData.header.shortAbout}
                                        onChange={(e) => setEditData({ ...editData, header: { ...editData.header, shortAbout: e.target.value } })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Professional tagline"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Location</label>
                                    <input
                                        value={editData.header.location}
                                        onChange={(e) => setEditData({ ...editData, header: { ...editData.header, location: e.target.value } })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="City, Country"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-600 mb-1">Summary</label>
                                    <textarea
                                        value={editData.summary}
                                        onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
                                        className="w-full border rounded px-3 py-2 min-h-[100px]"
                                        placeholder="Professional summary"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-600 mb-1">Skills (comma separated)</label>
                                    <input
                                        value={(editData.header.skills || []).join(', ')}
                                        onChange={(e) => setEditData({ ...editData, header: { ...editData.header, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="JavaScript, React, Node.js"
                                    />
                                </div>
                            </div>
                            {/* Contacts */}
                            <div className="mt-6">
                                <h3 className={getThemeClass(
                                    "text-lg font-semibold mb-3",
                                    `${themeColors.text.primary.light}`,
                                    `${themeColors.text.primary.dark}`
                                )}>Contacts</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Email</label>
                                        <input className="w-full border rounded px-3 py-2" value={editData.header.contacts.email} onChange={(e) => setEditData({ ...editData, header: { ...editData.header, contacts: { ...editData.header.contacts, email: e.target.value } } })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Phone</label>
                                        <input className="w-full border rounded px-3 py-2" value={editData.header.contacts.phone} onChange={(e) => setEditData({ ...editData, header: { ...editData.header, contacts: { ...editData.header.contacts, phone: e.target.value } } })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Website</label>
                                        <input className="w-full border rounded px-3 py-2" value={editData.header.contacts.website} onChange={(e) => setEditData({ ...editData, header: { ...editData.header, contacts: { ...editData.header.contacts, website: e.target.value } } })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">LinkedIn</label>
                                        <input className="w-full border rounded px-3 py-2" value={editData.header.contacts.linkedin} onChange={(e) => setEditData({ ...editData, header: { ...editData.header, contacts: { ...editData.header.contacts, linkedin: e.target.value } } })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">GitHub</label>
                                        <input className="w-full border rounded px-3 py-2" value={editData.header.contacts.github} onChange={(e) => setEditData({ ...editData, header: { ...editData.header, contacts: { ...editData.header.contacts, github: e.target.value } } })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Twitter</label>
                                        <input className="w-full border rounded px-3 py-2" value={editData.header.contacts.twitter} onChange={(e) => setEditData({ ...editData, header: { ...editData.header, contacts: { ...editData.header.contacts, twitter: e.target.value } } })} />
                                    </div>
                                </div>
                            </div>
                            {/* Work Experience */}
                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className={getThemeClass(
                                        "text-lg font-semibold",
                                        `${themeColors.text.primary.light}`,
                                        `${themeColors.text.primary.dark}`
                                    )}>Work Experience</h3>
                                    <button onClick={addWorkItem} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add Experience</button>
                                </div>
                                <div className="space-y-4">
                                    {(editData.workExperience || []).map((exp, idx) => (
                                        <div key={idx} className="border rounded p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm text-gray-600">Item #{idx + 1}</span>
                                                <button onClick={() => removeWorkItem(idx)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Remove</button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <input className="border rounded px-3 py-2" placeholder="Company" value={exp.company || ''} onChange={(e) => updateWorkField(idx, 'company', e.target.value)} />
                                                <input className="border rounded px-3 py-2" placeholder="Title" value={exp.title || ''} onChange={(e) => updateWorkField(idx, 'title', e.target.value)} />
                                                <input className="border rounded px-3 py-2" placeholder="Location" value={exp.location || ''} onChange={(e) => updateWorkField(idx, 'location', e.target.value)} />
                                                <input className="border rounded px-3 py-2" placeholder="Contract" value={exp.contract || ''} onChange={(e) => updateWorkField(idx, 'contract', e.target.value)} />
                                                <input className="border rounded px-3 py-2" placeholder="Start" value={exp.start || ''} onChange={(e) => updateWorkField(idx, 'start', e.target.value)} />
                                                <input className="border rounded px-3 py-2" placeholder="End" value={exp.end || ''} onChange={(e) => updateWorkField(idx, 'end', e.target.value)} />
                                                <input className="border rounded px-3 py-2 md:col-span-3" placeholder="Company Link" value={exp.link || ''} onChange={(e) => updateWorkField(idx, 'link', e.target.value)} />
                                                <textarea className="border rounded px-3 py-2 md:col-span-3" placeholder="Description" value={exp.description || ''} onChange={(e) => updateWorkField(idx, 'description', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Education */}
                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className={`text-lg font-semibold ${theme.text.primary.light}`}>Education</h3>
                                    <button onClick={addEduItem} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add Education</button>
                                </div>
                                <div className="space-y-4">
                                    {(editData.education || []).map((edu, idx) => (
                                        <div key={idx} className="border rounded p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm text-gray-600">Item #{idx + 1}</span>
                                                <button onClick={() => removeEduItem(idx)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Remove</button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                <input className="border rounded px-3 py-2" placeholder="School" value={edu.school || ''} onChange={(e) => updateEduField(idx, 'school', e.target.value)} />
                                                <input className="border rounded px-3 py-2" placeholder="Degree" value={edu.degree || ''} onChange={(e) => updateEduField(idx, 'degree', e.target.value)} />
                                                <input className="border rounded px-3 py-2" placeholder="Start" value={edu.start || ''} onChange={(e) => updateEduField(idx, 'start', e.target.value)} />
                                                <input className="border rounded px-3 py-2" placeholder="End" value={edu.end || ''} onChange={(e) => updateEduField(idx, 'end', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Extra Sections */}
                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className={`text-lg font-semibold ${theme.text.primary.light}`}>Extra Sections</h3>
                                    <button onClick={addExtraSection} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add Section</button>
                                </div>
                                <div className="space-y-6">
                                    {(editData.extraSections || []).map((section, sIdx) => (
                                        <div key={sIdx} className="border rounded p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex-1 mr-3">
                                                    <input className="w-full border rounded px-3 py-2" placeholder="Section Title" value={section.title || ''} onChange={(e) => updateExtraSectionTitle(sIdx, e.target.value)} />
                                                </div>
                                                <button onClick={() => removeExtraSection(sIdx)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Remove Section</button>
                                            </div>
                                            <div className="space-y-3">
                                                {(section.items || []).map((item, iIdx) => (
                                                    <div key={iIdx} className="border rounded p-3">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-xs text-gray-600">Item #{iIdx + 1}</span>
                                                            <button onClick={() => removeExtraItem(sIdx, iIdx)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Remove</button>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                            <input className="border rounded px-3 py-2" placeholder="Title" value={item.title || ''} onChange={(e) => updateExtraItemField(sIdx, iIdx, 'title', e.target.value)} />
                                                            <input className="border rounded px-3 py-2" placeholder="Name" value={item.name || ''} onChange={(e) => updateExtraItemField(sIdx, iIdx, 'name', e.target.value)} />
                                                            <input className="border rounded px-3 py-2" placeholder="Link" value={item.link || ''} onChange={(e) => updateExtraItemField(sIdx, iIdx, 'link', e.target.value)} />
                                                            <input className="border rounded px-3 py-2" placeholder="Venue" value={item.venue || ''} onChange={(e) => updateExtraItemField(sIdx, iIdx, 'venue', e.target.value)} />
                                                            <input className="border rounded px-3 py-2" placeholder="Year" value={item.year || ''} onChange={(e) => updateExtraItemField(sIdx, iIdx, 'year', e.target.value)} />
                                                            <input className="border rounded px-3 py-2 md:col-span-3" placeholder="Tech (comma separated)" value={Array.isArray(item.tech) ? item.tech.join(', ') : ''} onChange={(e) => updateExtraItemField(sIdx, iIdx, 'tech', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} />
                                                            <textarea className="border rounded px-3 py-2 md:col-span-3" placeholder="Description" value={item.description || ''} onChange={(e) => updateExtraItemField(sIdx, iIdx, 'description', e.target.value)} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3">
                                                <button onClick={() => addExtraItem(sIdx)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add Item</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Contact Information */}
                    {portfolio.header?.contacts && (
                        <div className={`p-6 border-b ${theme.border.light}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${theme.text.primary.light}`}>Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {portfolio.header.contacts.email && (
                                    <div className="flex items-center gap-3">
                                        <FaEnvelope className="text-gray-400" />
                                        <span className={`${theme.text.primary.light}`}>{portfolio.header.contacts.email}</span>
                                    </div>
                                )}
                                {portfolio.header.contacts.phone && (
                                    <div className="flex items-center gap-3">
                                        <FaPhone className="text-gray-400" />
                                        <span className={`${theme.text.primary.light}`}>{portfolio.header.contacts.phone}</span>
                                    </div>
                                )}
                                {portfolio.header.location && (
                                    <div className="flex items-center gap-3">
                                        <FaGlobe className="text-gray-400" />
                                        <span className={`${theme.text.primary.light}`}>{portfolio.header.location}</span>
                                    </div>
                                )}
                                {portfolio.header.contacts.website && (
                                    <div className="flex items-center gap-3">
                                        <FaGlobe className="text-gray-400" />
                                        <a href={portfolio.header.contacts.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                            {portfolio.header.contacts.website}
                                        </a>
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
                        <div className={`p-6 border-b ${theme.border.light}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${theme.text.primary.light}`}>About</h2>
                            <p className={`${theme.text.secondary.light} leading-relaxed`}>{portfolio.summary}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {portfolio.header?.skills && portfolio.header.skills.length > 0 && (
                        <div className={`p-6 border-b ${theme.border.light}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${theme.text.primary.light}`}>Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {portfolio.header.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${theme.gradients.skills}`}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Work Experience */}
                    {portfolio.workExperience && portfolio.workExperience.length > 0 && (
                        <div className={`p-6 border-b ${theme.border.light}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${theme.text.primary.light}`}>Work Experience</h2>
                            <div className="space-y-6">
                                {portfolio.workExperience.map((exp, index) => (
                                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className={`text-lg font-semibold ${theme.text.primary.light}`}>{exp.title}</h3>
                                                <p className={`font-medium`}>{exp.company}</p>
                                                {exp.location && (
                                                    <p className={`${theme.text.secondary.light} text-sm`}>{exp.location}</p>
                                                )}
                                            </div>
                                            <div className={`text-right text-sm ${theme.text.muted?.light || 'text-gray-500'}`}>
                                                <p>{exp.start} - {exp.end}</p>
                                                {exp.contract && (
                                                    <p className="text-xs opacity-80">{exp.contract}</p>
                                                )}
                                            </div>
                                        </div>
                                        <p className={`${theme.text.secondary.light} leading-relaxed`}>{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {portfolio.education && portfolio.education.length > 0 && (
                        <div className="p-6">
                            <h2 className={`text-xl font-semibold mb-4 ${theme.text.primary.light}`}>Education</h2>
                            <div className="space-y-4">
                                {portfolio.education.map((edu, index) => (
                                    <div key={index} className="border-l-4 border-green-500 pl-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className={`text-lg font-semibold ${theme.text.primary.light}`}>{edu.degree}</h3>
                                                <p className={`font-medium`}>{edu.school}</p>
                                            </div>
                                            <div className={`text-right text-sm ${theme.text.muted?.light || 'text-gray-500'}`}>
                                                <p>{edu.start} - {edu.end}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dynamic Extra Sections */}
                    {Array.isArray(portfolio.extraSections) && portfolio.extraSections.length > 0 && (
                        <div className={`p-6 border-t ${theme.border.light}`}>
                            {portfolio.extraSections.map((section, sIdx) => (
                                (section?.items?.length > 0) ? (
                                    <div key={sIdx} className="mb-8">
                                        <h2 className={`text-xl font-semibold mb-4 ${theme.text.primary.light}`}>{section.title || section.key}</h2>
                                        <div className="space-y-4">
                                            {section.items.map((item, iIdx) => (
                                                <div key={iIdx} className={`border rounded-md p-4 ${theme.border.light}`}>
                                                    {/* Generic renderer: print common fields nicely */}
                                                    {item.title && <p className={`font-medium ${theme.text.primary.light}`}>{item.title}</p>}
                                                    {item.name && <p className={`font-medium ${theme.text.primary.light}`}>{item.name}</p>}
                                                    {item.venue && <p className={`${theme.text.secondary.light} text-sm`}>{item.venue} {item.year ? `• ${item.year}` : ''}</p>}
                                                    {item.client && <p className={`${theme.text.secondary.light} text-sm`}>Client: {item.client}</p>}
                                                    {item.description && <p className={`${theme.text.secondary.light} mt-1`}>{item.description}</p>}
                                                    {Array.isArray(item.tech) && item.tech.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {item.tech.map((t, tIdx) => (
                                                                <span key={tIdx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">{t}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {item.link && (
                                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm">View</a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {portfolioId && (
                    <div className="mt-8 flex flex-wrap gap-4 justify-center">
                        {!isEditing ? (
                            <button
                                onClick={onEdit ? () => onEdit(portfolio) : handleStartEdit}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FaEdit />
                                Edit Portfolio
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={saving}
                                    className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${saving ? 'bg-green-400 text-white' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                                >
                                    Cancel
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => onDuplicate && onDuplicate(portfolio)}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaCopy />
                            Duplicate
                        </button>

                        <button
                            onClick={() => {
                                if (!isPublished) {
                                    alert('This portfolio is not published yet. Please publish it first to view the public link.');
                                    return;
                                }
                                window.open(`/public/${portfolio.urlSlug}`, '_blank');
                            }}
                            disabled={!isPublished}
                            className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${isPublished ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                            title={isPublished ? 'View the public page' : 'Publish first to enable public view'}
                        >
                            <FaEye />
                            View Public
                        </button>

                        <button
                            onClick={() => onDelete && onDelete(portfolio._id)}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <FaTrash />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortfolioDisplay;
