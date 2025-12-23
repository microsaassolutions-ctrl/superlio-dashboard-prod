/**
 * Debug Logger - Controlled by API config
 * 
 * This fetches DEBUG_MODE from the API and only logs when enabled.
 * Toggle DEBUG_MODE in config/limits.json on the API server.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.superlio.ai';

let debugMode = false;
let initialized = false;

// Fetch debug mode from API config
const initDebugMode = async () => {
    if (initialized) return;

    try {
        const response = await fetch(`${API_BASE_URL}/config/debug`);
        if (response.ok) {
            const data = await response.json();
            debugMode = data.debugMode === true;
        }
    } catch (error) {
        // Default to false if can't fetch
        debugMode = false;
    }
    initialized = true;
};

// Initialize on load
initDebugMode();

/**
 * Debug logger - only logs when DEBUG_MODE is true in API config
 */
export const debug = {
    log: (...args) => {
        if (debugMode) console.log(...args);
    },
    warn: (...args) => {
        if (debugMode) console.warn(...args);
    },
    error: (...args) => {
        // Always show errors
        console.error(...args);
    },
    info: (...args) => {
        if (debugMode) console.info(...args);
    },
    time: (label) => {
        if (debugMode) console.time(label);
    },
    timeEnd: (label) => {
        if (debugMode) console.timeEnd(label);
    }
};

export default debug;
