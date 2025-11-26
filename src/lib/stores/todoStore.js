import { writable, get } from 'svelte/store';
import { getAllTodos, setAllTodos } from '../storage/localStorage.js';
import { syncManager } from '../storage/syncManager.js';
import { isOnline } from '../utils/offline.js';
import { notification } from './notificationStore.js';

/**
 * Debounce helper function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Create a persistent writable store that syncs with localStorage
 * @returns {Object} Svelte store with additional methods
 */
function createTodoStore() {
  // Initialize from localStorage, fallback to empty array
  const initialTodos = getAllTodos();

  // Create base writable store
  const { subscribe, set, update } = writable(initialTodos);

  // Debounced save function (300ms) with sync queueing
  const debouncedSave = debounce((todos, operation) => {
    const saveSuccess = setAllTodos(todos);

    // Show error notification if save failed
    if (!saveSuccess) {
      notification.show(
        'Failed to save changes locally. Storage may be full.',
        'error',
        5000
      );
      return;
    }

    // Queue operation for sync if provided
    if (operation) {
      syncManager.queueOperation(operation);

      // Trigger sync if online
      const online = get(isOnline);
      if (online) {
        syncManager.processQueue(true);
      }
    }
  }, 300);

  // Custom set that persists to localStorage
  const persistentSet = (value, operation = null) => {
    set(value);
    debouncedSave(value, operation);
  };

  // Custom update that persists to localStorage
  const persistentUpdate = (updater, operation = null) => {
    update((currentValue) => {
      const newValue = updater(currentValue);
      debouncedSave(newValue, operation);
      return newValue;
    });
  };

  return {
    subscribe,
    set: persistentSet,
    update: persistentUpdate,

    /**
     * Add a new todo
     * @param {string} text - Todo text
     */
    add: (text) => {
      let addedTodo;
      persistentUpdate((todos) => {
        const maxId = todos.reduce((max, todo) => Math.max(max, todo.id || 0), 0);
        addedTodo = {
          id: maxId + 1,
          text,
          completed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          version: 1
        };
        return [...todos, addedTodo];
      }, {
        type: 'add',
        data: { text },
        timestamp: Date.now()
      });
    },

    /**
     * Toggle todo completion status
     * @param {number} id - Todo ID
     */
    toggle: (id) => {
      persistentUpdate((todos) =>
        todos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                completed: !todo.completed,
                updatedAt: Date.now(),
                version: (todo.version || 0) + 1
              }
            : todo
        ), {
        type: 'toggle',
        data: { id },
        timestamp: Date.now()
      });
    },

    /**
     * Remove a todo
     * @param {number} id - Todo ID
     */
    remove: (id) => {
      persistentUpdate((todos) => todos.filter((todo) => todo.id !== id), {
        type: 'remove',
        data: { id },
        timestamp: Date.now()
      });
    },

    /**
     * Clear all todos
     */
    clear: () => {
      persistentSet([]);
    },

    /**
     * Update a todo
     * @param {number} id - Todo ID
     * @param {Object} updates - Fields to update
     */
    updateTodo: (id, updates) => {
      persistentUpdate((todos) =>
        todos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                ...updates,
                updatedAt: Date.now(),
                version: (todo.version || 0) + 1
              }
            : todo
        ), {
        type: 'update',
        data: { id, updates },
        timestamp: Date.now()
      });
    },

    /**
     * Force immediate save to localStorage (bypasses debounce)
     */
    forceSave: () => {
      let currentTodos;
      subscribe((value) => {
        currentTodos = value;
      })();
      setAllTodos(currentTodos);
    }
  };
}

// Export singleton instance
export const todoStore = createTodoStore();
