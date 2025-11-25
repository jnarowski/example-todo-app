const STORAGE_KEY = 'todos-branch-mode';

/**
 * Save todos to localStorage
 * @param {Array} todos - Array of todos to save
 */
export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
}

/**
 * Load todos from localStorage
 * @returns {Array} Array of todos, or empty array if none found or error occurred
 */
export function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
}
