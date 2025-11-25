<script>
  import { onMount } from 'svelte';
  import { fetchTodos, createTodo, updateTodo, deleteTodo as deleteTodoAPI } from './lib/api.js';

  let todos = [];
  let newTodo = '';
  let isLoading = false;
  let error = null;
  let successMessage = null;

  // Load todos on component mount
  onMount(async () => {
    await loadTodos();
  });

  async function loadTodos() {
    isLoading = true;
    error = null;
    try {
      todos = await fetchTodos();
    } catch (err) {
      error = `Failed to load todos: ${err.message}`;
      console.error('Error loading todos:', err);
    } finally {
      isLoading = false;
    }
  }

  async function addTodo() {
    if (!newTodo.trim()) {
      return;
    }

    const text = newTodo.trim();
    newTodo = '';
    isLoading = true;
    error = null;

    try {
      const todo = await createTodo(text);
      todos = [todo, ...todos];
      showSuccess('Todo added successfully');
    } catch (err) {
      error = `Failed to add todo: ${err.message}`;
      console.error('Error adding todo:', err);
      newTodo = text; // Restore input on error
    } finally {
      isLoading = false;
    }
  }

  async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    // Optimistic update
    todos = todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );

    try {
      await updateTodo(id, { completed: !todo.completed });
    } catch (err) {
      error = `Failed to update todo: ${err.message}`;
      console.error('Error updating todo:', err);
      // Revert optimistic update
      todos = todos.map(t =>
        t.id === id ? { ...t, completed: todo.completed } : t
      );
    }
  }

  async function handleDeleteTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    // Optimistic update
    todos = todos.filter(t => t.id !== id);

    try {
      await deleteTodoAPI(id);
      showSuccess('Todo deleted successfully');
    } catch (err) {
      error = `Failed to delete todo: ${err.message}`;
      console.error('Error deleting todo:', err);
      // Revert optimistic update
      todos = [...todos, todo].sort((a, b) => b.id - a.id);
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' && !isLoading) {
      addTodo();
    }
  }

  function showSuccess(message) {
    successMessage = message;
    setTimeout(() => {
      successMessage = null;
    }, 3000);
  }

  function dismissError() {
    error = null;
  }

  async function retryLoad() {
    await loadTodos();
  }

  $: activeTodos = todos.filter(todo => !todo.completed).length;
  $: completedTodos = todos.filter(todo => todo.completed).length;
</script>

<div class="todo-app">
  <div class="container">
    <h1>Todo App</h1>

    {#if error}
      <div class="notification error">
        <span>{error}</span>
        <div class="notification-actions">
          <button on:click={retryLoad} class="retry-button">Retry</button>
          <button on:click={dismissError} class="dismiss-button">×</button>
        </div>
      </div>
    {/if}

    {#if successMessage}
      <div class="notification success">
        <span>{successMessage}</span>
      </div>
    {/if}

    <div class="stats">
      <span class="stat">Active: {activeTodos}</span>
      <span class="stat">Completed: {completedTodos}</span>
    </div>

    <div class="input-section">
      <input
        type="text"
        bind:value={newTodo}
        on:keypress={handleKeyPress}
        placeholder="What needs to be done?"
        class="todo-input"
        disabled={isLoading}
      />
      <button on:click={addTodo} class="add-button" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Add'}
      </button>
    </div>

    {#if isLoading && todos.length === 0}
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading todos...</p>
      </div>
    {:else}
      <ul class="todo-list">
        {#each todos as todo (todo.id)}
          <li class="todo-item" class:completed={todo.completed}>
            <input
              type="checkbox"
              checked={todo.completed}
              on:change={() => toggleTodo(todo.id)}
              id="todo-{todo.id}"
              disabled={isLoading}
            />
            <label for="todo-{todo.id}" class="todo-text">{todo.text}</label>
            <button
              on:click={() => handleDeleteTodo(todo.id)}
              class="delete-button"
              disabled={isLoading}
            >
              Delete
            </button>
          </li>
        {/each}
        {#if todos.length === 0}
          <li class="empty-state">No todos yet. Add one above!</li>
        {/if}
      </ul>
    {/if}
  </div>
</div>

<style>
  .todo-app {
    width: 100%;
  }

  .container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    padding: 32px;
  }

  h1 {
    font-size: 36px;
    color: #333;
    margin-bottom: 24px;
    text-align: center;
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-bottom: 24px;
  }

  .stat {
    padding: 8px 16px;
    background: #f0f0f0;
    border-radius: 20px;
    font-size: 14px;
    color: #666;
  }

  .input-section {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }

  .todo-input {
    flex: 1;
    padding: 12px 16px;
    font-size: 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s;
  }

  .todo-input:focus {
    border-color: #667eea;
  }

  .add-button {
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .add-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .add-button:active {
    transform: translateY(0);
  }

  .todo-list {
    list-style: none;
  }

  .todo-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 8px;
    transition: background 0.2s;
  }

  .todo-item:hover {
    background: #f0f0f0;
  }

  .todo-item.completed {
    opacity: 0.6;
  }

  .todo-item input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .todo-text {
    flex: 1;
    font-size: 16px;
    color: #333;
    cursor: pointer;
  }

  .todo-item.completed .todo-text {
    text-decoration: line-through;
    color: #999;
  }

  .delete-button {
    padding: 8px 16px;
    font-size: 14px;
    color: white;
    background: #e74c3c;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .delete-button:hover {
    background: #c0392b;
  }

  .empty-state {
    text-align: center;
    padding: 32px;
    color: #999;
    font-style: italic;
  }

  .notification {
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: slideIn 0.3s ease-out;
  }

  .notification.error {
    background: #fee;
    color: #c00;
    border: 1px solid #fcc;
  }

  .notification.success {
    background: #efe;
    color: #0a0;
    border: 1px solid #cfc;
  }

  .notification-actions {
    display: flex;
    gap: 8px;
  }

  .retry-button {
    padding: 6px 12px;
    font-size: 12px;
    color: white;
    background: #667eea;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .retry-button:hover {
    background: #5568d3;
  }

  .dismiss-button {
    padding: 6px 12px;
    font-size: 18px;
    font-weight: bold;
    color: #999;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.2s;
  }

  .dismiss-button:hover {
    color: #333;
  }

  .loading-spinner {
    text-align: center;
    padding: 48px;
  }

  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }

  .loading-spinner p {
    color: #999;
    font-size: 14px;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
