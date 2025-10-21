import React, { useState } from 'react';
import { FaEdit, FaTrash, FaGlobe, FaLink, FaCopy, FaCheck, FaTimes, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import portfolioService from '../services/portfolioService';
import PortfolioEditor from './PortfolioEditor';

const PortfolioActions = ({ portfolio, onUpdate, onDelete, showPublicActions = false }) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const publicUrl = `${window.location.origin}/public/${portfolio.urlSlug}`;

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleEditSave = async (updatedData) => {
        try {
            const response = await portfolioService.updatePortfolio(user.sessionId, portfolio._id, updatedData);
            if (response.success) {
                onUpdate(response.portfolio);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to update portfolio:', error);
            alert('Failed to save changes. Please try again.');
        }
    };

    const handleEditCancel = () => {
        setIsEditing(false);
    };

    const handleTogglePublish = async () => {
        setIsPublishing(true);
        try {
            const response = await portfolioService.togglePublish(user.sessionId, portfolio._id, !portfolio.isPublished);
            if (response.success) {
                onUpdate({ ...portfolio, isPublished: !portfolio.isPublished });
                if (!portfolio.isPublished) {
                    // Just published, show share modal
                    setShowShareModal(true);
                }
            }
        } catch (error) {
            console.error('Failed to toggle publish status:', error);
            alert('Failed to update publish status. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await portfolioService.deletePortfolio(user.sessionId, portfolio._id);
            onDelete(portfolio._id);
        } catch (error) {
            console.error('Failed to delete portfolio:', error);
            alert('Failed to delete portfolio. Please try again.');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(publicUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    };

    const handleShare = () => {
        if (portfolio.isPublished) {
            setShowShareModal(true);
        } else {
            alert('Please publish the portfolio first to get a shareable link.');
        }
    };

    if (isEditing) {
        return (
            <PortfolioEditor
                portfolio={portfolio}
                onSave={handleEditSave}
                onCancel={handleEditCancel}
            />
        );
    }

    return (
        <>
            {/* Action Buttons */}
            <div className="fixed bottom-8 right-8 z-50">
                <div className="bg-white rounded-full shadow-lg border p-2 flex items-center gap-2">
                    {/* Edit Button */}
                    {user && (
                        <button
                            onClick={handleEdit}
                            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
                            title="Edit Portfolio"
                        >
                            <FaEdit className="w-5 h-5" />
                        </button>
                    )}

                    {/* Publish/Unpublish Button */}
                    {user && (
                        <button
                            onClick={handleTogglePublish}
                            disabled={isPublishing}
                            className={`p-3 text-white rounded-full transition-colors shadow-md ${
                                portfolio.isPublished 
                                    ? 'bg-yellow-600 hover:bg-yellow-700' 
                                    : 'bg-green-600 hover:bg-green-700'
                            } ${isPublishing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={portfolio.isPublished ? 'Unpublish Portfolio' : 'Publish Portfolio'}
                        >
                            {isPublishing ? (
                                <FaSpinner className="w-5 h-5 animate-spin" />
                            ) : portfolio.isPublished ? (
                                <FaTimes className="w-5 h-5" />
                            ) : (
                                <FaCheck className="w-5 h-5" />
                            )}
                        </button>
                    )}

                    {/* Share Button */}
                    <button
                        onClick={handleShare}
                        className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-md"
                        title="Share Portfolio"
                    >
                        <FaGlobe className="w-5 h-5" />
                    </button>

                    {/* Delete Button */}
                    {user && (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
                            title="Delete Portfolio"
                        >
                            <FaTrash className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Status Badge */}
                <div className="mt-2 flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        portfolio.isPublished 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                        {portfolio.isPublished ? 'Published' : 'Draft'}
                    </span>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="flex items-center mb-4">
                            <FaExclamationTriangle className="text-red-600 text-2xl mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Delete Portfolio</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{portfolio.header?.name || portfolio.title}"? 
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Portfolio</h3>
                        <p className="text-gray-600 mb-4">
                            Your portfolio is now published! Share this link with anyone:
                        </p>
                        <div className="bg-gray-100 p-3 rounded-md mb-4 flex items-center gap-2">
                            <input
                                type="text"
                                value={publicUrl}
                                readOnly
                                className="flex-1 bg-transparent outline-none text-gray-800 text-sm"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                title="Copy Link"
                            >
                                {copySuccess ? <FaCheck /> : <FaCopy />}
                            </button>
                        </div>
                        {copySuccess && (
                            <p className="text-green-600 text-sm mb-4">Link copied to clipboard!</p>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={() => window.open(publicUrl, '_blank')}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <FaGlobe />
                                Open Public Page
                            </button>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PortfolioActions;