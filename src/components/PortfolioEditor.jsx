import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaPlus, FaTrash, FaGripVertical, FaCertificate, FaTrophy, FaBriefcase, FaGraduationCap, FaUser, FaEdit, FaGlobe, FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const PortfolioEditor = ({ portfolio, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        header: {
            name: '',
            shortAbout: '',
            location: '',
            contacts: {
                website: '',
                email: '',
                phone: '',
                twitter: '',
                linkedin: '',
                github: ''
            },
            skills: []
        },
        summary: '',
        workExperience: [],
        education: [],
        projects: [],
        certificates: [],
        achievements: []
    });

    const [newSkill, setNewSkill] = useState('');
    const [activeSection, setActiveSection] = useState('basic');

    useEffect(() => {
        if (portfolio) {
            setFormData({
                title: portfolio.title || '',
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
                    skills: portfolio.header?.skills || []
                },
                summary: portfolio.summary || '',
                workExperience: portfolio.workExperience || [],
                education: portfolio.education || [],
                projects: portfolio.projects || [],
                certificates: portfolio.certificates || [],
                achievements: portfolio.achievements || []
            });
        }
    }, [portfolio]);

    const handleInputChange = (path, value) => {
        setFormData(prev => {
            const newData = { ...prev };
            const pathArray = path.split('.');
            let current = newData;
            
            for (let i = 0; i < pathArray.length - 1; i++) {
                current = current[pathArray[i]];
            }
            current[pathArray[pathArray.length - 1]] = value;
            
            return newData;
        });
    };

    const addSkill = () => {
        if (newSkill.trim()) {
            handleInputChange('header.skills', [...formData.header.skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (index) => {
        handleInputChange('header.skills', formData.header.skills.filter((_, i) => i !== index));
    };

    const addExperienceItem = () => {
        handleInputChange('workExperience', [
            ...formData.workExperience,
            {
                company: '',
                title: '',
                location: '',
                start: '',
                end: '',
                description: '',
                contract: 'Full-time'
            }
        ]);
    };

    const updateExperienceItem = (index, field, value) => {
        const updated = [...formData.workExperience];
        updated[index][field] = value;
        handleInputChange('workExperience', updated);
    };

    const removeExperienceItem = (index) => {
        handleInputChange('workExperience', formData.workExperience.filter((_, i) => i !== index));
    };

    const addEducationItem = () => {
        handleInputChange('education', [
            ...formData.education,
            {
                school: '',
                degree: '',
                start: '',
                end: ''
            }
        ]);
    };

    const updateEducationItem = (index, field, value) => {
        const updated = [...formData.education];
        updated[index][field] = value;
        handleInputChange('education', updated);
    };

    const removeEducationItem = (index) => {
        handleInputChange('education', formData.education.filter((_, i) => i !== index));
    };

    const addProjectItem = () => {
        handleInputChange('projects', [
            ...formData.projects,
            {
                name: '',
                description: '',
                technologies: [],
                liveUrl: '',
                githubUrl: '',
                startDate: '',
                endDate: '',
                status: 'completed'
            }
        ]);
    };

    const updateProjectItem = (index, field, value) => {
        const updated = [...formData.projects];
        updated[index][field] = value;
        handleInputChange('projects', updated);
    };

    const removeProjectItem = (index) => {
        handleInputChange('projects', formData.projects.filter((_, i) => i !== index));
    };

    const addCertificateItem = () => {
        handleInputChange('certificates', [
            ...formData.certificates,
            {
                name: '',
                issuer: '',
                year: '',
                credentialId: '',
                link: ''
            }
        ]);
    };

    const updateCertificateItem = (index, field, value) => {
        const updated = [...formData.certificates];
        updated[index][field] = value;
        handleInputChange('certificates', updated);
    };

    const removeCertificateItem = (index) => {
        handleInputChange('certificates', formData.certificates.filter((_, i) => i !== index));
    };

    const addAchievementItem = () => {
        handleInputChange('achievements', [
            ...formData.achievements,
            {
                title: '',
                issuer: '',
                year: '',
                description: ''
            }
        ]);
    };

    const updateAchievementItem = (index, field, value) => {
        const updated = [...formData.achievements];
        updated[index][field] = value;
        handleInputChange('achievements', updated);
    };

    const removeAchievementItem = (index) => {
        handleInputChange('achievements', formData.achievements.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        onSave(formData);
    };

    const sections = [
        { key: 'basic', title: 'Basic Info', icon: FaUser },
        { key: 'experience', title: 'Experience', icon: FaBriefcase },
        { key: 'education', title: 'Education', icon: FaGraduationCap },
        { key: 'projects', title: 'Projects', icon: FaGlobe },
        { key: 'certificates', title: 'Certificates', icon: FaCertificate },
        { key: 'achievements', title: 'Achievements', icon: FaTrophy }
    ];

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 bg-white sticky top-0 z-10 py-4 border-b">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <FaEdit />
                            Edit Portfolio
                        </h1>
                        <p className="text-gray-600">Update your portfolio information</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onCancel}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2"
                        >
                            <FaTimes />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FaSave />
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white border rounded-lg p-4 sticky top-24">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Sections</h3>
                            <nav className="space-y-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.key}
                                        onClick={() => setActiveSection(section.key)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            activeSection === section.key
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <section.icon />
                                        {section.title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Basic Information Section */}
                        {activeSection === 'basic' && (
                            <div className="bg-white border rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <FaUser />
                                    Basic Information
                                </h2>
                                
                                <div className="space-y-6">
                                    {/* Portfolio Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Portfolio Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.header.name}
                                            onChange={(e) => handleInputChange('header.name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Short About */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Professional Tagline
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.header.shortAbout}
                                            onChange={(e) => handleInputChange('header.shortAbout', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., Full-Stack Developer & AI Enthusiast"
                                        />
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.header.location}
                                            onChange={(e) => handleInputChange('header.location', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., San Francisco, CA"
                                        />
                                    </div>

                                    {/* Contact Information */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            Contact Information
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    <FaEnvelope className="inline mr-1" /> Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.header.contacts.email}
                                                    onChange={(e) => handleInputChange('header.contacts.email', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    <FaPhone className="inline mr-1" /> Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={formData.header.contacts.phone}
                                                    onChange={(e) => handleInputChange('header.contacts.phone', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    <FaGlobe className="inline mr-1" /> Website
                                                </label>
                                                <input
                                                    type="url"
                                                    value={formData.header.contacts.website}
                                                    onChange={(e) => handleInputChange('header.contacts.website', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    <FaLinkedin className="inline mr-1" /> LinkedIn
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.header.contacts.linkedin}
                                                    onChange={(e) => handleInputChange('header.contacts.linkedin', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="username"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    <FaGithub className="inline mr-1" /> GitHub
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.header.contacts.github}
                                                    onChange={(e) => handleInputChange('header.contacts.github', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="username"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    <FaTwitter className="inline mr-1" /> Twitter
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.header.contacts.twitter}
                                                    onChange={(e) => handleInputChange('header.contacts.twitter', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="@username"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Professional Summary
                                        </label>
                                        <textarea
                                            value={formData.summary}
                                            onChange={(e) => handleInputChange('summary', e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Write a compelling summary of your professional background and expertise..."
                                        />
                                    </div>

                                    {/* Skills */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Skills
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {formData.header.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                >
                                                    {skill}
                                                    <button
                                                        onClick={() => removeSkill(index)}
                                                        className="text-blue-600 hover:text-red-600 transition-colors"
                                                    >
                                                        <FaTimes className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Add a skill..."
                                            />
                                            <button
                                                onClick={addSkill}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Work Experience Section */}
                        {activeSection === 'experience' && (
                            <div className="bg-white border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                        <FaBriefcase />
                                        Work Experience
                                    </h2>
                                    <button
                                        onClick={addExperienceItem}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <FaPlus />
                                        Add Experience
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {formData.workExperience.map((exp, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-lg font-medium text-gray-900">Experience {index + 1}</h3>
                                                <button
                                                    onClick={() => removeExperienceItem(index)}
                                                    className="text-red-600 hover:text-red-700 transition-colors"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Job Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={exp.title}
                                                        onChange={(e) => updateExperienceItem(index, 'title', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Company
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={exp.company}
                                                        onChange={(e) => updateExperienceItem(index, 'company', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Location
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={exp.location}
                                                        onChange={(e) => updateExperienceItem(index, 'location', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Employment Type
                                                    </label>
                                                    <select
                                                        value={exp.contract}
                                                        onChange={(e) => updateExperienceItem(index, 'contract', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="Full-time">Full-time</option>
                                                        <option value="Part-time">Part-time</option>
                                                        <option value="Contract">Contract</option>
                                                        <option value="Internship">Internship</option>
                                                        <option value="Freelance">Freelance</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Start Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={exp.start}
                                                        onChange={(e) => updateExperienceItem(index, 'start', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g., Jan 2023"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        End Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={exp.end}
                                                        onChange={(e) => updateExperienceItem(index, 'end', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Present or Dec 2023"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={exp.description}
                                                    onChange={(e) => updateExperienceItem(index, 'description', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Describe your responsibilities and achievements..."
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education Section */}
                        {activeSection === 'education' && (
                            <div className="bg-white border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                        <FaGraduationCap />
                                        Education
                                    </h2>
                                    <button
                                        onClick={addEducationItem}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <FaPlus />
                                        Add Education
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {formData.education.map((edu, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-lg font-medium text-gray-900">Education {index + 1}</h3>
                                                <button
                                                    onClick={() => removeEducationItem(index)}
                                                    className="text-red-600 hover:text-red-700 transition-colors"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Degree & Field of Study
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={edu.degree}
                                                        onChange={(e) => updateEducationItem(index, 'degree', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g., Bachelor of Science in Computer Science"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        School/University
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={edu.school}
                                                        onChange={(e) => updateEducationItem(index, 'school', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Start Year
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={edu.start}
                                                        onChange={(e) => updateEducationItem(index, 'start', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g., 2019"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        End Year
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={edu.end}
                                                        onChange={(e) => updateEducationItem(index, 'end', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g., 2023 or Present"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects Section */}
                        {activeSection === 'projects' && (
                            <div className="bg-white border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                        <FaGlobe />
                                        Projects
                                    </h2>
                                    <button
                                        onClick={addProjectItem}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <FaPlus />
                                        Add Project
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {formData.projects.map((project, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-lg font-medium text-gray-900">Project {index + 1}</h3>
                                                <button
                                                    onClick={() => removeProjectItem(index)}
                                                    className="text-red-600 hover:text-red-700 transition-colors"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Project Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={project.name}
                                                        onChange={(e) => updateProjectItem(index, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        value={project.description}
                                                        onChange={(e) => updateProjectItem(index, 'description', e.target.value)}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Describe what this project does and your role..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Technologies (comma-separated)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || ''}
                                                        onChange={(e) => updateProjectItem(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g., React, Node.js, MongoDB"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Status
                                                    </label>
                                                    <select
                                                        value={project.status}
                                                        onChange={(e) => updateProjectItem(index, 'status', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="completed">Completed</option>
                                                        <option value="in-progress">In Progress</option>
                                                        <option value="planned">Planned</option>
                                                        <option value="on-hold">On Hold</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Live URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={project.liveUrl}
                                                        onChange={(e) => updateProjectItem(index, 'liveUrl', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        GitHub URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={project.githubUrl}
                                                        onChange={(e) => updateProjectItem(index, 'githubUrl', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Start Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={project.startDate}
                                                        onChange={(e) => updateProjectItem(index, 'startDate', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g., Jan 2023"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        End Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={project.endDate}
                                                        onChange={(e) => updateProjectItem(index, 'endDate', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g., Mar 2023 or Present"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certificates Section */}
                        {activeSection === 'certificates' && (
                            <div className="bg-white border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                        <FaCertificate />
                                        Certificates
                                    </h2>
                                    <button
                                        onClick={addCertificateItem}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <FaPlus />
                                        Add Certificate
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {formData.certificates.map((cert, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-lg font-medium text-gray-900">Certificate {index + 1}</h3>
                                                <button
                                                    onClick={() => removeCertificateItem(index)}
                                                    className="text-red-600 hover:text-red-700 transition-colors"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Certificate Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={cert.name}
                                                        onChange={(e) => updateCertificateItem(index, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g., AWS Certified Solutions Architect"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Issuing Organization
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={cert.issuer}
                                                        onChange={(e) => updateCertificateItem(index, 'issuer', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g., Amazon Web Services"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Year Earned
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={cert.year}
                                                        onChange={(e) => updateCertificateItem(index, 'year', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g., 2023"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Credential ID (optional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={cert.credentialId}
                                                        onChange={(e) => updateCertificateItem(index, 'credentialId', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Verification Link (optional)
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={cert.link}
                                                        onChange={(e) => updateCertificateItem(index, 'link', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Achievements Section */}
                        {activeSection === 'achievements' && (
                            <div className="bg-white border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                        <FaTrophy />
                                        Achievements & Awards
                                    </h2>
                                    <button
                                        onClick={addAchievementItem}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <FaPlus />
                                        Add Achievement
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {formData.achievements.map((achievement, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-lg font-medium text-gray-900">Achievement {index + 1}</h3>
                                                <button
                                                    onClick={() => removeAchievementItem(index)}
                                                    className="text-red-600 hover:text-red-700 transition-colors"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Achievement Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={achievement.title}
                                                        onChange={(e) => updateAchievementItem(index, 'title', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g., Employee of the Month"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Issuing Organization
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={achievement.issuer}
                                                        onChange={(e) => updateAchievementItem(index, 'issuer', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Year
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={achievement.year}
                                                        onChange={(e) => updateAchievementItem(index, 'year', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g., 2023"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Description (optional)
                                                    </label>
                                                    <textarea
                                                        value={achievement.description}
                                                        onChange={(e) => updateAchievementItem(index, 'description', e.target.value)}
                                                        rows={2}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Brief description of the achievement..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioEditor;