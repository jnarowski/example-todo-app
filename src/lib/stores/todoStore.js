import { writable } from 'svelte/store';
import * as storage from '../services/storage.js';

/**
 * Create the todo store with automatic persistence
 */
function createTodoStore() {
  // Load initial state from localStorage
  const initialState = storage.load();

  const { subscribe, set, update } = writable({
    todos: initialState.todos,
    nextId: initialState.nextId
  });

  // Subscribe to changes and auto-save to localStorage
  subscribe(state => {
    storage.save(state);
  });

  return {
    subscribe,

    /**
     * Add a new todo
     * @param {string} text - Todo text
     * @param {number|null} estimatedHours - Estimated hours for the todo (optional)
     */
    addTodo: (text, estimatedHours = null) => {
      update(state => ({
        todos: [...state.todos, {
          id: state.nextId,
          text,
          completed: false,
          estimatedHours: estimatedHours,
          createdAt: new Date().toISOString()
        }],
        nextId: state.nextId + 1
      }));
    },

    /**
     * Toggle todo completion status
     * @param {number} id - Todo ID
     */
    toggleTodo: (id) => {
      update(state => ({
        ...state,
        todos: state.todos.map(todo =>
          todo.id === id
            ? { ...todo, completed: !todo.completed, modifiedAt: new Date().toISOString() }
            : todo
        )
      }));
    },

    /**
     * Delete a todo
     * @param {number} id - Todo ID
     */
    deleteTodo: (id) => {
      update(state => ({
        ...state,
        todos: state.todos.filter(todo => todo.id !== id)
      }));
    },

    /**
     * Update estimated hours for a todo
     * @param {number} id - Todo ID
     * @param {number|null} estimatedHours - New estimated hours
     */
    updateEstimate: (id, estimatedHours) => {
      update(state => ({
        ...state,
        todos: state.todos.map(todo =>
          todo.id === id
            ? { ...todo, estimatedHours, modifiedAt: new Date().toISOString() }
            : todo
        )
      }));
    },

    /**
     * Clear all todos
     */
    clearAll: () => {
      set({ todos: [], nextId: 1 });
    },

    /**
     * Load state from storage (useful for force refresh)
     */
    reload: () => {
      const state = storage.load();
      set({
        todos: state.todos,
        nextId: state.nextId
      });
    }
  };
}

export const todoStore = createTodoStore();
