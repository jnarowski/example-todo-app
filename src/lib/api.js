const API_BASE_URL = '/api';

/**
 * Fetch all todos from the API
 */
export async function fetchTodos() {
  const response = await fetch(`${API_BASE_URL}/todos`);
  if (!response.ok) {
    throw new Error(`Failed to fetch todos: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Create a new todo
 * @param {string} text - The todo text
 */
export async function createTodo(text) {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || 'Failed to create todo');
  }
  return await response.json();
}

/**
 * Update a todo
 * @param {number} id - The todo ID
 * @param {Object} data - The data to update (text and/or completed)
 */
export async function updateTodo(id, data) {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || 'Failed to update todo');
  }
  return await response.json();
}

/**
 * Delete a todo
 * @param {number} id - The todo ID
 */
export async function deleteTodo(id) {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || 'Failed to delete todo');
  }
}
