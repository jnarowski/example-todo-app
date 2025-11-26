<script>
  import { todoStore } from './lib/stores/todoStore.js';
  import { isOnline, syncStatus } from './lib/utils/offline.js';
  import { notification } from './lib/stores/notificationStore.js';

  let newTodo = '';

  function addTodo() {
    if (newTodo.trim()) {
      todoStore.add(newTodo);
      newTodo = '';
    }
  }

  function toggleTodo(id) {
    todoStore.toggle(id);
  }

  function deleteTodo(id) {
    todoStore.remove(id);
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      addTodo();
    }
  }

  $: activeTodos = $todoStore.filter(todo => !todo.completed).length;
  $: completedTodos = $todoStore.filter(todo => todo.completed).length;
</script>

<div class="todo-app">
  {#if $notification}
    <div class="notification notification-{$notification.type}">
      <span>{$notification.message}</span>
      <button class="notification-close" on:click={() => notification.clear()}>×</button>
    </div>
  {/if}

  <div class="container">
    <div class="status-indicator" class:online={$isOnline} class:offline={!$isOnline}>
      <span class="status-dot"></span>
      <span class="status-text">
        {$isOnline ? 'Online' : 'Offline'}
        {#if $syncStatus === 'syncing'}
          - Syncing...
        {:else if $syncStatus === 'synced'}
          - Synced ✓
        {:else if $syncStatus === 'error'}
          - Error
        {/if}
      </span>
    </div>

    <h1>Todo App</h1>

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
      />
      <button on:click={addTodo} class="add-button">Add</button>
    </div>

    <ul class="todo-list">
      {#each $todoStore as todo (todo.id)}
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
      {#if $todoStore.length === 0}
        <li class="empty-state">No todos yet. Add one above!</li>
      {/if}
    </ul>
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
    position: relative;
  }

  .status-indicator {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .status-indicator.online {
    background: #d4edda;
    color: #155724;
  }

  .status-indicator.offline {
    background: #fff3cd;
    color: #856404;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }

  .status-indicator.online .status-dot {
    background: #28a745;
    animation: pulse 2s ease-in-out infinite;
  }

  .status-indicator.offline .status-dot {
    background: #ffc107;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .status-text {
    white-space: nowrap;
  }

  .notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 1000;
    animation: slideDown 0.3s ease;
    max-width: 90%;
  }

  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  .notification-info {
    background: #d1ecf1;
    color: #0c5460;
  }

  .notification-success {
    background: #d4edda;
    color: #155724;
  }

  .notification-warning {
    background: #fff3cd;
    color: #856404;
  }

  .notification-error {
    background: #f8d7da;
    color: #721c24;
  }

  .notification-close {
    background: none;
    border: none;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    margin-left: 8px;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  .notification-close:hover {
    opacity: 1;
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
</style>
