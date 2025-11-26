import { notification } from '../stores/notificationStore.js';

/**
 * Sync manager for coordinating offline changes with backend
 * Handles sync queue, retry logic, and conflict resolution
 */

class SyncManager {
  constructor() {
    this.syncQueue = [];
    this.isSyncing = false;
    this.maxRetries = 3;
    this.baseBackoff = 1000; // 1 second
    this.syncCallbacks = [];
  }

  /**
   * Add an operation to the sync queue
   * @param {Object} operation - Operation to queue
   */
  queueOperation(operation) {
    this.syncQueue.push({
      ...operation,
      timestamp: Date.now(),
      retries: 0
    });
  }

  /**
   * Subscribe to sync status changes
   * @param {Function} callback - Callback function(status)
   */
  onSyncStatusChange(callback) {
    this.syncCallbacks.push(callback);
  }

  /**
   * Notify all subscribers of sync status change
   * @param {string} status - Status: 'syncing', 'synced', 'error', 'idle'
   * @param {Object} data - Additional data
   */
  notifySyncStatus(status, data = {}) {
    this.syncCallbacks.forEach(callback => {
      try {
        callback(status, data);
      } catch (e) {
        console.error('Error in sync status callback:', e);
      }
    });
  }

  /**
   * Process the sync queue
   * @param {boolean} isOnline - Current online status
   */
  async processQueue(isOnline) {
    // Don't process if offline or already syncing
    if (!isOnline || this.isSyncing || this.syncQueue.length === 0) {
      return;
    }

    this.isSyncing = true;
    this.notifySyncStatus('syncing', { queueSize: this.syncQueue.length });

    const operations = [...this.syncQueue];
    const failedOperations = [];

    for (const operation of operations) {
      try {
        // In a real implementation, this would make API calls
        // For now, we'll simulate success
        await this.syncOperation(operation);

        // Remove from queue on success
        const index = this.syncQueue.findIndex(op => op.timestamp === operation.timestamp);
        if (index !== -1) {
          this.syncQueue.splice(index, 1);
        }
      } catch (error) {
        console.error('Sync operation failed:', error);

        // Retry logic with exponential backoff
        operation.retries++;

        if (operation.retries < this.maxRetries) {
          const backoffTime = this.baseBackoff * Math.pow(2, operation.retries);
          console.log(`Retrying operation in ${backoffTime}ms (attempt ${operation.retries + 1}/${this.maxRetries})`);

          // Schedule retry
          setTimeout(() => {
            this.processQueue(isOnline);
          }, backoffTime);

          failedOperations.push(operation);
        } else {
          // Max retries exceeded, remove from queue
          console.error('Max retries exceeded for operation:', operation);
          const index = this.syncQueue.findIndex(op => op.timestamp === operation.timestamp);
          if (index !== -1) {
            this.syncQueue.splice(index, 1);
          }

          this.notifySyncStatus('error', {
            message: 'Sync failed after max retries',
            operation
          });

          // Show user notification
          notification.show('Failed to sync changes. Some data may not be saved.', 'error', 5000);
        }
      }
    }

    this.isSyncing = false;

    if (this.syncQueue.length === 0) {
      this.notifySyncStatus('synced');
    } else {
      this.notifySyncStatus('idle', { queueSize: this.syncQueue.length });
    }
  }

  /**
   * Sync a single operation (stub for backend integration)
   * @param {Object} operation - Operation to sync
   */
  async syncOperation(operation) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // In a real implementation, this would:
    // 1. Make API call with operation.type and operation.data
    // 2. Handle response and conflicts
    // 3. Return result

    // For now, just log and succeed
    console.log('Syncing operation:', operation);

    return { success: true };
  }

  /**
   * Resolve conflicts using last-write-wins strategy
   * @param {Object} local - Local version
   * @param {Object} remote - Remote version
   * @returns {Object} Resolved version
   */
  resolveConflict(local, remote) {
    // Last-write-wins based on timestamp
    if (!local.updatedAt || !remote.updatedAt) {
      return local.version > remote.version ? local : remote;
    }

    return local.updatedAt > remote.updatedAt ? local : remote;
  }

  /**
   * Merge local and remote todos
   * @param {Array} localTodos - Local todos
   * @param {Array} remoteTodos - Remote todos
   * @returns {Array} Merged todos
   */
  mergeTodos(localTodos, remoteTodos) {
    const merged = new Map();

    // Add all remote todos
    remoteTodos.forEach(todo => {
      merged.set(todo.id, todo);
    });

    // Merge in local todos, resolving conflicts
    localTodos.forEach(localTodo => {
      if (merged.has(localTodo.id)) {
        const remoteTodo = merged.get(localTodo.id);
        merged.set(localTodo.id, this.resolveConflict(localTodo, remoteTodo));
      } else {
        merged.set(localTodo.id, localTodo);
      }
    });

    return Array.from(merged.values()).sort((a, b) => a.id - b.id);
  }

  /**
   * Clear the sync queue
   */
  clearQueue() {
    this.syncQueue = [];
    this.notifySyncStatus('idle');
  }

  /**
   * Get current sync status
   * @returns {Object} Status information
   */
  getStatus() {
    return {
      isSyncing: this.isSyncing,
      queueSize: this.syncQueue.length,
      hasErrors: this.syncQueue.some(op => op.retries >= this.maxRetries)
    };
  }
}

// Export singleton instance
export const syncManager = new SyncManager();
