// Network connectivity monitoring utility

let connectionChangeCallbacks = [];
let isOnlineState = navigator.onLine;
let pollInterval = null;

/**
 * Check if currently online
 * @returns {boolean} Online status
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Subscribe to connection changes
 * @param {Function} callback - Called with boolean online status
 * @returns {Function} Unsubscribe function
 */
export function onConnectionChange(callback) {
  connectionChangeCallbacks.push(callback);

  // Return unsubscribe function
  return () => {
    connectionChangeCallbacks = connectionChangeCallbacks.filter(cb => cb !== callback);
  };
}

/**
 * Notify all subscribers of connection change
 * @param {boolean} online - New online status
 */
function notifySubscribers(online) {
  if (isOnlineState !== online) {
    isOnlineState = online;
    connectionChangeCallbacks.forEach(callback => {
      try {
        callback(online);
      } catch (error) {
        console.error('Error in connection change callback:', error);
      }
    });
  }
}

/**
 * Handle online event
 */
function handleOnline() {
  notifySubscribers(true);
}

/**
 * Handle offline event
 */
function handleOffline() {
  notifySubscribers(false);
}

/**
 * Polling fallback for Safari reliability
 * Checks connection status every 5 seconds
 */
function startPolling() {
  if (pollInterval) return;

  pollInterval = setInterval(() => {
    notifySubscribers(navigator.onLine);
  }, 5000);
}

/**
 * Stop polling
 */
function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

/**
 * Initialize connectivity monitoring
 * Sets up event listeners and Safari polling fallback
 */
export function init() {
  // Set initial state
  isOnlineState = navigator.onLine;

  // Listen to browser online/offline events
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Start polling fallback for Safari
  startPolling();
}

/**
 * Cleanup connectivity monitoring
 * Removes event listeners and stops polling
 */
export function cleanup() {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
  stopPolling();
  connectionChangeCallbacks = [];
}
