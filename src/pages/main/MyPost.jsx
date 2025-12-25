import React, { useEffect, useState } from "react";
import { get, deleteReq, put } from "../../api/apiService";
import { errorToaster, successToaster } from "../../utils/toaster";
import { getCookieValue } from "../../utils/helpers";
import { Loading, Overlay, DateRangeFilter, PostPreviewModal } from "../../components/commons";
import { FiTrash2, FiClock, FiRefreshCw, FiChevronUp, FiChevronDown } from "react-icons/fi";
import ShowMoreText from "react-show-more-text";
import { format, addMinutes, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import useUploadStore from "../../store/uploadStore";
import { setupUploadWarning, startBackgroundUpload } from "../../utils/uploadManager";

const MyPost = () => {
    console.log('[MyPost] v2.0 - Component loaded with getCookieValue and 60s polling');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("All");
    const [filter, setFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [dateRange, setDateRange] = useState({ start: null, end: null });

    // Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRescheduling, setIsRescheduling] = useState(false);

    // Reschedule form state
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleHour, setScheduleHour] = useState(12);
    const [scheduleMinute, setScheduleMinute] = useState(0);
    const [schedulePeriod, setSchedulePeriod] = useState("PM");

    // Subscribe to active uploads for real-time progress display
    const activeUploads = useUploadStore((state) => state.activeUploads);
    const lastCompletedUpload = useUploadStore((state) => state.lastCompletedUpload);
    const clearLastCompleted = useUploadStore((state) => state.clearLastCompleted);

    // Setup beforeunload warning for active uploads
    useEffect(() => {
        const cleanup = setupUploadWarning();
        return cleanup;
    }, []);

    // Refresh posts when an upload completes
    useEffect(() => {
        if (lastCompletedUpload) {
            fetchPosts();
            clearLastCompleted();
        }
    }, [lastCompletedUpload]);

    useEffect(() => {
        fetchPosts();
    }, []);

    // Smart auto-polling: Only poll when there are processing posts
    // Poll every 120 seconds - uploading handled by callback, scheduled by manual refresh
    useEffect(() => {
        // Check if we need to poll (processing posts only)
        const needsPolling = () => {
            return posts.some(post => post.status === 'processing');
        };

        // Only set up polling if there are uploading/processing posts
        if (!needsPolling()) {
            return; // No polling needed
        }

        console.log('[MyPost] Starting smart polling (60s interval) - uploading/processing posts detected');

        const pollInterval = setInterval(() => {
            if (needsPolling()) {
                console.log('[MyPost] Polling for status updates...');
                fetchPosts(true); // Silent refresh - no loading indicator
            } else {
                console.log('[MyPost] All uploads/processing complete - stopping poll');
                clearInterval(pollInterval);
            }
        }, 60000); // 60 seconds

        return () => {
            console.log('[MyPost] Cleaning up poll interval');
            clearInterval(pollInterval);
        };
    }, [posts, activeUploads]); // Re-evaluate when posts or uploads change

    const fetchPosts = async (silent = false) => {
        try {
            // Only show loading indicator on initial load, not during background polling
            if (!silent) setLoading(true);
            const response = await get("/linkedin/posts");
            if (response?.success) {
                setPosts(response.data);
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const openDeleteModal = (post) => {
        setSelectedPost(post);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedPost(null);
        setDeleteModalOpen(false);
    };

    const openRescheduleModal = (post) => {
        setSelectedPost(post);

        // Use the post's existing scheduled time if available, otherwise now + 2 minutes
        let baseTime;
        if (post.scheduled_at) {
            // Parse the existing scheduled time (database stores in UTC)
            let scheduledDateStr = post.scheduled_at;
            if (!scheduledDateStr.endsWith('Z') && !scheduledDateStr.includes('+')) {
                scheduledDateStr = scheduledDateStr.replace(' ', 'T') + 'Z';
            }
            baseTime = new Date(scheduledDateStr);
        } else {
            // Fallback to now + 2 minutes for new schedules
            baseTime = addMinutes(new Date(), 2);
        }

        // If the scheduled time is in the past, default to now + 2 minutes
        if (baseTime < new Date()) {
            baseTime = addMinutes(new Date(), 2);
        }

        setScheduleDate(format(baseTime, "yyyy-MM-dd"));

        let h = baseTime.getHours();
        const m = baseTime.getMinutes();
        const p = h >= 12 ? "PM" : "AM";
        h = h % 12;
        h = h ? h : 12;

        setScheduleHour(h);
        setScheduleMinute(m);
        setSchedulePeriod(p);

        setRescheduleModalOpen(true);
    };

    const closeRescheduleModal = () => {
        setRescheduleModalOpen(false);
        setSelectedPost(null);
    };

    const handleDelete = async () => {
        if (!selectedPost) return;

        try {
            setIsDeleting(true);
            const response = await deleteReq(`/linkedin/posts/${selectedPost.id}`);
            if (response?.success) {
                successToaster("Post deleted successfully");
                // Remove from local state
                setPosts(posts.filter(p => p.id !== selectedPost.id));
                closeDeleteModal();
            } else {
                errorToaster(response?.message || "Failed to delete post");
            }
        } catch (error) {
            console.error("Delete error:", error);
            errorToaster("Failed to delete post");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleReschedule = async () => {
        if (!selectedPost) return;

        try {
            setIsRescheduling(true);

            // Convert 12-hour to 24-hour format
            let h = parseInt(scheduleHour);
            if (schedulePeriod === "PM" && h !== 12) h += 12;
            if (schedulePeriod === "AM" && h === 12) h = 0;

            const timeString = `${h.toString().padStart(2, '0')}:${scheduleMinute.toString().padStart(2, '0')}`;
            const localDateTime = new Date(`${scheduleDate}T${timeString}`);

            // Validate future time
            if (localDateTime <= new Date()) {
                errorToaster("Scheduled time must be in the future");
                setIsRescheduling(false);
                return;
            }

            // Send as UTC ISO string for timezone consistency
            const utcDateTimeString = localDateTime.toISOString();

            // Check if this is a failed upload (temporary ID)
            if (selectedPost.id && typeof selectedPost.id === 'string' && selectedPost.id.startsWith('upload_')) {
                // Determine logic for RETRY vs RESCHEDULE
                // Since this modal sets a time, we treat it as scheduling a new post
                console.log('[MyPost] Retrying failed upload as new schedule:', selectedPost.id);

                if (!selectedPost.originalPostData) {
                    throw new Error("Missing original post data for retry");
                }

                const newPayload = {
                    ...selectedPost.originalPostData,
                    scheduled_at: utcDateTimeString,
                    type: 'schedule' // Ensure type is schedule
                };

                // token is needed for uploadManager - get from cookie
                const token = getCookieValue('superlio_token');

                if (!token) {
                    throw new Error("Authentication token not found");
                }

                // Start NEW upload
                startBackgroundUpload({
                    endpoint: '/linkedin/schedule',
                    payload: newPayload,
                    token: token,
                    postData: newPayload
                });

                // Remove the OLD failed upload from store to prevent duplicates
                // We need removeUpload from store
                const removeUpload = useUploadStore.getState().removeUpload;
                removeUpload(selectedPost.id);

                successToaster("Post retry started");
                closeRescheduleModal();
                // No need to setPosts, the new upload will appear automatically via store subscription

            } else {
                // Standard Reschedule for existing DB posts
                const response = await put(`/linkedin/posts/${selectedPost.id}/reschedule`, {
                    scheduled_at: utcDateTimeString
                });

                if (response?.success) {
                    successToaster("Post rescheduled successfully");

                    // Update local state with UTC string for consistent display
                    setPosts(posts.map(p => {
                        if (p.id === selectedPost.id) {
                            return {
                                ...p,
                                status: 'scheduled',
                                scheduled_at: utcDateTimeString
                            };
                        }
                        return p;
                    }));

                    closeRescheduleModal();
                } else {
                    errorToaster(response?.message || "Failed to reschedule post");
                }
            }
        } catch (error) {
            console.error("Reschedule error:", error);
            errorToaster("Failed to reschedule post");
        } finally {
            setIsRescheduling(false);
        }
    };

    const getStatus = (post) => {
        // Check for uploading status (from active uploads)
        if (post.status === 'uploading') {
            const progress = post.uploadProgress || 0;
            return `Uploading ${progress}%`;
        }
        if (post.status === 'published') return 'Published';
        if (post.status === 'scheduled') return 'Scheduled';
        if (post.status === 'processing') return 'Processing';
        if (post.status === 'failed') return 'Failed';
        return 'Draft';
    };

    const toggleSort = () => {
        setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    };

    // Pagination Logic
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, itemsPerPage, sortOrder, dateRange]);

    // Merge active uploads with fetched posts (uploads appear at top)
    const uploadsAsPost = Object.entries(activeUploads).map(([id, upload]) => ({
        id: id, // Temporary ID
        content: upload.postData?.content || 'Uploading post...',
        status: upload.status === 'failed' ? 'failed' : 'uploading',
        uploadProgress: upload.progress,
        media_type: upload.postData?.mediaType || (upload.postData?.type === 'carousel' ? 'application/pdf' : null),
        scheduled_at: upload.postData?.scheduled_at || null,
        created_at: new Date().toISOString(),
        isUploading: true,
        error_message: upload.error, // Pass error message
        originalPostData: upload.postData, // Keep full data for retry
    }));

    const allPosts = [...uploadsAsPost, ...posts];

    const filteredPosts = allPosts.filter((post) => {
        const status = getStatus(post);
        const matchesFilter = filter === "All" || status === filter;

        // Date Range Filter logic
        let matchesDate = true;
        if (dateRange.start) {
            const postDateStr = post.published_at || post.scheduled_at;
            if (postDateStr) {
                const postDate = new Date(postDateStr);
                const start = startOfDay(dateRange.start);
                const end = endOfDay(dateRange.end || dateRange.start); // Handle single day selection

                matchesDate = isWithinInterval(postDate, { start, end });
            } else {
                matchesDate = false; // No date to filter on
            }
        }

        return matchesFilter && matchesDate;
    }).sort((a, b) => {
        // Uploading and Processing posts should always appear at the top
        const aIsActive = a.isUploading || a.status === 'uploading' || a.status === 'processing';
        const bIsActive = b.isUploading || b.status === 'uploading' || b.status === 'processing';

        if (aIsActive && !bIsActive) return -1;
        if (!aIsActive && bIsActive) return 1;

        // For regular posts, sort by date
        const dateA = new Date(a.published_at || a.scheduled_at || a.created_at || 0);
        const dateB = new Date(b.published_at || b.scheduled_at || b.created_at || 0);

        if (sortOrder === 'asc') {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });

    // Pagination Logic
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, itemsPerPage, sortOrder]);

    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPosts = filteredPosts.length;
    // Calculate total pages properly
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleItemsPerPageChange = (val) => {
        setItemsPerPage(Number(val));
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        // Database stores dates in UTC - append 'Z' if not present to interpret as UTC
        let utcDateString = dateString;
        if (!dateString.endsWith('Z') && !dateString.includes('+')) {
            utcDateString = dateString.replace(' ', 'T') + 'Z';
        }
        const date = new Date(utcDateString);
        return (
            <div className="flex flex-col">
                <span className="font-medium">{format(date, "do MMM yyyy")}</span>
                <span className="text-xs text-gray-500">{format(date, "h:mm a")}</span>
            </div>
        );
    };

    const getFormattedDateTimeString = () => {
        if (!scheduleDate) return "";
        try {
            const d = new Date(scheduleDate);
            let h = parseInt(scheduleHour);
            if (schedulePeriod === "PM" && h !== 12) h += 12;
            if (schedulePeriod === "AM" && h === 12) h = 0;
            d.setHours(h);
            d.setMinutes(scheduleMinute);
            return `${format(d, "EEE, MMM d")}, ${scheduleHour}:${scheduleMinute.toString().padStart(2, '0')} ${schedulePeriod}`;
        } catch (e) {
            return "";
        }
    };

    // Render action buttons based on status
    const renderActions = (post) => {
        const status = getStatus(post);

        // No actions for uploading posts
        if (status.startsWith("Uploading")) {
            return <span className="text-gray-300">-</span>;
        }

        if (status === "Scheduled") {
            return (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => openRescheduleModal(post)}
                        className="text-gray-400 hover:text-blue-600 transition p-1"
                        title="Reschedule"
                    >
                        <FiClock className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => openDeleteModal(post)}
                        className="text-gray-400 hover:text-red-600 transition p-1"
                        title="Delete"
                    >
                        <FiTrash2 className="w-5 h-5" />
                    </button>
                </div>
            );
        }

        if (status === "Failed") {
            return (
                <div className="flex items-center justify-end">
                    <button
                        onClick={() => openRescheduleModal(post)}
                        className="text-gray-400 hover:text-orange-600 transition p-1"
                        title="Retry / Reschedule"
                    >
                        <FiRefreshCw className="w-5 h-5" />
                    </button>
                </div>
            );
        }

        // Published or Processing - no actions
        return <span className="text-gray-300">-</span>;
    };

    return (
        <div className="p-6 bg-[#F9FAFB] min-h-screen font-sans text-gray-800">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Posts</h1>
                </div>
            </div>

            {/* Tabs & Filter */}
            <div className="flex justify-between items-end border-b border-gray-200 mb-6">
                <div className="flex space-x-6">
                    {["All", "Scheduled", "Published"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`pb-2 px-1 text-sm font-medium transition-colors relative ${filter === tab
                                ? "text-gray-900 border-b-2 border-gray-900"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="mb-1 mr-8">
                    <DateRangeFilter onApply={setDateRange} />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2 border-r border-gray-200">
                                POST
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                STATUS
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition select-none group"
                                onClick={toggleSort}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>PUBLICATION</span>
                                    <div className="flex flex-col">
                                        <FiChevronUp className={`w-3 h-3 -mb-1 ${sortOrder === 'asc' ? 'text-gray-900' : 'text-gray-300'}`} />
                                        <FiChevronDown className={`w-3 h-3 ${sortOrder === 'desc' ? 'text-gray-900' : 'text-gray-300'}`} />
                                    </div>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                MEDIA
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ACTIONS
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPosts.length > 0 ? (
                            currentPosts.map((post) => {
                                const status = getStatus(post);
                                const firstLine = post.content ? post.content.split('\n')[0] : "";
                                return (
                                    <tr key={post.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 border-r border-gray-200">
                                            <div className="text-sm text-gray-900 font-medium">
                                                <ShowMoreText
                                                    lines={1}
                                                    more=""
                                                    less=""
                                                    className="w-full"
                                                    anchorClass="hidden"
                                                    expanded={false}
                                                    width={400}
                                                >
                                                    {firstLine}
                                                </ShowMoreText>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center border-r border-gray-200">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-500 ease-in-out ${status === "Published"
                                                    ? "bg-green-100 text-green-800"
                                                    : status === "Processing"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : status === "Failed"
                                                            ? "bg-red-100 text-red-800"
                                                            : status.startsWith("Uploading")
                                                                ? "bg-purple-100 text-purple-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                title={status === "Failed" ? post.error_message : undefined}
                                            >
                                                {status === "Published" && <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full"></span>}
                                                {status === "Scheduled" && <span className="w-2 h-2 mr-1.5 bg-yellow-500 rounded-full"></span>}
                                                {status === "Processing" && <span className="w-2 h-2 mr-1.5 bg-blue-500 rounded-full animate-pulse"></span>}
                                                {status === "Failed" && <span className="w-2 h-2 mr-1.5 bg-red-500 rounded-full"></span>}
                                                {status.startsWith("Uploading") && (
                                                    <svg className="animate-spin h-3 w-3 mr-1.5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                )}
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                                            {formatDate(post.published_at || post.scheduled_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center border-r border-gray-200">
                                            {post.media_type ? (
                                                <span className="inline-flex items-center justify-center w-28 px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white">
                                                    {post.media_type.includes('pdf') ? '📄 Carousel' : post.media_type.includes('video') ? '🎬 Video' : '🖼️ Image'}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {renderActions(post)}
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-2 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Loading posts...
                                        </div>
                                    ) : (
                                        "No posts found."
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {filteredPosts.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                        Posts <span className="font-medium">{indexOfFirstPost + 1}</span> to <span className="font-medium">{Math.min(indexOfLastPost, totalPosts)}</span> from a total of <span className="font-medium">{totalPosts}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Items Per Page Dropdown */}
                        <div className="relative inline-block text-left">
                            <div className="flex items-center space-x-2">
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => handleItemsPerPageChange(e.target.value)}
                                    className="block w-full pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md border shadow-sm cursor-pointer bg-white"
                                >
                                    <option value="10">10 posts</option>
                                    <option value="25">25 posts</option>
                                    <option value="50">50 posts</option>
                                    <option value="100">100 posts</option>
                                </select>
                            </div>
                        </div>

                        {/* Page Navigation */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <Overlay onClose={closeDeleteModal}>
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-xl rounded-xl w-[380px] font-sans text-gray-800">
                        <h2 className="text-xl font-bold mb-2 text-gray-900">Delete Scheduled Post</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Are you sure you want to delete this scheduled post? This action cannot be undone.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-3 mb-6 border border-gray-200">
                            <p className="text-sm text-gray-700 line-clamp-2">
                                {selectedPost?.content?.split('\n')[0] || "Post content"}
                            </p>
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                onClick={closeDeleteModal}
                                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-6 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition shadow-md flex items-center gap-2 disabled:opacity-50"
                            >
                                {isDeleting && (
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </Overlay>
            )}

            {/* Reschedule Modal */}
            {rescheduleModalOpen && (
                <Overlay onClose={closeRescheduleModal}>
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-xl rounded-xl w-[400px] font-sans text-gray-800">
                        <h2 className="text-xl font-bold mb-1 text-gray-900">
                            {getStatus(selectedPost) === "Failed" ? "Retry Post" : "Reschedule Post"}
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            {getFormattedDateTimeString()}, according to your timezone.
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                min={format(new Date(), "yyyy-MM-dd")}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-700"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                            <div className="flex gap-2">
                                {/* Hour Input */}
                                <div className="relative w-20">
                                    <input
                                        type="number"
                                        value={scheduleHour}
                                        onChange={(e) => {
                                            let val = parseInt(e.target.value);
                                            if (isNaN(val)) return;
                                            if (val > 12) val = 12;
                                            if (val < 1) val = 1;
                                            setScheduleHour(val);
                                        }}
                                        className="w-full p-2 pr-8 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-purple-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        min="1"
                                        max="12"
                                    />
                                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col justify-center bg-white pl-1">
                                        <button type="button" onClick={() => setScheduleHour(h => h >= 12 ? 1 : h + 1)} className="text-gray-500 hover:text-gray-700 leading-none text-[10px] mb-0.5">▲</button>
                                        <button type="button" onClick={() => setScheduleHour(h => h <= 1 ? 12 : h - 1)} className="text-gray-500 hover:text-gray-700 leading-none text-[10px]">▼</button>
                                    </div>
                                </div>

                                {/* Minute Input */}
                                <div className="relative w-20">
                                    <input
                                        type="number"
                                        value={scheduleMinute}
                                        onChange={(e) => {
                                            let val = parseInt(e.target.value);
                                            if (isNaN(val)) val = 0;
                                            if (val > 59) val = 59;
                                            if (val < 0) val = 0;
                                            setScheduleMinute(val);
                                        }}
                                        className="w-full p-2 pr-8 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-purple-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        min="0"
                                        max="59"
                                    />
                                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col justify-center bg-white pl-1">
                                        <button type="button" onClick={() => setScheduleMinute(m => m >= 59 ? 0 : m + 1)} className="text-gray-500 hover:text-gray-700 leading-none text-[10px] mb-0.5">▲</button>
                                        <button type="button" onClick={() => setScheduleMinute(m => m <= 0 ? 59 : m - 1)} className="text-gray-500 hover:text-gray-700 leading-none text-[10px]">▼</button>
                                    </div>
                                </div>

                                {/* AM/PM Select */}
                                <div className="relative w-20">
                                    <select
                                        value={schedulePeriod}
                                        onChange={(e) => setSchedulePeriod(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-purple-500 outline-none appearance-none bg-white"
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-500">
                                        ▼
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                onClick={closeRescheduleModal}
                                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReschedule}
                                disabled={isRescheduling}
                                className="px-6 py-2 bg-[#8B5CF6] text-white font-bold rounded-md hover:bg-[#7C3AED] transition shadow-md flex items-center gap-2 disabled:opacity-50"
                            >
                                {isRescheduling && (
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isRescheduling ? "Saving..." : (getStatus(selectedPost) === "Failed" ? "Retry" : "Reschedule")}
                            </button>
                        </div>
                    </div>
                </Overlay>
            )}
        </div>
    );
};

export default MyPost;
