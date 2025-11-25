<script>
  import { hasChildren, getChildren, getSubtaskProgress } from '../lib/todoTree.js';
  import { createEventDispatcher } from 'svelte';

  export let todo;
  export let depth = 0;
  export let allTodos = [];

  const dispatch = createEventDispatcher();

  $: itemHasChildren = hasChildren(allTodos, todo.id);
  $: children = itemHasChildren && todo.expanded ? getChildren(allTodos, todo.id) : [];
  $: progress = itemHasChildren ? getSubtaskProgress(allTodos, todo.id) : null;

  function handleToggle() {
    dispatch('toggle', { id: todo.id });
  }

  function handleDelete() {
    dispatch('delete', { id: todo.id });
  }

  function handleAddSubtask() {
    dispatch('addSubtask', { parentId: todo.id });
  }

  function handleToggleExpanded() {
    dispatch('toggleExpanded', { id: todo.id });
  }
</script>

<li class="todo-item" class:has-children={itemHasChildren} style="padding-left: {depth * 24}px">
  <div class="todo-content">
    {#if itemHasChildren}
      <button
        class="expand-button"
        on:click={handleToggleExpanded}
        aria-label={todo.expanded ? 'Collapse' : 'Expand'}
      >
        {todo.expanded ? '▼' : '▶'}
      </button>
    {:else}
      <span class="expand-spacer"></span>
    {/if}

    <input
      type="checkbox"
      checked={todo.completed}
      on:change={handleToggle}
      id="todo-{todo.id}"
    />

    <label for="todo-{todo.id}" class="todo-text" class:completed={todo.completed}>
      {todo.text}
    </label>

    {#if progress && progress.total > 0}
      <span class="subtask-badge" class:all-complete={progress.completed === progress.total} class:partial={progress.completed > 0 && progress.completed < progress.total}>
        {progress.completed}/{progress.total}
      </span>
    {/if}

    <button class="add-subtask-button" on:click={handleAddSubtask}>
      Add subtask
    </button>

    <button class="delete-button" on:click={handleDelete}>
      Delete
    </button>
  </div>
</li>

{#if itemHasChildren && todo.expanded}
  {#each children as child (child.id)}
    <svelte:self
      todo={child}
      depth={depth + 1}
      allTodos={allTodos}
      on:toggle
      on:delete
      on:addSubtask
      on:toggleExpanded
    />
  {/each}
{/if}

<style>
  .todo-item {
    display: block;
    background: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 4px;
    transition: background 0.2s;
  }

  .todo-item:hover {
    background: #f0f0f0;
  }

  .todo-item.has-children {
    font-weight: 500;
  }

  .todo-content {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
  }

  .expand-button {
    width: 24px;
    height: 24px;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 12px;
    color: #667eea;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
  }

  .expand-button:hover {
    transform: scale(1.2);
  }

  .expand-spacer {
    width: 24px;
    height: 24px;
  }

  input[type="checkbox"] {
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

  .todo-text.completed {
    text-decoration: line-through;
    color: #999;
  }

  .subtask-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    background: #e0e0e0;
    color: #666;
  }

  .subtask-badge.partial {
    background: #667eea;
    color: white;
  }

  .subtask-badge.all-complete {
    background: #27ae60;
    color: white;
  }

  .add-subtask-button {
    padding: 6px 12px;
    font-size: 13px;
    color: #667eea;
    background: transparent;
    border: 1px solid #667eea;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    opacity: 0;
  }

  .todo-item:hover .add-subtask-button,
  .add-subtask-button:focus {
    opacity: 1;
  }

  .add-subtask-button:hover {
    background: #667eea;
    color: white;
  }

  .delete-button {
    padding: 6px 12px;
    font-size: 13px;
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
</style>
