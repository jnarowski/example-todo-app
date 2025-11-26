// LocalStorage key for storing todos
export const STORAGE_KEY = 'svelte-todos';

/**
 * Load todos from localStorage
 * @returns {Array} Array of todo objects, or empty array if none exist or on error
 */
export function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null || stored === undefined) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to load todos from localStorage:', error);
    return [];
  }
}

/**
 * Save todos to localStorage
 * @param {Array} todos - Array of todo objects to save
 */
export function saveTodos(todos) {
  try {
    const serialized = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    // Handle quota exceeded or other localStorage errors
    console.warn('Failed to save todos to localStorage:', error);
  }
}
