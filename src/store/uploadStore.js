import { create } from "zustand";

/**
 * Upload Store - Tracks active uploads with progress
 * Used for background upload with instant navigation
 */
const useUploadStore = create((set, get) => ({
    // Active uploads: { tempId: { progress, status, postData, startTime } }
    activeUploads: {},

    // Add a new upload
    addUpload: (tempId, postData) => set((state) => ({
        activeUploads: {
            ...state.activeUploads,
            [tempId]: {
                progress: 0,
                status: 'uploading',
                postData,
                startTime: Date.now(),
            }
        }
    })),

    // Update upload progress (0-100)
    updateProgress: (tempId, progress) => set((state) => ({
        activeUploads: {
            ...state.activeUploads,
            [tempId]: {
                ...state.activeUploads[tempId],
                progress: Math.round(progress),
            }
        }
    })),

    // Complete upload successfully - remove from active uploads
    completeUpload: (tempId, postId, status = 'processing') => set((state) => {
        const { [tempId]: removed, ...remaining } = state.activeUploads;
        return {
            activeUploads: remaining,
            // Store completed upload info for MyPost to pick up
            lastCompletedUpload: { tempId, postId, status },
        };
    }),

    // Mark upload as failed
    failUpload: (tempId, error) => set((state) => ({
        activeUploads: {
            ...state.activeUploads,
            [tempId]: {
                ...state.activeUploads[tempId],
                status: 'failed',
                error,
            }
        }
    })),

    // Remove upload (on cancel or cleanup)
    removeUpload: (tempId) => set((state) => {
        const { [tempId]: removed, ...remaining } = state.activeUploads;
        return { activeUploads: remaining };
    }),

    // Check if any uploads are active
    hasActiveUploads: () => Object.keys(get().activeUploads).length > 0,

    // Get all uploads as array for display
    getUploadsArray: () => Object.entries(get().activeUploads).map(([id, data]) => ({
        id,
        ...data,
    })),

    // Last completed upload for MyPost to refresh
    lastCompletedUpload: null,
    clearLastCompleted: () => set({ lastCompletedUpload: null }),
}));

export default useUploadStore;
