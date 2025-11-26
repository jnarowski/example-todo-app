<script>
  import { onMount } from 'svelte';
  import { api, ApiError } from './lib/api.js';

  let todos = [];
  let newTodo = '';
  let loading = false;
  let error = null;
  let isInitialLoad = true;

  // Fetch todos on mount
  onMount(async () => {
    await loadTodos();
  });

  async function loadTodos() {
    loading = true;
    error = null;
    try {
      todos = await api.getTodos();
    } catch (err) {
      error = err instanceof ApiError ? err.message : 'Failed to load todos';
      console.error('Error loading todos:', err);
    } finally {
      loading = false;
      isInitialLoad = false;
    }
  }

  async function addTodo() {
    if (!newTodo.trim()) return;

    const todoText = newTodo.trim();
    newTodo = '';
    error = null;

    // Optimistic update
    const tempTodo = {
      id: Date.now(),
      text: todoText,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    todos = [...todos, tempTodo];

    try {
      const createdTodo = await api.createTodo(todoText);
      // Replace temp todo with real one from server
      todos = todos.map(t => t.id === tempTodo.id ? createdTodo : t);
    } catch (err) {
      // Rollback optimistic update
      todos = todos.filter(t => t.id !== tempTodo.id);
      error = err instanceof ApiError ? err.message : 'Failed to add todo';
      console.error('Error adding todo:', err);
      // Restore the input value
      newTodo = todoText;
    }
  }

  async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    error = null;

    // Optimistic update
    const previousCompleted = todo.completed;
    todos = todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );

    try {
      await api.updateTodo(id, { completed: !previousCompleted });
    } catch (err) {
      // Rollback optimistic update
      todos = todos.map(t =>
        t.id === id ? { ...t, completed: previousCompleted } : t
      );
      error = err instanceof ApiError ? err.message : 'Failed to update todo';
      console.error('Error toggling todo:', err);
    }
  }

  async function deleteTodo(id) {
    error = null;

    // Optimistic update
    const previousTodos = todos;
    todos = todos.filter(t => t.id !== id);

    try {
      await api.deleteTodo(id);
    } catch (err) {
      // Rollback optimistic update
      todos = previousTodos;
      error = err instanceof ApiError ? err.message : 'Failed to delete todo';
      console.error('Error deleting todo:', err);
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      addTodo();
    }
  }

  $: activeTodos = todos.filter(todo => !todo.completed).length;
  $: completedTodos = todos.filter(todo => todo.completed).length;
</script>

<div class="todo-app">
  <div class="container">
    <h1>Todo App</h1>

    {#if error}
      <div class="error-banner">
        {error}
        <button class="retry-button" on:click={loadTodos}>Retry</button>
      </div>
    {/if}

    {#if isInitialLoad && loading}
      <div class="loading">Loading todos...</div>
    {:else}
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
          disabled={loading}
        />
        <button on:click={addTodo} class="add-button" disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      <ul class="todo-list">
        {#each todos as todo (todo.id)}
          <li class="todo-item" class:completed={todo.completed}>
            <input
              type="checkbox"
              checked={todo.completed}
              on:change={() => toggleTodo(todo.id)}
              id="todo-{todo.id}"
            />
            <label for="todo-{todo.id}" class="todo-text">{todo.text}</label>
            <button on:click={() => deleteTodo(todo.id)} class="delete-button">
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

  .error-banner {
    background: #fee;
    border: 1px solid #fcc;
    color: #c33;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .retry-button {
    padding: 6px 12px;
    font-size: 14px;
    color: white;
    background: #c33;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
  }

  .retry-button:hover {
    background: #a22;
  }

  .loading {
    text-align: center;
    padding: 48px;
    color: #667eea;
    font-size: 18px;
    font-weight: 500;
  }

  .add-button:disabled,
  .todo-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
