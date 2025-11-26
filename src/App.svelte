<script>
  let todos = [];
  let newTodo = '';
  let newTodoPriority = 2; // Default to Medium
  let nextId = 1;

  function addTodo() {
    if (newTodo.trim()) {
      todos = [...todos, { id: nextId++, text: newTodo, completed: false, priority: newTodoPriority }];
      newTodo = '';
      newTodoPriority = 2; // Reset to Medium
    }
  }

  function toggleTodo(id) {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  function updatePriority(id, priority) {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, priority } : todo
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

  $: sortedTodos = [...todos].sort((a, b) => {
    // First, separate completed vs active tasks
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // Active tasks first
    }
    // Then sort by priority (descending - highest priority first)
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    // Finally, sort by id (creation order)
    return a.id - b.id;
  });

  $: activeTodos = todos.filter(todo => !todo.completed).length;
  $: completedTodos = todos.filter(todo => todo.completed).length;
  $: urgentCount = todos.filter(todo => !todo.completed && todo.priority === 4).length;
  $: highCount = todos.filter(todo => !todo.completed && todo.priority === 3).length;
  $: mediumCount = todos.filter(todo => !todo.completed && todo.priority === 2).length;
  $: lowCount = todos.filter(todo => !todo.completed && todo.priority === 1).length;
</script>

<div class="todo-app">
  <div class="container">
    <h1>Todo App</h1>

    <div class="stats">
      <span class="stat">Active: {activeTodos}</span>
      <span class="stat">Completed: {completedTodos}</span>
      {#if activeTodos > 0}
        <span class="stat priority-stat">
          Urgent: {urgentCount} | High: {highCount} | Medium: {mediumCount} | Low: {lowCount}
        </span>
      {/if}
    </div>

    <div class="input-section">
      <input
        type="text"
        bind:value={newTodo}
        on:keypress={handleKeyPress}
        placeholder="What needs to be done?"
        class="todo-input"
      />
      <select bind:value={newTodoPriority} class="priority-select">
        <option value={1}>Low</option>
        <option value={2}>Medium</option>
        <option value={3}>High</option>
        <option value={4}>Urgent</option>
      </select>
      <button on:click={addTodo} class="add-button">Add</button>
    </div>

    <ul class="todo-list">
      {#each sortedTodos as todo (todo.id)}
        <li class="todo-item" class:completed={todo.completed}>
          <input
            type="checkbox"
            checked={todo.completed}
            on:change={() => toggleTodo(todo.id)}
            id="todo-{todo.id}"
          />
          <span class="priority-badge priority-{todo.priority}">
            {todo.priority === 1 ? 'Low' : todo.priority === 2 ? 'Medium' : todo.priority === 3 ? 'High' : 'Urgent'}
          </span>
          <label for="todo-{todo.id}" class="todo-text">{todo.text}</label>
          <select
            value={todo.priority}
            on:change={(e) => updatePriority(todo.id, parseInt(e.target.value))}
            class="priority-select-inline"
          >
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
            <option value={4}>Urgent</option>
          </select>
          <button on:click={() => deleteTodo(todo.id)} class="delete-button">
            Delete
          </button>
        </li>
      {/each}
      {#if todos.length === 0}
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
    background: white;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
    min-width: 110px;
  }

  .priority-select:hover {
    border-color: #667eea;
  }

  .priority-select:focus {
    border-color: #667eea;
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

  .priority-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .priority-1 {
    background: #6c757d;
    color: white;
  }

  .priority-2 {
    background: #007bff;
    color: white;
  }

  .priority-3 {
    background: #fd7e14;
    color: white;
  }

  .priority-4 {
    background: #dc3545;
    color: white;
  }

  .priority-select-inline {
    padding: 4px 8px;
    font-size: 13px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
  }

  .priority-select-inline:hover {
    border-color: #667eea;
  }

  .priority-select-inline:focus {
    border-color: #667eea;
  }
</style>
