import { get } from 'svelte/store';
import { syncStore } from '../stores/syncStore.js';
import { todoStore } from '../stores/todoStore.js';
import * as connectivity from '../utils/connectivity.js';
import * as storage from './storage.js';

// Configuration
const SYNC_TIMEOUT = 10000; // 10 seconds
const MAX_RETRY_ATTEMPTS = 3;
const BASE_RETRY_DELAY = 1000; // 1 second

let retryCount = 0;
let syncTimeoutId = null;

/**
 * Generate unique operation ID
 * @returns {string} Unique ID
 */
function generateOpId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Queue an operation when offline
 * @param {string} type - Operation type ('add', 'toggle', 'delete')
 * @param {Object} payload - Operation data
 */
export function queueOperation(type, payload) {
  const operation = {
    id: generateOpId(),
    type,
    payload,
    timestamp: new Date().toISOString()
  };

  syncStore.addPendingOp(operation);
}

/**
 * Replay pending operations with the server
 * @param {Array} operations - Pending operations to replay
 * @returns {Promise<void>}
 */
async function replayOperations(operations) {
  // In a real app, this would send operations to a server
  // For this demo, we'll just apply them locally and simulate success

  // Filter out operations that should be skipped
  // (e.g., if an item was deleted both locally and remotely)
  const validOps = operations.filter(op => {
    if (op.type === 'delete') {
      // Check if item still exists locally
      const localState = storage.load();
      const exists = localState.todos.some(todo => todo.id === op.payload.id);
      if (!exists) {
        console.log(`Skipping delete operation for already deleted item: ${op.payload.id}`);
        return false;
      }
    }
    return true;
  });

  for (const op of validOps) {
    console.log(`Replaying operation: ${op.type}`, op.payload);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Operations are already applied locally, so we just log them
    // In a real app, you would:
    // await fetch('/api/todos/sync', { method: 'POST', body: JSON.stringify(op) });
  }
}

/**
 * Fetch server state for conflict resolution
 * @returns {Promise<Object>} Server state
 */
async function fetchServerState() {
  // In a real app, this would fetch from the server
  // For this demo, we'll return the current local state

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // In a real app:
  // const response = await fetch('/api/todos');
  // return response.json();

  return storage.load();
}

/**
 * Resolve conflicts using last-write-wins strategy
 *
 * CONFLICT RESOLUTION ALGORITHM:
 * 1. Compare the lastModified timestamps of local and server states
 * 2. The state with the newer (more recent) timestamp wins
 * 3. If timestamps are equal, keep local state (no conflict)
 *
 * This simple strategy works well for single-user todo apps where:
 * - Users typically work from one device at a time
 * - Most conflicts are caused by offline edits that need to sync
 * - The most recent change is usually what the user wants
 *
 * Limitations:
 * - Does not perform item-level merging (entire state is replaced)
 * - May lose changes if clock skew exists between devices
 * - Not suitable for collaborative editing scenarios
 *
 * Future improvements could include:
 * - Per-item timestamps for granular conflict resolution
 * - Operation-based conflict resolution (CRDT-style)
 * - User-prompted conflict resolution UI
 *
 * @param {Object} localState - Local state with lastModified
 * @param {Object} serverState - Server state with lastModified
 * @returns {Object} Resolved state
 */
function resolveConflicts(localState, serverState) {
  const localTime = new Date(localState.lastModified).getTime();
  const serverTime = new Date(serverState.lastModified).getTime();

  console.log('Resolving conflicts:', {
    local: localState.lastModified,
    server: serverState.lastModified
  });

  // Last-write-wins: use the state with the newer timestamp
  if (localTime > serverTime) {
    console.log('Local state is newer, keeping local changes');
    return localState;
  } else if (serverTime > localTime) {
    console.log('Server state is newer, using server changes');
    return serverState;
  } else {
    console.log('Timestamps equal, no conflict');
    return localState;
  }
}

/**
 * Perform sync operation with timeout
 * @returns {Promise<void>}
 */
async function performSync() {
  const state = get(syncStore);

  if (!state.isOnline) {
    console.log('Cannot sync: offline');
    return;
  }

  if (state.isSyncing) {
    console.log('Sync already in progress');
    return;
  }

  console.log('Starting sync...');
  syncStore.startSync();

  // Set sync timeout
  const timeoutPromise = new Promise((_, reject) => {
    syncTimeoutId = setTimeout(() => {
      reject(new Error('Sync timeout'));
    }, SYNC_TIMEOUT);
  });

  try {
    // Race between sync operations and timeout
    await Promise.race([
      (async () => {
        // Get pending operations
        const { pendingOps } = get(syncStore);

        if (pendingOps.length > 0) {
          console.log(`Replaying ${pendingOps.length} pending operations`);
          await replayOperations(pendingOps);
          syncStore.clearPendingOps();
        }

        // Fetch server state for conflict resolution
        const localState = storage.load();
        const serverState = await fetchServerState();

        // Resolve conflicts
        const resolvedState = resolveConflicts(localState, serverState);

        // Update local state if server had newer changes
        if (resolvedState !== localState) {
          todoStore.reload();
        }

        // Clear timeout
        clearTimeout(syncTimeoutId);
        syncTimeoutId = null;

        // Mark sync as complete
        syncStore.endSync();
        retryCount = 0;

        console.log('Sync completed successfully');
      })(),
      timeoutPromise
    ]);

  } catch (error) {
    console.error('Sync failed:', error);

    clearTimeout(syncTimeoutId);
    syncTimeoutId = null;

    syncStore.setSyncError(error);

    // Retry with exponential backoff
    if (retryCount < MAX_RETRY_ATTEMPTS && state.isOnline) {
      retryCount++;
      const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount - 1);

      console.log(`Retrying sync in ${delay}ms (attempt ${retryCount}/${MAX_RETRY_ATTEMPTS})`);

      setTimeout(() => {
        performSync();
      }, delay);
    } else {
      console.error('Max retry attempts reached or offline');
      retryCount = 0;
    }
  }
}

/**
 * Initialize the sync service
 * Sets up connectivity monitoring and auto-sync
 */
export function init() {
  console.log('Initializing sync service');

  // Subscribe to connection changes
  connectivity.onConnectionChange((online) => {
    console.log(`Connection changed: ${online ? 'online' : 'offline'}`);

    if (online) {
      // Auto-sync when coming back online
      console.log('Back online, triggering sync');
      setTimeout(() => performSync(), 500);
    }
  });

  // Initial sync if online
  if (connectivity.isOnline()) {
    setTimeout(() => performSync(), 1000);
  }
}

/**
 * Manually trigger a sync
 * @returns {Promise<void>}
 */
export async function triggerSync() {
  console.log('Manual sync triggered');
  return performSync();
}

/**
 * Check if we should queue operations (offline mode)
 * @returns {boolean}
 */
export function shouldQueueOperations() {
  return !connectivity.isOnline();
}
