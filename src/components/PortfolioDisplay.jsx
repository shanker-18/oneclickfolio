import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaCopy, FaShare, FaDownload, FaPalette, FaCog, FaArrowLeft, FaExclamationTriangle, FaGlobe, FaEnvelope, FaPhone, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import portfolioService from '../services/portfolioService.js';
import { API_BASE_URL } from '../config/api.js';
import { getThemeColors } from '../utils/themes';
import UITemplateSelector from './UITemplateSelector.jsx';
import TemplateRenderer from './templates/TemplateRenderer';

const PortfolioDisplay = ({ portfolio: propPortfolio, onEdit, onDelete, onDuplicate }) => {
    const { user, loading: authLoading } = useAuth();
    const { portfolioId, slug } = useParams();
    const navigate = useNavigate();

    // State for portfolio data
    const [portfolio, setPortfolio] = useState(propPortfolio);
    const [loading, setLoading] = useState(!propPortfolio);
    const [error, setError] = useState(null);
    const [isPublished, setIsPublished] = useState(portfolio?.isPublished || false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(portfolio?.templateKey || 'modern');
    const [currentTheme, setCurrentTheme] = useState(portfolio?.themeKey || 'indigoPurple');
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
                setCurrentTemplate(response.portfolio.templateKey || 'modern');
                setCurrentTheme(response.portfolio.themeKey || 'indigoPurple');
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
        };
        // Update local template/theme states when portfolio changes
        setCurrentTemplate(portfolio?.templateKey || 'modern');
        setCurrentTheme(portfolio?.themeKey || 'indigoPurple');
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
    
    // Helper functions for project extraction and editing
    const extractProjectsFromExtraSections = (extraSections) => {
        if (!extraSections) return [];
        const projectsSection = extraSections.find(section => 
            section.key?.toLowerCase().includes('project') || 
            section.title?.toLowerCase().includes('project')
        );
        return projectsSection?.items || [];
    };
    
    const updateProjectField = (projectIndex, key, value) => {
        setEditData(prev => {
            const extraSections = [...(prev.extraSections || [])];
            const projectsSectionIndex = extraSections.findIndex(s => 
                s.key?.toLowerCase().includes('project') || 
                s.title?.toLowerCase().includes('project')
            );
            
            if (projectsSectionIndex !== -1) {
                const items = [...(extraSections[projectsSectionIndex].items || [])];
                if (items[projectIndex]) {
                    items[projectIndex] = { ...items[projectIndex], [key]: value };
                    extraSections[projectsSectionIndex] = {
                        ...extraSections[projectsSectionIndex],
                        items
                    };
                }
            }
            
            return { ...prev, extraSections };
        });
    };
    
    const removeProjectItem = (projectIndex) => {
        setEditData(prev => {
            const extraSections = [...(prev.extraSections || [])];
            const projectsSectionIndex = extraSections.findIndex(s => 
                s.key?.toLowerCase().includes('project') || 
                s.title?.toLowerCase().includes('project')
            );
            
            if (projectsSectionIndex !== -1) {
                const items = (extraSections[projectsSectionIndex].items || []).filter((_, index) => index !== projectIndex);
                extraSections[projectsSectionIndex] = {
                    ...extraSections[projectsSectionIndex],
                    items
                };
            }
            
            return { ...prev, extraSections };
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
        console.log('Uploading photo:', file.name, file.type, file.size);
        setIsUploadingPhoto(true);
        try {
            const response = await portfolioService.uploadPortfolioPhoto(user.sessionId, portfolio._id, file);
            console.log('Upload response:', response);
            if (response.success && response.photoUrl) {
                console.log('Setting photo URL:', response.photoUrl);
                setPortfolio({ ...portfolio, header: { ...(portfolio.header || {}), photoUrl: response.photoUrl } });
            }
        } catch (err) {
            console.error('Failed to upload photo:', err);
        } finally {
            setIsUploadingPhoto(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Handle template change
    const handleTemplateChange = async (templateKey) => {
        if (!user || !portfolio) return;
        try {
            const response = await portfolioService.updatePortfolio(user.sessionId, portfolio._id, { templateKey });
            if (response.success) {
                setCurrentTemplate(templateKey);
                setPortfolio({ ...portfolio, templateKey });
                console.log('Template updated to:', templateKey);
            }
        } catch (error) {
            console.error('Failed to update template:', error);
        }
    };

    // Handle theme change
    const handleThemeChange = async (themeKey) => {
        if (!user || !portfolio) {
            console.log('❌ Cannot update theme: missing user or portfolio');
            return;
        }
        
        console.log('🎨 Starting theme change to:', themeKey);
        console.log('📱 Current theme before change:', currentTheme);
        console.log('📦 Portfolio ID:', portfolio._id);
        
        // Store the previous theme in case we need to revert
        const previousTheme = currentTheme;
        
        // Update UI immediately for instant feedback
        setCurrentTheme(themeKey);
        
        try {
            const response = await portfolioService.updatePortfolio(user.sessionId, portfolio._id, { themeKey });
            console.log('📡 API response:', response);
            
            if (response.success) {
                // Force a complete portfolio state update to trigger re-render
                setPortfolio(prevPortfolio => ({ ...prevPortfolio, themeKey }));
                console.log('✅ Theme successfully updated to:', themeKey);
            } else {
                console.error('❌ API returned unsuccessful response:', response);
                // Revert the UI change if API failed
                setCurrentTheme(previousTheme);
            }
        } catch (error) {
            console.error('❌ Failed to update theme:', error);
            // Revert the UI change if API failed
            setCurrentTheme(previousTheme);
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

    // Theme values - use local state for immediate UI updates
    const themeName = currentTheme || 'indigoPurple';
    const theme = getThemeColors(themeName, 'light');
    
    // Debug: Log theme information
    console.log('🏠 Current theme state:');
    console.log('- currentTheme:', currentTheme);
    console.log('- themeName:', themeName);
    console.log('- theme.gradients.header:', theme.gradients.header);
    console.log('- portfolio.themeKey:', portfolio?.themeKey);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Debug Theme Info - Remove in production */}
            {portfolioId && (
                <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
                    <h4 className="font-bold mb-2">Debug Theme Info:</h4>
                    <p><strong>Current Theme:</strong> {currentTheme}</p>
                    <p><strong>Header Gradient:</strong> {theme.gradients.header}</p>
                    <p><strong>Portfolio Theme:</strong> {portfolio?.themeKey || 'none'}</p>
                </div>
            )}
            
            {/* UI Template Selector - Only show for portfolio owner */}
            {portfolioId && user && (
                <UITemplateSelector
                    currentTemplate={currentTemplate}
                    currentTheme={currentTheme}
                    onTemplateChange={handleTemplateChange}
                    onThemeChange={handleThemeChange}
                    portfolio={portfolio}
                />
            )}

            {/* Main Content - Full Width */}
            <main className="w-full">
                {/* Quick Edit Panel - Modern Card Design */}
                {isEditing && editData && (
                    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Quick Edit</h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={saving}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                                        saving 
                                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
                                    }`}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 hover:shadow-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Basic Information */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Basic Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input
                                            value={editData.header.name}
                                            onChange={(e) => setEditData({ ...editData, header: { ...editData.header, name: e.target.value } })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Tagline</label>
                                        <input
                                            value={editData.header.shortAbout}
                                            onChange={(e) => setEditData({ ...editData, header: { ...editData.header, shortAbout: e.target.value } })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Professional tagline"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <input
                                            value={editData.header.location}
                                            onChange={(e) => setEditData({ ...editData, header: { ...editData.header, location: e.target.value } })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input 
                                            value={editData.header.contacts.email} 
                                            onChange={(e) => setEditData({ ...editData, header: { ...editData.header, contacts: { ...editData.header.contacts, email: e.target.value } } })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Email address"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Skills and Summary */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Skills & Summary</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
                                        <input
                                            value={(editData.header.skills || []).join(', ')}
                                            onChange={(e) => setEditData({ ...editData, header: { ...editData.header, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            placeholder="JavaScript, React, Node.js"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                                        <textarea
                                            value={editData.summary}
                                            onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                                            placeholder="Professional summary"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Projects Section */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
                                <button
                                    onClick={() => {
                                        const newProject = { title: '', description: '', tech: [], link: '' };
                                        const extraSections = [...(editData.extraSections || [])];
                                        let projectsSectionIndex = extraSections.findIndex(s => 
                                            s.key?.toLowerCase().includes('project') || 
                                            s.title?.toLowerCase().includes('project')
                                        );
                                        
                                        if (projectsSectionIndex === -1) {
                                            extraSections.push({
                                                key: 'projects',
                                                title: 'Projects',
                                                items: [newProject]
                                            });
                                        } else {
                                            extraSections[projectsSectionIndex].items = [
                                                ...(extraSections[projectsSectionIndex].items || []),
                                                newProject
                                            ];
                                        }
                                        
                                        setEditData({ ...editData, extraSections });
                                    }}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 flex items-center gap-2"
                                >
                                    <span className="text-lg">+</span>
                                    Add Project
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {extractProjectsFromExtraSections(editData.extraSections || []).map((project, index) => (
                                    <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-gray-800">Project {index + 1}</h4>
                                                <button
                                                    onClick={() => removeProjectItem(index)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                                                <input
                                                    value={project.title || project.name || ''}
                                                    onChange={(e) => updateProjectField(index, 'title', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    placeholder="Project name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Link</label>
                                                <input
                                                    value={project.link || ''}
                                                    onChange={(e) => updateProjectField(index, 'link', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    placeholder="https://project-demo.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                                <textarea
                                                    value={project.description || ''}
                                                    onChange={(e) => updateProjectField(index, 'description', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                                    rows="3"
                                                    placeholder="Brief description of the project"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                                                <input
                                                    value={Array.isArray(project.tech) ? project.tech.join(', ') : ''}
                                                    onChange={(e) => updateProjectField(index, 'tech', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    placeholder="React, Node.js, MongoDB"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Template Renderer - Full Width */}
                <div className="w-full">
                    <TemplateRenderer
                        portfolio={isEditing ? { ...portfolio, ...editData } : portfolio}
                        templateKey={currentTemplate}
                        themeKey={currentTheme}
                        isEditing={isEditing}
                        onPhotoUpload={openPhotoPicker}
                        colorMode="light"
                    />
                </div>

                {/* Action Buttons - Modern Design */}
                {portfolioId && (
                    <div className="w-full mt-12 pt-8 border-t border-gray-200">
                        <div className="flex flex-wrap gap-4 justify-center">
                            {!isEditing ? (
                                <button
                                    onClick={onEdit ? () => onEdit(portfolio) : handleStartEdit}
                                    className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg flex items-center gap-3 font-medium"
                                >
                                    <FaEdit />
                                    Edit Portfolio
                                </button>
                            ) : null}

                            <button
                                onClick={() => onDuplicate && onDuplicate(portfolio)}
                                className="px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg flex items-center gap-3 font-medium"
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
                                className={`px-8 py-4 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium ${
                                    isPublished 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
                                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                }`}
                                title={isPublished ? 'View the public page' : 'Publish first to enable public view'}
                            >
                                <FaEye />
                                View Public
                            </button>

                            <button
                                onClick={() => onDelete && onDelete(portfolio._id)}
                                className="px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 hover:shadow-lg flex items-center gap-3 font-medium"
                            >
                                <FaTrash />
                                Delete
                            </button>
                        </div>
                    </div>
                )}

                {/* Hidden file input for photo upload */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelected}
                />
            </main>
        </div>
    );
};

export default PortfolioDisplay;
