<script>
  import TodoItem from './TodoItem.svelte';
  import { filterRootTodos } from '../lib/todoTree.js';
  import { createEventDispatcher } from 'svelte';

  export let todos = [];

  const dispatch = createEventDispatcher();

  $: rootTodos = filterRootTodos(todos);

  function handleToggle(event) {
    dispatch('toggle', event.detail);
  }

  function handleDelete(event) {
    dispatch('delete', event.detail);
  }

  function handleAddSubtask(event) {
    dispatch('addSubtask', event.detail);
  }

  function handleToggleExpanded(event) {
    dispatch('toggleExpanded', event.detail);
  }
</script>

<ul class="todo-list">
  {#if rootTodos.length === 0}
    <li class="empty-state">No todos yet. Add one above!</li>
  {:else}
    {#each rootTodos as todo (todo.id)}
      <TodoItem
        {todo}
        depth={0}
        allTodos={todos}
        on:toggle={handleToggle}
        on:delete={handleDelete}
        on:addSubtask={handleAddSubtask}
        on:toggleExpanded={handleToggleExpanded}
      />
    {/each}
  {/if}
</ul>

<style>
  .todo-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .empty-state {
    text-align: center;
    padding: 32px;
    color: #999;
    font-style: italic;
  }
</style>
