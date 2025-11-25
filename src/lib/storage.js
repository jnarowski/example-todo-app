// Storage key for namespacing
const STORAGE_KEY = 'todo-app:todos';

/**
 * Check if localStorage is available
 * Some browsers block localStorage in private mode
 * @returns {boolean}
 */
export function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn('localStorage is not available:', e);
    return false;
  }
}

/**
 * Save todos and nextId to localStorage
 * @param {Array} todos - Array of todo objects
 * @param {number} nextId - Next ID counter
 */
export function saveTodos(todos, nextId) {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    const data = {
      todos,
      nextId
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Handle quota exceeded or other storage errors
    console.error('Failed to save todos to localStorage:', e);
  }
}

/**
 * Load todos and nextId from localStorage
 * @returns {{ todos: Array, nextId: number }}
 */
export function loadTodos() {
  if (!isStorageAvailable()) {
    return { todos: [], nextId: 1 };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      // No data stored yet
      return { todos: [], nextId: 1 };
    }

    // Parse JSON and handle corrupted data
    const data = JSON.parse(stored);

    // Validate data structure
    if (!data || typeof data !== 'object') {
      console.warn('Invalid data structure in localStorage, returning defaults');
      return { todos: [], nextId: 1 };
    }

    return {
      todos: Array.isArray(data.todos) ? data.todos : [],
      nextId: typeof data.nextId === 'number' ? data.nextId : 1
    };
  } catch (e) {
    // Handle JSON parse errors or other issues
    console.error('Failed to load todos from localStorage:', e);
    return { todos: [], nextId: 1 };
  }
}
