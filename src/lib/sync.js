/**
 * Sync utility with connection monitoring
 * Tracks online/offline status and manages sync operations
 */

import { writable } from 'svelte/store';

// Reactive store for connection status
export const isOnline = writable(navigator.onLine);

// Reactive store for last sync timestamp
export const lastSyncTime = writable(null);

// Reactive store for sync status
export const syncStatus = writable('idle'); // 'idle' | 'syncing' | 'synced' | 'error'

/**
 * Event handler for online event
 */
function handleOnline() {
  isOnline.set(true);
  console.log('Connection: Online');
}

/**
 * Event handler for offline event
 */
function handleOffline() {
  isOnline.set(false);
  syncStatus.set('idle');
  console.log('Connection: Offline');
}

/**
 * Initialize connection monitoring
 * Sets up event listeners for online/offline events
 */
export function initConnectionMonitor() {
  // Update store when going online
  window.addEventListener('online', handleOnline);

  // Update store when going offline
  window.addEventListener('offline', handleOffline);

  // Set initial state
  isOnline.set(navigator.onLine);
}

/**
 * Cleanup connection monitor
 * Removes event listeners
 */
export function cleanupConnectionMonitor() {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
}

// Debounce timer for auto-sync
let syncDebounceTimer = null;

/**
 * Sync todos to localStorage
 * In a local-first app, this is just a confirmation that data is persisted
 * Can be extended later to sync with a backend server
 * @param {Array} todos - Array of todo objects to sync
 * @returns {Promise<boolean>} True if sync succeeded
 */
export async function syncTodos(todos) {
  // Check if we're online (for future server sync)
  if (!navigator.onLine) {
    console.log('Sync: Offline, data persisted locally');
    return true;
  }

  syncStatus.set('syncing');

  try {
    // Simulate sync operation (in real app, this would call a server API)
    await new Promise(resolve => setTimeout(resolve, 100));

    // Update last sync time
    const now = new Date();
    lastSyncTime.set(now);
    syncStatus.set('synced');

    console.log('Sync: Success at', now.toLocaleTimeString());
    return true;
  } catch (error) {
    console.error('Sync: Failed', error);
    syncStatus.set('error');
    return false;
  }
}

/**
 * Auto-sync when coming back online
 * Debounced to prevent multiple rapid sync attempts
 * @param {Array} todos - Array of todo objects to sync
 */
export function autoSync(todos) {
  // Clear existing timer
  if (syncDebounceTimer) {
    clearTimeout(syncDebounceTimer);
  }

  // Debounce sync by 500ms
  syncDebounceTimer = setTimeout(() => {
    if (navigator.onLine) {
      syncTodos(todos);
    }
  }, 500);
}
