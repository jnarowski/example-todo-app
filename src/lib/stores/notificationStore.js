import { writable } from 'svelte/store';

/**
 * Create a notification store for user feedback
 */
function createNotificationStore() {
  const { subscribe, set } = writable(null);

  let timeoutId = null;

  return {
    subscribe,

    /**
     * Show a notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type: 'info', 'success', 'warning', 'error'
     * @param {number} duration - Duration in ms (0 = no auto-dismiss)
     */
    show: (message, type = 'info', duration = 3000) => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      set({ message, type });

      // Auto-dismiss after duration
      if (duration > 0) {
        timeoutId = setTimeout(() => {
          set(null);
        }, duration);
      }
    },

    /**
     * Clear the notification
     */
    clear: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      set(null);
    }
  };
}

export const notification = createNotificationStore();
