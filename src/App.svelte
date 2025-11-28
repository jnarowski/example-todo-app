<script>
  import { onMount } from 'svelte';
  import StoryModal from './components/StoryModal.svelte';
  import { getRandomStory } from './data/stories.js';

  // Storage constants
  const STORAGE_KEY = 'svelte-todo-app-v1';
  const STORAGE_VERSION = 1;

  // Storage utility: Check if localStorage is available
  function isStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not available:', e);
      return false;
    }
  }

  // Storage utility: Validate loaded data structure
  function validateStorageData(data) {
    if (!data || typeof data !== 'object') {
      console.warn('Invalid storage data: not an object');
      return false;
    }

    if (!Array.isArray(data.todos)) {
      console.warn('Invalid storage data: todos is not an array');
      return false;
    }

    if (typeof data.nextId !== 'number') {
      console.warn('Invalid storage data: nextId is not a number');
      return false;
    }

    // Validate each todo item
    for (const todo of data.todos) {
      if (typeof todo.id !== 'number' ||
          typeof todo.text !== 'string' ||
          typeof todo.completed !== 'boolean') {
        console.warn('Invalid storage data: todo item has incorrect types');
        return false;
      }
    }

    return true;
  }

  // Storage utility: Load todos from localStorage
  function loadTodosFromStorage() {
    if (!isStorageAvailable()) {
      return null;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return null;
      }

      const data = JSON.parse(stored);

      if (!validateStorageData(data)) {
        console.warn('Clearing invalid storage data');
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      console.log(`Loaded ${data.todos.length} todos from storage`);
      return data;
    } catch (e) {
      console.error('Error loading from storage:', e);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  // Storage utility: Save todos to localStorage
  function saveTodosToStorage(todos, nextId) {
    if (!isStorageAvailable()) {
      return;
    }

    try {
      const data = {
        todos,
        nextId,
        version: STORAGE_VERSION,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded. Unable to save todos.');
      } else {
        console.error('Error saving to storage:', e);
      }
    }
  }

  let todos = [];
  let newTodo = '';
  let nextId = 1;

  // Story feature state
  let showStory = false;
  let currentStory = null;

  // Load persisted todos on component mount
  onMount(() => {
    const data = loadTodosFromStorage();
    if (data) {
      todos = data.todos;
      nextId = data.nextId;
      console.log(`Loaded ${todos.length} todos from storage`);
    }
  });

  function addTodo() {
    if (newTodo.trim()) {
      todos = [...todos, { id: nextId++, text: newTodo, completed: false }];
      newTodo = '';
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

  function handleShowStory() {
    currentStory = getRandomStory();
    showStory = true;
  }

  function handleCloseStory() {
    showStory = false;
  }

  $: activeTodos = todos.filter(todo => !todo.completed).length;
  $: completedTodos = todos.filter(todo => todo.completed).length;

  // Auto-save todos to localStorage whenever they change
  $: if (todos) {
    saveTodosToStorage(todos, nextId);
  }
</script>

<div class="todo-app">
  <div class="container">
    <h1>Todo App</h1>

    <div class="stats">
      <span class="stat">Active: {activeTodos}</span>
      <span class="stat">Completed: {completedTodos}</span>
    </div>

    <div class="story-section">
      <button on:click={handleShowStory} class="story-button">
        Tell me a story
      </button>
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
  </div>
</div>

<StoryModal story={currentStory} onClose={handleCloseStory} />

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

  .story-section {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  }

  .story-button {
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

  .story-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .story-button:active {
    transform: translateY(0);
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
