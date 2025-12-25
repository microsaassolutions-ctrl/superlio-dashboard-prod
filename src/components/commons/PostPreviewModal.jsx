import React, { useState, useEffect } from "react";
import { FiX, FiExternalLink, FiThumbsUp, FiMessageCircle, FiRepeat, FiSend, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Overlay } from "./index";
import { profile, linkedInIcon, globeIcon } from "../../assets/images";
import ImageComponent from "./Image";
import useMainStore from "../../store/useMainStore";
import useUploadStore from "../../store/uploadStore";
import { get } from "../../api/apiService";

/**
 * PostPreviewModal - Displays LinkedIn post preview
 * 
 * For PUBLISHED posts: Shows LinkedIn embed (actual post with real engagement)
 * For SCHEDULED/PROCESSING posts: Shows local content preview with media
 */
const PostPreviewModal = ({ post: initialPost, onClose }) => {
    const [embedLoading, setEmbedLoading] = useState(true);
    const [embedError, setEmbedError] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [post, setPost] = useState(initialPost);

    // Get user settings from store (for headshot and name)
    const userHeadshot = useMainStore((state) => state.data?.settings?.headshot);
    const userName = useMainStore((state) => state.data?.settings?.name);

    // Auto-refresh status for processing/uploading posts
    useEffect(() => {
        const status = post?.status?.toLowerCase();
        const needsPolling = status === 'processing' || status?.startsWith('uploading');

        if (!needsPolling || !post?.id || typeof post.id === 'string') return;

        const pollInterval = setInterval(async () => {
            try {
                const response = await get('/linkedin/posts', {}, true);
                if (response?.success && response?.data) {
                    const updatedPost = response.data.find(p => p.id === post.id);
                    if (updatedPost && updatedPost.status !== post.status) {
                        setPost(updatedPost);
                        // Stop polling if status is final
                        if (['published', 'failed', 'scheduled'].includes(updatedPost.status?.toLowerCase())) {
                            clearInterval(pollInterval);
                        }
                    }
                }
            } catch (error) {
                console.log('[PostPreviewModal] Poll error:', error.message);
            }
        }, 60000); // 60 seconds

        return () => clearInterval(pollInterval);
    }, [post?.id, post?.status]);

    // Check if this is a published post with a LinkedIn URN
    const isPublished = post?.status === 'published' && post?.linkedin_post_id;

    // Build LinkedIn embed URL
    const getEmbedUrl = () => {
        if (!post?.linkedin_post_id) return null;
        return `https://www.linkedin.com/embed/feed/update/${post.linkedin_post_id}`;
    };

    const openOnLinkedIn = () => {
        if (post?.linkedin_post_id) {
            const linkedInUrl = `https://www.linkedin.com/feed/update/${post.linkedin_post_id}/`;
            window.open(linkedInUrl, "_blank");
        }
    };

    const getContentText = () => {
        return typeof post?.content === 'string'
            ? post.content
            : (post?.content?.post || "No content available");
    };

    // Get truncated content (first 3 lines or 200 characters)
    const getTruncatedContent = () => {
        const content = getContentText();
        const lines = content.split('\n');
        if (lines.length <= 3 && content.length <= 200) {
            return { text: content, isTruncated: false };
        }
        const truncated = lines.slice(0, 3).join('\n').substring(0, 200);
        return { text: truncated + '...', isTruncated: true };
    };

    // Get media URLs from post
    const getMediaUrls = () => {
        if (post?.media_urls) {
            try {
                return typeof post.media_urls === 'string'
                    ? JSON.parse(post.media_urls)
                    : post.media_urls;
            } catch {
                return [];
            }
        }
        // Check alternative field names for media
        if (post?.media_url) {
            return [post.media_url];
        }
        if (post?.file_url) {
            return [post.file_url];
        }
        if (post?.aws_url) {
            return [post.aws_url];
        }
        // Debug: log post to see what fields are available
        console.log('[PostPreviewModal] Post data for media debug:', post);
        return [];
    };

    // Check if status is uploading (could be "uploading" or "Uploading X%")
    const isUploading = post?.status?.toLowerCase()?.startsWith('uploading');

    // Get upload progress from uploadStore for temporary uploads
    const activeUploads = useUploadStore((state) => state.activeUploads);
    const uploadProgress = post?.id && typeof post.id === 'string' && post.id.startsWith('upload_')
        ? activeUploads[post.id]?.progress || 0
        : null;

    // Format status text with percentage if uploading
    const getStatusText = () => {
        if (isUploading && uploadProgress !== null) {
            return `Uploading ${uploadProgress}%`;
        }
        return post?.status?.charAt(0).toUpperCase() + post?.status?.slice(1) || 'Unknown';
    };

    // Get status pill styling
    const getStatusPill = () => {
        const status = post?.status?.toLowerCase();
        if (isUploading) {
            return { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500', isSpinner: true };
        }
        const config = {
            published: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', animate: false },
            scheduled: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', animate: false },
            processing: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500', animate: true },
            failed: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', animate: false },
        };
        return config[status] || { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500', animate: false };
    };

    const statusStyle = getStatusPill();
    const mediaUrls = getMediaUrls();
    const { text: displayContent, isTruncated } = getTruncatedContent();

    return (
        <Overlay onClose={onClose}>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-xl w-[560px] max-h-[90vh] overflow-hidden font-sans text-gray-800">
                {/* Header */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Post Preview</h2>
                    <div className="flex items-center gap-3">
                        {/* Status Pill in Header */}
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.isSpinner ? (
                                <svg className="animate-spin h-3 w-3 mr-1.5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <span className={`w-2 h-2 mr-1.5 rounded-full ${statusStyle.dot} ${statusStyle.animate ? 'animate-pulse' : ''}`}></span>
                            )}
                            {getStatusText()}
                        </span>
                        {post?.linkedin_post_id && (
                            <button
                                onClick={openOnLinkedIn}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Open in new tab"
                            >
                                <FiExternalLink className="w-3.5 h-3.5" />
                                Open on LinkedIn
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition p-1"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    {isPublished ? (
                        /* PUBLISHED POST: Show LinkedIn Embed */
                        <div className="p-4">
                            <div className="relative bg-gray-50 rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
                                {embedLoading && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                                        <p className="text-gray-500 text-sm">Loading LinkedIn post...</p>
                                    </div>
                                )}

                                {embedError ? (
                                    <div className="flex flex-col items-center justify-center h-[400px] text-center p-6 bg-white">
                                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-800 font-semibold text-lg mb-2">Post Not Found</p>
                                        <p className="text-gray-500 text-sm mb-1">This post could not be loaded from LinkedIn.</p>
                                        <p className="text-gray-400 text-xs mb-6">It may have been deleted, made private, or is no longer available.</p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={openOnLinkedIn}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FiExternalLink className="w-4 h-4" />
                                                Try on LinkedIn
                                            </button>
                                            <button
                                                onClick={onClose}
                                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <iframe
                                        src={getEmbedUrl()}
                                        height="500"
                                        width="100%"
                                        frameBorder="0"
                                        allowFullScreen
                                        title="LinkedIn Post"
                                        onLoad={() => setEmbedLoading(false)}
                                        onError={() => {
                                            setEmbedLoading(false);
                                            setEmbedError(true);
                                        }}
                                        style={{
                                            display: embedLoading ? 'none' : 'block',
                                            border: 'none'
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        /* SCHEDULED/PROCESSING POST: Show Local Content with Media */
                        <div className="p-5">
                            {/* LinkedIn Card Style */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                {/* Author Info */}
                                <div className="p-4">
                                    <div className="flex items-start gap-3">
                                        <ImageComponent
                                            src={userHeadshot}
                                            fallbackSrc={profile}
                                            alt="Profile"
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900">{userName || "You"}</h4>
                                                <ImageComponent
                                                    src={linkedInIcon}
                                                    alt="LinkedIn"
                                                    className="w-4 h-4"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                <span>
                                                    {post?.scheduled_at
                                                        ? new Date(post.scheduled_at).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })
                                                        : 'Just now'}
                                                </span>
                                                <span>•</span>
                                                <ImageComponent
                                                    src={globeIcon}
                                                    alt="Public"
                                                    className="w-3 h-3"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post Content with See More */}
                                    <div className="mt-4">
                                        <p
                                            className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap"
                                            dangerouslySetInnerHTML={{
                                                __html: (isExpanded ? getContentText() : displayContent).replace(/\n/g, "<br>")
                                            }}
                                        />
                                        {isTruncated && (
                                            <button
                                                onClick={() => setIsExpanded(!isExpanded)}
                                                className="text-gray-500 hover:text-gray-700 text-sm font-medium mt-1 flex items-center gap-1"
                                            >
                                                {isExpanded ? (
                                                    <>See less <FiChevronUp className="w-4 h-4" /></>
                                                ) : (
                                                    <>...see more <FiChevronDown className="w-4 h-4" /></>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Media Preview - Show actual media if URL available, otherwise type indicator */}
                                {(mediaUrls.length > 0 || post?.media_type) && (
                                    <div className="border-t border-gray-100">
                                        {mediaUrls.length > 0 ? (
                                            /* Actual Media Preview */
                                            <div className="relative">
                                                {post?.media_type?.includes('video') ? (
                                                    <video
                                                        src={mediaUrls[0]}
                                                        controls
                                                        className="w-full max-h-[300px] object-contain bg-gray-900"
                                                    />
                                                ) : post?.media_type?.includes('pdf') ? (
                                                    <div className="relative bg-gradient-to-br from-red-50 to-red-100 h-48 flex flex-col items-center justify-center">
                                                        <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                                                            <span className="text-white font-bold text-lg">PDF</span>
                                                        </div>
                                                        <span className="text-red-700 text-sm font-medium">PDF Carousel attached</span>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={mediaUrls[0]}
                                                        alt="Post media"
                                                        className="w-full max-h-[300px] object-contain bg-gray-50"
                                                    />
                                                )}
                                            </div>
                                        ) : post?.media_type ? (
                                            /* Fallback: Type Indicator when no URL */
                                            <>
                                                {post.media_type.includes('video') ? (
                                                    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 h-48 flex flex-col items-center justify-center">
                                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                                                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-white text-sm font-medium">Video attached</span>
                                                    </div>
                                                ) : post.media_type.includes('pdf') ? (
                                                    <div className="relative bg-gradient-to-br from-red-50 to-red-100 h-48 flex flex-col items-center justify-center">
                                                        <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                                                            <span className="text-white font-bold text-lg">PDF</span>
                                                        </div>
                                                        <span className="text-red-700 text-sm font-medium">PDF Carousel attached</span>
                                                    </div>
                                                ) : (
                                                    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 h-48 flex flex-col items-center justify-center">
                                                        <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-blue-700 text-sm font-medium">Image attached</span>
                                                    </div>
                                                )}
                                            </>
                                        ) : null}
                                    </div>
                                )}

                                {/* Action Buttons (Display Only) */}
                                <div className="flex justify-around items-center px-4 py-3 border-t border-gray-100">
                                    <button className="flex items-center gap-2 text-gray-400 text-sm font-medium px-4 py-2 rounded-lg cursor-default">
                                        <FiThumbsUp className="w-4 h-4" />
                                        Like
                                    </button>
                                    <button className="flex items-center gap-2 text-gray-400 text-sm font-medium px-4 py-2 rounded-lg cursor-default">
                                        <FiMessageCircle className="w-4 h-4" />
                                        Comment
                                    </button>
                                    <button className="flex items-center gap-2 text-gray-400 text-sm font-medium px-4 py-2 rounded-lg cursor-default">
                                        <FiRepeat className="w-4 h-4" />
                                        Repost
                                    </button>
                                    <button className="flex items-center gap-2 text-gray-400 text-sm font-medium px-4 py-2 rounded-lg cursor-default">
                                        <FiSend className="w-4 h-4" />
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Overlay>
    );
};

export default PostPreviewModal;
