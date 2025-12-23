import { useEffect } from 'react';
import useUploadStore from '../../store/uploadStore';

/**
 * Global browser close/refresh warning when uploads are active.
 * This component should be placed at the App level.
 * 
 * Note: Allows in-app navigation freely - upload continues in background.
 * Only warns when user tries to close/refresh the browser tab.
 */
const GlobalUploadWarning = () => {
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const { activeUploads } = useUploadStore.getState();
            const hasActiveUploads = Object.keys(activeUploads).length > 0;

            if (hasActiveUploads) {
                // Modern browsers show a generic message, but this is still required
                event.preventDefault();
                event.returnValue = 'Upload in progress. Are you sure you want to leave?';
                return event.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        console.log('[GlobalUploadWarning] Registered beforeunload listener');

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            console.log('[GlobalUploadWarning] Removed beforeunload listener');
        };
    }, []);

    return null; // This component doesn't render anything
};

export default GlobalUploadWarning;
