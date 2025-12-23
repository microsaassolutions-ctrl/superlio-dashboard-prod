/**
 * Upload Manager - Background upload with progress tracking
 * Uses XMLHttpRequest for upload progress (axios doesn't support it well)
 */

import useUploadStore from '../store/uploadStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.superlio.ai';

/**
 * Upload payload to API with progress tracking
 * @param {string} endpoint - API endpoint (e.g., '/linkedin/publish')
 * @param {object} payload - Request payload
 * @param {string} tempId - Temporary ID for tracking this upload
 * @param {string} token - Auth token
 * @returns {Promise} - Resolves with response data or rejects with error
 */
export const uploadWithProgress = (endpoint, payload, tempId, token) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const { updateProgress, completeUpload, failUpload } = useUploadStore.getState();

        // Track upload progress
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100;
                updateProgress(tempId, progress);
            }
        };

        // Handle completion
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        // Determine status based on endpoint
                        const isSchedule = endpoint.includes('schedule');
                        completeUpload(tempId, response.postId, isSchedule ? 'scheduled' : 'processing');
                        resolve(response);
                    } else {
                        failUpload(tempId, response.message || 'Upload failed');
                        reject(new Error(response.message || 'Upload failed'));
                    }
                } catch (e) {
                    failUpload(tempId, 'Invalid response');
                    reject(new Error('Invalid response from server'));
                }
            } else {
                let errorMessage = 'Upload failed';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {
                    // Use default message
                }
                failUpload(tempId, errorMessage);
                reject(new Error(errorMessage));
            }
        };

        // Handle network errors
        xhr.onerror = () => {
            failUpload(tempId, 'Network error');
            reject(new Error('Network error - please check your connection'));
        };

        // Handle timeout
        xhr.ontimeout = () => {
            failUpload(tempId, 'Upload timed out');
            reject(new Error('Upload timed out'));
        };

        // Configure request
        xhr.open('POST', `${API_BASE_URL}${endpoint}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.timeout = 5 * 60 * 1000; // 5 minute timeout

        // Send request
        xhr.send(JSON.stringify(payload));
    });
};

/**
 * Start background upload with instant navigation
 * @param {object} options
 * @param {string} options.endpoint - API endpoint
 * @param {object} options.payload - Request payload
 * @param {string} options.token - Auth token
 * @param {object} options.postData - Post data for display in My Posts
 * @returns {string} - Temporary ID for tracking
 */
export const startBackgroundUpload = ({ endpoint, payload, token, postData }) => {
    const { addUpload } = useUploadStore.getState();

    // Generate temporary ID
    const tempId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Add to upload store
    addUpload(tempId, postData);

    // Start upload in background (fire and forget)
    uploadWithProgress(endpoint, payload, tempId, token)
        .then((response) => {
            console.log('[Upload] Completed:', tempId, response);
        })
        .catch((error) => {
            console.error('[Upload] Failed:', tempId, error.message);
        });

    return tempId;
};

/**
 * Add beforeunload warning if uploads are active
 */
export const setupUploadWarning = () => {
    const handleBeforeUnload = (event) => {
        const { hasActiveUploads } = useUploadStore.getState();
        if (hasActiveUploads()) {
            const message = 'You have an upload in progress. Are you sure you want to leave?';
            event.preventDefault();
            event.returnValue = message;
            return message;
        }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Return cleanup function
    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
};
