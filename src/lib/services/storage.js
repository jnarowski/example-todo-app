// localStorage wrapper with versioning and error handling
const STORAGE_KEY = 'todo-app-data';
const CURRENT_VERSION = 1;

let saveTimer = null;

/**
 * Default empty state with schema version
 */
function getDefaultState() {
  return {
    version: CURRENT_VERSION,
    todos: [],
    nextId: 1,
    lastModified: new Date().toISOString()
  };
}

/**
 * Migrate older schema versions to current version
 */
function migrate(data) {
  if (!data.version) {
    // Legacy data without version - wrap it
    return {
      version: CURRENT_VERSION,
      todos: data.todos || [],
      nextId: data.nextId || 1,
      lastModified: new Date().toISOString()
    };
  }

  // Future migrations would go here
  // if (data.version === 1) { ... migrate to v2 ... }

  return data;
}

/**
 * Load data from localStorage
 * @returns {Object} Parsed and migrated state or default state on error
 */
export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getDefaultState();
    }

    const data = JSON.parse(raw);
    return migrate(data);
  } catch (error) {
    console.error('Failed to load from localStorage, using default state:', error);
    return getDefaultState();
  }
}

/**
 * Save data to localStorage with debouncing (300ms)
 * @param {Object} data - State to save
 */
export function save(data) {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(() => {
    try {
      const stateToSave = {
        ...data,
        version: CURRENT_VERSION,
        lastModified: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Cannot save todos.');
        // Try to clear old data and retry once
        try {
          const currentData = load();
          // Keep only the 100 most recent todos
          if (currentData.todos.length > 100) {
            currentData.todos = currentData.todos.slice(-100);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
            console.log('Cleared old todos to free up space');
          }
        } catch (retryError) {
          console.error('Failed to recover from quota exceeded error:', retryError);
        }
      } else {
        console.error('Failed to save to localStorage:', error);
        // If data is corrupted, attempt to reset
        if (error instanceof SyntaxError) {
          console.warn('Detected corrupted data, resetting to default state');
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, 300);
}

/**
 * Clear all data from localStorage
 */
export function clear() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Get the storage key (useful for debugging)
 */
export function getStorageKey() {
  return STORAGE_KEY;
}
