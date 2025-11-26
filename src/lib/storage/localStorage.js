/**
 * localStorage adapter with JSON serialization and error handling
 */

const STORAGE_KEY = 'todos';

/**
 * Check if localStorage is available and functional
 * @returns {boolean}
 */
export function isStorageAvailable() {
  try {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn('localStorage is not available:', e.message);
    return false;
  }
}

/**
 * Get item from localStorage with JSON parsing
 * @param {string} key - Storage key
 * @param {*} fallback - Fallback value if key doesn't exist or parse fails
 * @returns {*} Parsed value or fallback
 */
export function get(key, fallback = null) {
  if (!isStorageAvailable()) {
    console.warn('localStorage unavailable, using fallback value');
    return fallback;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null || item === 'undefined') {
      return fallback;
    }
    const parsed = JSON.parse(item);

    // Validate that todos is an array
    if (key === STORAGE_KEY && !Array.isArray(parsed)) {
      console.error('Invalid todos data in localStorage, using fallback');
      return fallback;
    }

    return parsed;
  } catch (e) {
    console.error(`Error reading from localStorage (${key}):`, e.message);
    // Clear corrupted data
    try {
      localStorage.removeItem(key);
    } catch (removeError) {
      console.error('Failed to remove corrupted data:', removeError);
    }
    return fallback;
  }
}

/**
 * Set item in localStorage with JSON serialization
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
export function set(key, value) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Unable to save data.');
    } else {
      console.error(`Error writing to localStorage (${key}):`, e);
    }
    return false;
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export function remove(key) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(`Error removing from localStorage (${key}):`, e);
    return false;
  }
}

/**
 * Clear all items from localStorage
 * @returns {boolean} Success status
 */
export function clear() {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (e) {
    console.error('Error clearing localStorage:', e);
    return false;
  }
}

/**
 * Get all todos from storage
 * @returns {Array} Array of todos
 */
export function getAllTodos() {
  return get(STORAGE_KEY, []);
}

/**
 * Set all todos in storage with metadata
 * @param {Array} todos - Array of todos
 * @returns {boolean} Success status
 */
export function setAllTodos(todos) {
  // Add timestamp and version metadata to each todo
  const todosWithMetadata = todos.map(todo => ({
    ...todo,
    updatedAt: todo.updatedAt || Date.now(),
    version: (todo.version || 0) + 1
  }));

  return set(STORAGE_KEY, todosWithMetadata);
}

/**
 * Add a single todo to storage
 * @param {Object} todo - Todo object
 * @returns {boolean} Success status
 */
export function addTodo(todo) {
  const todos = getAllTodos();
  const newTodo = {
    ...todo,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  };
  todos.push(newTodo);
  return set(STORAGE_KEY, todos);
}

/**
 * Update a todo in storage
 * @param {number} id - Todo ID
 * @param {Object} updates - Fields to update
 * @returns {boolean} Success status
 */
export function updateTodo(id, updates) {
  const todos = getAllTodos();
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return false;
  }

  todos[index] = {
    ...todos[index],
    ...updates,
    updatedAt: Date.now(),
    version: (todos[index].version || 0) + 1
  };

  return set(STORAGE_KEY, todos);
}

/**
 * Remove a todo from storage
 * @param {number} id - Todo ID
 * @returns {boolean} Success status
 */
export function removeTodo(id) {
  const todos = getAllTodos();
  const filtered = todos.filter(t => t.id !== id);

  if (filtered.length === todos.length) {
    return false; // Todo not found
  }

  return set(STORAGE_KEY, filtered);
}

/**
 * Clear all todos from storage
 * @returns {boolean} Success status
 */
export function clearAllTodos() {
  return set(STORAGE_KEY, []);
}
