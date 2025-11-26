import { writable, derived } from 'svelte/store';
import * as connectivity from '../utils/connectivity.js';

/**
 * Create the sync state store
 */
function createSyncStore() {
  const initialState = {
    isOnline: connectivity.isOnline(),
    isSyncing: false,
    lastSyncTime: null,
    pendingOps: [],
    syncError: null
  };

  const { subscribe, set, update } = writable(initialState);

  // Initialize connectivity monitoring
  connectivity.init();

  // Subscribe to connection changes
  connectivity.onConnectionChange((online) => {
    update(state => ({
      ...state,
      isOnline: online,
      syncError: online ? null : state.syncError
    }));
  });

  return {
    subscribe,

    /**
     * Set online status
     * @param {boolean} online - Online status
     */
    setOnlineStatus: (online) => {
      update(state => ({
        ...state,
        isOnline: online
      }));
    },

    /**
     * Start sync operation
     */
    startSync: () => {
      update(state => ({
        ...state,
        isSyncing: true,
        syncError: null
      }));
    },

    /**
     * End sync operation successfully
     */
    endSync: () => {
      update(state => ({
        ...state,
        isSyncing: false,
        lastSyncTime: new Date().toISOString(),
        syncError: null
      }));
    },

    /**
     * Add a pending operation to the queue
     * @param {Object} operation - Operation to queue
     */
    addPendingOp: (operation) => {
      update(state => ({
        ...state,
        pendingOps: [...state.pendingOps, operation]
      }));
    },

    /**
     * Clear all pending operations
     */
    clearPendingOps: () => {
      update(state => ({
        ...state,
        pendingOps: []
      }));
    },

    /**
     * Set sync error
     * @param {string|Error} error - Error message or object
     */
    setSyncError: (error) => {
      update(state => ({
        ...state,
        isSyncing: false,
        syncError: error instanceof Error ? error.message : error
      }));
    },

    /**
     * Reset sync state
     */
    reset: () => {
      set({
        ...initialState,
        isOnline: connectivity.isOnline()
      });
    }
  };
}

// Export the store instance
export const syncStore = createSyncStore();

// Export derived stores for common checks
export const isOffline = derived(
  syncStore,
  $syncStore => !$syncStore.isOnline
);

export const hasPendingOps = derived(
  syncStore,
  $syncStore => $syncStore.pendingOps.length > 0
);

export const canSync = derived(
  syncStore,
  $syncStore => $syncStore.isOnline && !$syncStore.isSyncing
);
