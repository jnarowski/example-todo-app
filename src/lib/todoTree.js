/**
 * Get direct children of a todo item
 * @param {Array} todos - Array of all todos
 * @param {number|null} parentId - Parent ID to filter by
 * @returns {Array} Array of child todos
 */
export function getChildren(todos, parentId) {
  return todos.filter(todo => todo.parentId === parentId);
}

/**
 * Get all descendants of a todo item (recursive)
 * @param {Array} todos - Array of all todos
 * @param {number} parentId - Parent ID to start from
 * @returns {Array} Flattened array of all descendant todos
 */
export function getAllDescendants(todos, parentId) {
  const children = getChildren(todos, parentId);
  const descendants = [...children];

  children.forEach(child => {
    descendants.push(...getAllDescendants(todos, child.id));
  });

  return descendants;
}

/**
 * Calculate nesting depth of a todo item
 * @param {Array} todos - Array of all todos
 * @param {number} id - Todo ID to calculate depth for
 * @returns {number} Depth level (0 for root items)
 */
export function getDepth(todos, id) {
  const todo = todos.find(t => t.id === id);
  if (!todo || todo.parentId === null) {
    return 0;
  }
  return 1 + getDepth(todos, todo.parentId);
}

/**
 * Get subtask progress for a todo item
 * @param {Array} todos - Array of all todos
 * @param {number} id - Parent todo ID
 * @returns {Object} Object with {completed, total} counts
 */
export function getSubtaskProgress(todos, id) {
  const children = getChildren(todos, id);
  const completed = children.filter(child => child.completed).length;
  return {
    completed,
    total: children.length
  };
}

/**
 * Check if a todo has children
 * @param {Array} todos - Array of all todos
 * @param {number} id - Todo ID to check
 * @returns {boolean} True if todo has children
 */
export function hasChildren(todos, id) {
  return todos.some(todo => todo.parentId === id);
}

/**
 * Filter to get only root-level todos
 * @param {Array} todos - Array of all todos
 * @returns {Array} Array of root todos (parentId === null)
 */
export function filterRootTodos(todos) {
  return todos.filter(todo => todo.parentId === null);
}
