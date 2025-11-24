<script>
  let todos = [];
  let newTodo = '';
  let newPriority = 'medium';
  let nextId = 1;

  function addTodo() {
    if (newTodo.trim()) {
      todos = [...todos, { id: nextId++, text: newTodo, completed: false, priority: newPriority }];
      newTodo = '';
      newPriority = 'medium';
    }
  }

  function toggleTodo(id) {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      addTodo();
    }
  }

  $: activeTodos = todos.filter(todo => !todo.completed).length;
  $: completedTodos = todos.filter(todo => todo.completed).length;

  // Priority order mapping for sorting
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

  // Sort todos by priority, then by ID (creation order)
  $: sortedTodos = [...todos].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    return priorityDiff !== 0 ? priorityDiff : a.id - b.id;
  });
</script>

<div class="todo-app">
  <div class="container">
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
      <select bind:value={newPriority} class="priority-select">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
      <button on:click={addTodo} class="add-button">Add</button>
    </div>

    <ul class="todo-list">
      {#each sortedTodos as todo (todo.id)}
        <li class="todo-item" class:completed={todo.completed}>
          <span class="priority-badge priority-{todo.priority}">
            {todo.priority}
          </span>
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
      {#if sortedTodos.length === 0}
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

  .priority-select {
    padding: 12px 16px;
    font-size: 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    outline: none;
    background: white;
    cursor: pointer;
    transition: border-color 0.2s;
    min-width: 120px;
  }

  .priority-select:hover {
    border-color: #c0c0c0;
  }

  .priority-select:focus {
    border-color: #667eea;
  }

  .todo-list {
    list-style: none;
  }

  .priority-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .priority-critical {
    background: #e74c3c;
    color: white;
  }

  .priority-high {
    background: #e67e22;
    color: white;
  }

  .priority-medium {
    background: #3498db;
    color: white;
  }

  .priority-low {
    background: #95a5a6;
    color: white;
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
