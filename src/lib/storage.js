/**
 * LocalStorage abstraction for todo app
 * Handles serialization, deserialization, and error handling
 */

const STORAGE_KEY = 'todos';
const NEXT_ID_KEY = 'nextTodoId';

/**
 * Load todos from localStorage
 * @returns {Array} Array of todo objects, or empty array if none exist
 */
export function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
}

/**
 * Save todos to localStorage
 * @param {Array} todos - Array of todo objects to save
 * @returns {boolean} True if save succeeded, false otherwise
 */
export function saveTodos(todos) {
  try {
    const serialized = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    // Handle quota exceeded or other localStorage errors
    if (error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded. Unable to save todos.');
      alert('Storage quota exceeded. Please delete some todos.');
    } else {
      console.error('Failed to save todos to localStorage:', error);
    }
    return false;
  }
}

/**
 * Clear all todos from localStorage
 */
export function clearTodos() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NEXT_ID_KEY);
  } catch (error) {
    console.error('Failed to clear todos from localStorage:', error);
  }
}

/**
 * Load next ID from localStorage
 * @returns {number} The next available ID, defaults to 1
 */
export function loadNextId() {
  try {
    const stored = localStorage.getItem(NEXT_ID_KEY);
    if (!stored) {
      return 1;
    }

    const parsed = parseInt(stored, 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  } catch (error) {
    console.error('Failed to load nextId from localStorage:', error);
    return 1;
  }
}

/**
 * Save next ID to localStorage
 * @param {number} nextId - The next ID to save
 * @returns {boolean} True if save succeeded, false otherwise
 */
export function saveNextId(nextId) {
  try {
    localStorage.setItem(NEXT_ID_KEY, nextId.toString());
    return true;
  } catch (error) {
    console.error('Failed to save nextId to localStorage:', error);
    return false;
  }
}
