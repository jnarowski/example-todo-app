# Todo App - Project Context

## Overview

This is a simple todo application built with Svelte 4 and Vite 5. The app allows users to add, complete, and delete todo items with a clean, modern interface. It demonstrates core Svelte concepts including reactivity, component structure, and scoped styling.

## Tech Stack

- **Frontend Framework**: Svelte 4.2.8
- **Build Tool**: Vite 5.0.10
- **Package Manager**: pnpm
- **Development**: Hot Module Replacement (HMR) via Vite

## Project Structure

```
example-todo-app/
├── .agent/                 # Agent specs and documentation
├── .claude/               # Claude Code configuration
├── src/
│   ├── App.svelte         # Main todo app component
│   ├── main.js            # Application entry point
│   └── app.css            # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── svelte.config.js       # Svelte configuration
├── package.json           # Project dependencies and scripts
└── CLAUDE.md              # This file
```

## Key Files

### `src/App.svelte`
The main component containing all todo logic:
- **State Management**: Uses local component state with Svelte's reactive declarations
- **Todo Structure**: `{ id: number, text: string, completed: boolean }`
- **Core Functions**:
  - `addTodo()`: Adds new todo to list
  - `toggleTodo(id)`: Toggles completion status
  - `deleteTodo(id)`: Removes todo from list
  - `handleKeyPress()`: Handles Enter key for adding todos
- **Reactive Statements**: Uses `$:` syntax for computed values (activeTodos, completedTodos)

### `src/main.js`
Application bootstrap:
- Imports App component and global styles
- Mounts Svelte app to DOM element `#app`

### `vite.config.js`
Simple Vite configuration with Svelte plugin

## Development Commands

```bash
# Start development server with HMR (default: http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

## Code Patterns & Conventions

### Svelte Reactivity
- **State Updates**: All state updates use immutable patterns (`todos = [...todos, newTodo]`)
- **Reactive Declarations**: Computed values use `$:` prefix (e.g., `$: activeTodos = todos.filter(...)`)
- **Two-Way Binding**: Input values use `bind:value={variable}`

### Component Structure
Single-file components with three sections:
1. `<script>`: JavaScript logic and state
2. Template: Svelte markup with directives (`{#each}`, `{#if}`)
3. `<style>`: Scoped CSS (automatically scoped to component)

### Styling Approach
- **Scoped Styles**: All styles in `<style>` blocks are component-scoped
- **Global Styles**: Defined in `src/app.css`, imported in main.js
- **CSS Classes**: Uses conditional classes (`class:completed={todo.completed}`)

## State Management

### Approach
Local component state using Svelte's built-in reactivity system. No external state management library needed for this app.

### State Location
All state lives in `App.svelte`:
- `todos`: Array of todo items
- `newTodo`: Current input value
- `nextId`: Auto-incrementing ID counter

### Data Flow
Unidirectional data flow from parent to child through:
- Props (if we add child components)
- Event handlers passed as callbacks
- Direct state updates in parent component

## Architecture Notes

### Single Component Design
Currently uses a single component (`App.svelte`) containing all logic. This is appropriate for the app's simplicity.

### No Persistence
Todos are stored in memory only. Page refresh will clear all data. Future enhancement could add:
- LocalStorage persistence
- Backend API integration
- Database storage

### Styling Strategy
Combines:
- Global base styles in `app.css` (body, html, reset)
- Component-scoped styles in `App.svelte` (todo UI)
- Gradient buttons and modern UI patterns

## Common Tasks

### Adding a New Feature
1. Identify which component needs modification (likely `App.svelte`)
2. Add state variables if needed
3. Create handler functions
4. Update template markup
5. Add styles in `<style>` block
6. Test with `npm run dev`

### Debugging
- Use Svelte DevTools browser extension
- Check browser console for errors
- Use `console.log()` in script section
- Verify state updates in reactive declarations

### Testing Changes
1. Start dev server: `npm run dev`
2. Open browser to localhost:5173
3. Test functionality manually
4. Run build to check for errors: `npm run build`

## Svelte-Specific Concepts

### Directives
- `{#each items as item}...{/each}`: Loop over arrays
- `{#if condition}...{/if}`: Conditional rendering
- `bind:value`: Two-way data binding
- `on:click`: Event handling
- `class:name={condition}`: Conditional CSS classes

### Reactivity Rules
- Assignments trigger updates (`todos = newValue`)
- Array mutations don't trigger updates (must reassign array)
- Reactive statements run when dependencies change (`$:`)

## Future Considerations

Potential enhancements:
- Add TypeScript for type safety
- Implement localStorage persistence
- Add todo categories/tags
- Include due dates and priorities
- Add filters (all/active/completed)
- Implement drag-and-drop reordering
- Add dark mode support

## References

- [Svelte Documentation](https://svelte.dev)
- [Vite Documentation](https://vitejs.dev)
- [Svelte Tutorial](https://svelte.dev/tutorial)
