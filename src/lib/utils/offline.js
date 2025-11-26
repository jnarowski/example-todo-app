import { writable } from 'svelte/store';
import { syncManager } from '../storage/syncManager.js';

/**
 * Create reactive online status store
 * Monitors navigator.onLine and network events
 */
function createOnlineStore() {
  // Initialize with current online status
  const { subscribe, set } = writable(navigator.onLine);

  // Update online status
  const updateStatus = () => {
    const isOnline = navigator.onLine;
    set(isOnline);

    // Trigger sync when coming back online
    if (isOnline) {
      console.log('Network connection restored, triggering sync...');
      syncManager.processQueue(true);
    }
  };

  // Listen to online/offline events
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);

  return {
    subscribe,
    // Clean up event listeners when store is destroyed
    destroy: () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    }
  };
}

// Export singleton instance
export const isOnline = createOnlineStore();

/**
 * Sync status store for UI feedback
 * Values: 'idle', 'syncing', 'synced', 'error'
 */
function createSyncStatusStore() {
  const { subscribe, set } = writable('idle');

  // Subscribe to sync manager status changes
  syncManager.onSyncStatusChange((status, data) => {
    set(status);

    // Auto-clear 'synced' status after 3 seconds
    if (status === 'synced') {
      setTimeout(() => {
        set('idle');
      }, 3000);
    }
  });

  return { subscribe };
}

export const syncStatus = createSyncStatusStore();
