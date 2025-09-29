import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import portfolioService from '../services/portfolioService.js';
import { FaPlus, FaEye, FaEdit, FaTrash, FaCopy, FaShare, FaDownload, FaPalette, FaCog, FaArrowRight, FaExclamationTriangle, FaCheck, FaTimes, FaUser, FaSignOutAlt, FaChevronDown, FaMagic, FaRocket, FaBolt, FaStar, FaChartLine, FaGlobe, FaHeart } from 'react-icons/fa';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    fetchPortfolios();
  }, [user]);

  // Handle dropdown focus management
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && showUserMenu) {
        setShowUserMenu(false);
        triggerRef.current?.focus();
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      
      // Focus the first interactive element in dropdown
      const firstButton = dropdownRef.current?.querySelector('button');
      if (firstButton) {
        firstButton.focus();
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showUserMenu]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await portfolioService.getUserPortfolios(user.sessionId);
      if (response.success) {
        setPortfolios(response.portfolios || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Dashboard: handleLogout clicked!');
    
    try {
      console.log('Dashboard: Starting logout process');
      
      // Close the user menu immediately
      setShowUserMenu(false);
      
      // Call the logout function
      await logout();
      console.log('Dashboard: logout() completed');
      
      // Force navigation to login
      console.log('Dashboard: Navigating to login page');
      window.location.href = '/login';
      
    } catch (err) {
      console.error('Dashboard: Logout error:', err);
      // Force logout even if API call fails
      console.log('Dashboard: Force logout - clearing localStorage and redirecting');
      localStorage.removeItem('sessionId');
      window.location.href = '/login';
    }
  };

  const handleDeletePortfolio = async () => {
    if (!portfolioToDelete) return;

    try {
      await portfolioService.deletePortfolio(user.sessionId, portfolioToDelete._id);
      setPortfolios(portfolios.filter(p => p._id !== portfolioToDelete._id));
      setShowDeleteModal(false);
      setPortfolioToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTogglePublish = async (portfolio) => {
    try {
      const response = await portfolioService.togglePublish(user.sessionId, portfolio._id, !portfolio.isPublished);
      if (response.success) {
        setPortfolios(portfolios.map(p =>
          p._id === portfolio._id
            ? { ...p, isPublished: !p.isPublished }
            : p
        ));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDuplicatePortfolio = async (portfolio) => {
    try {
      // Create a copy of the portfolio data
      const duplicateData = {
        title: `${portfolio.title} (Copy)`,
        header: portfolio.header,
        summary: portfolio.summary,
        workExperience: portfolio.workExperience,
        education: portfolio.education
      };

      // Create new portfolio with the same data
      const response = await portfolioService.updatePortfolio(user.sessionId, portfolio._id, duplicateData);
      if (response.success) {
        await fetchPortfolios(); // Refresh the list
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Calculate stats
  const totalPortfolios = portfolios.length;
  const publishedPortfolios = portfolios.filter(p => p.isPublished).length;
  const totalSkills = portfolios.reduce((sum, p) => sum + (p.header?.skills?.length || 0), 0);
  const avgExperience = portfolios.length > 0 ? Math.round(portfolios.reduce((sum, p) => sum + (p.workExperience?.length || 0), 0) / portfolios.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Premium Loading Background */}
        <div className="absolute inset-0 bg-gradient-premium"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-premium-pulse">
              <FaRocket className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading Dashboard</h2>
            <p className="text-white/80 mb-8">Preparing your portfolios...</p>
            <div className="animate-premium-shimmer w-64 h-2 bg-white/20 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Professional Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        {/* Header Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Welcome Section */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-3">
                <FaMagic className="text-yellow-300 text-xl" />
                <span className="text-sm font-semibold text-white/90 uppercase tracking-wide">Welcome Back</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Hello, <span className="text-yellow-300">{user?.name?.split(' ')[0] || 'Creator'}</span>
              </h1>
              <p className="text-lg text-white/90 max-w-2xl">
                Manage your professional portfolios, track performance, and create stunning presentations that showcase your expertise.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/create'}
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-lg flex items-center gap-3 font-semibold text-lg group"
                aria-label="Create new portfolio"
              >
                <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                <span>Create Portfolio</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  ref={triggerRef}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setShowUserMenu(!showUserMenu);
                    } else if (e.key === 'ArrowDown' && !showUserMenu) {
                      e.preventDefault();
                      setShowUserMenu(true);
                    }
                  }}
                  className="flex items-center gap-3 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="User profile menu"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-white font-semibold text-sm">{user?.name || 'User'}</p>
                    <p className="text-white/80 text-xs">{totalPortfolios} portfolios</p>
                  </div>
                  <FaChevronDown className={`text-white/80 text-sm transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div 
                    ref={dropdownRef}
                    className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                    role="menu"
                    aria-label="User account menu"
                  >
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <FaUser className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{user?.name || 'User'}</p>
                          <p className="text-gray-600 text-xs">{user?.email || 'user@example.com'}</p>
                        </div>
                      </div>
                      
                      {/* Status Badges */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <FaGlobe className="w-3 h-3" />
                          {publishedPortfolios} Published
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          <FaStar className="w-3 h-3" />
                          Professional User
                        </span>
                      </div>
                    </div>

                    {/* Sign Out Button */}
                    <div className="py-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleLogout(e);
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            setShowUserMenu(false);
                            triggerRef.current?.focus();
                          }
                        }}
                        className="w-full px-4 py-3 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200 flex items-center gap-3 group cursor-pointer border-none bg-transparent rounded-md"
                        role="menuitem"
                        aria-label="Sign out of your account"
                        tabIndex={0}
                      >
                        <FaSignOutAlt className="text-gray-500 group-hover:text-red-500 group-focus:text-red-500 w-4 h-4 flex-shrink-0 transition-colors duration-200" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Portfolios</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPortfolios}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <FaRocket className="text-indigo-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{publishedPortfolios}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaGlobe className="text-green-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Skills Listed</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSkills}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <FaBolt className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Avg Experience</p>
                  <p className="text-2xl font-bold text-gray-900">{avgExperience}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaChartLine className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-10">
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {portfolios.length === 0 ? (
            <div className="text-center py-20">
              {/* Empty State */}
              <div className="w-full">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FaRocket className="text-4xl text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FaMagic className="text-yellow-800 text-sm" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ready to Create Something <span className="text-indigo-600">Amazing</span>?
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
                  Your portfolio journey starts here. Upload your resume and watch as AI transforms it into a stunning professional showcase.
                </p>
                
                <button
                  onClick={() => window.location.href = '/create'}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg flex items-center gap-3 font-semibold text-lg group mx-auto"
                  aria-label="Create your first portfolio"
                >
                  <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                  <span>Create Your First Portfolio</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FaBolt className="text-blue-500" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    <span>Professional Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRocket className="text-green-500" />
                    <span>Deploy Instantly</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Your Portfolios</h2>
                  <p className="text-gray-600">Manage and track your professional presentations</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">
                    {totalPortfolios} portfolios • {publishedPortfolios} published
                  </div>
                </div>
              </div>
            
              {/* Portfolio Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolios.map((portfolio, index) => (
                  <div 
                    key={portfolio._id} 
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden group"
                  >
                    {/* Card Header */}
                    <div className="relative">
                      {/* Gradient Background */}
                      <div className="h-20 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-2 right-2 w-12 h-12 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          portfolio.isPublished
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-500 text-white'
                        }`}>
                          {portfolio.isPublished ? (
                            <span className="flex items-center gap-1">
                              <FaGlobe className="w-3 h-3" />
                              Live
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <FaCog className="w-3 h-3" />
                              Draft
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {portfolio.header?.name || portfolio.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {portfolio.header?.shortAbout || 'Professional portfolio showcasing skills and experience'}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="text-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                            <FaBolt className="text-indigo-600 text-sm" />
                          </div>
                          <div className="text-lg font-bold text-gray-900">{portfolio.header?.skills?.length || 0}</div>
                          <div className="text-xs text-gray-500 font-medium">Skills</div>
                        </div>
                        <div className="text-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                            <FaRocket className="text-green-600 text-sm" />
                          </div>
                          <div className="text-lg font-bold text-gray-900">{portfolio.workExperience?.length || 0}</div>
                          <div className="text-xs text-gray-500 font-medium">Experience</div>
                        </div>
                        <div className="text-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                            <FaStar className="text-purple-600 text-sm" />
                          </div>
                          <div className="text-lg font-bold text-gray-900">{portfolio.education?.length || 0}</div>
                          <div className="text-xs text-gray-500 font-medium">Education</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {/* Primary Actions */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => window.open(`/portfolio/${portfolio._id}`, '_blank')}
                            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                            aria-label={`View ${portfolio.header?.name || portfolio.title}`}
                          >
                            <FaEye />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => {
                              if (!portfolio.isPublished) {
                                alert('This portfolio is not published yet. Please publish it first.');
                                return;
                              }
                              window.open(`/public/${portfolio.urlSlug}`, '_blank');
                            }}
                            disabled={!portfolio.isPublished}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                              portfolio.isPublished 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                            title={portfolio.isPublished ? 'Open public page' : 'Publish first to enable'}
                            aria-label={portfolio.isPublished ? 'View public page' : 'Publish first to enable public view'}
                          >
                            <FaGlobe />
                            <span>Public</span>
                          </button>
                        </div>
                        
                        {/* Secondary Actions */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleTogglePublish(portfolio)}
                            className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                              portfolio.isPublished
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                            aria-label={portfolio.isPublished ? 'Unpublish portfolio' : 'Publish portfolio'}
                          >
                            {portfolio.isPublished ? <FaTimes /> : <FaCheck />}
                            {portfolio.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleDuplicatePortfolio(portfolio)}
                            className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                            aria-label={`Duplicate ${portfolio.header?.name || portfolio.title}`}
                          >
                            <FaCopy />
                            Copy
                          </button>
                          <button
                            onClick={() => {
                              setPortfolioToDelete(portfolio);
                              setShowDeleteModal(true);
                            }}
                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                            aria-label={`Delete ${portfolio.header?.name || portfolio.title}`}
                          >
                            <FaTrash />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-2xl text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Portfolio</h3>
              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to permanently delete 
                <span className="font-semibold text-gray-900">
                  "{portfolioToDelete?.header?.name || portfolioToDelete?.title}"
                </span>?
              </p>
              <p className="text-red-600 text-sm mt-2 font-medium">
                This action cannot be undone.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPortfolioToDelete(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                aria-label="Cancel deletion"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleDeletePortfolio}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                aria-label="Confirm deletion"
              >
                <FaTrash />
                <span>Delete Forever</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
