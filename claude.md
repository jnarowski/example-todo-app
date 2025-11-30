# Todo App - Project Documentation

## Overview

A modern, feature-rich todo application built with Svelte 4 and Vite. This is a single-page application (SPA) that provides a clean interface for managing tasks with persistent storage, statistics tracking, and an entertaining story feature.

**Key Features:**
- Create, complete, and delete todo items
- Persistent storage using browser localStorage
- Real-time statistics (active/completed counts)
- "Tell me a story" feature with curated stories
- Responsive design with smooth animations
- Robust error handling for storage operations

## Tech Stack

### Core Technologies
- **Svelte 4.2.8** - Reactive component framework
- **Vite 5.0.10** - Build tool and dev server
- **@sveltejs/vite-plugin-svelte 3.0.1** - Svelte integration for Vite

### Additional Tools
- **agentcmd-workflows 1.1.31** - Workflow and specification management
- **localStorage API** - Client-side data persistence
- **Native JavaScript** - No additional runtime dependencies

## Project Structure

```
example-todo-app/
├── src/
│   ├── App.svelte              # Main application component
│   ├── main.js                 # Application entry point
│   ├── app.css                 # Global styles
│   ├── components/
│   │   └── StoryModal.svelte   # Modal component for story display
│   └── data/
│       └── stories.js          # Story collection and utilities
├── .agent/                     # Agent workflow specifications
│   ├── docs/                   # Documentation for slash commands
│   └── specs/                  # Feature specifications
│       ├── done/               # Completed features
│       ├── todo/               # In-progress/planned features
│       └── index.json          # Spec metadata index
├── public/                     # Static assets
├── package.json                # Project dependencies and scripts
├── vite.config.js              # Vite configuration
└── claude.md                   # This documentation file
```

## Application Features

### 1. Todo Management (App.svelte)
- **Add Todos**: Text input with "Add" button or Enter key
- **Toggle Completion**: Checkbox to mark todos as complete/incomplete
- **Delete Todos**: Remove individual todos
- **Empty State**: Friendly message when no todos exist
- **Visual Feedback**: Completed todos shown with strikethrough and reduced opacity

### 2. Data Persistence (App.svelte)
The app implements a robust localStorage persistence system:

**Storage Key**: `svelte-todo-app-v1`

**Data Structure**:
```javascript
{
  todos: [
    { id: number, text: string, completed: boolean }
  ],
  nextId: number,
  version: number,
  timestamp: string
}
```

**Key Functions**:
- `isStorageAvailable()` - Checks if localStorage is accessible
- `validateStorageData(data)` - Validates data structure and types
- `loadTodosFromStorage()` - Loads todos on component mount
- `saveTodosToStorage(todos, nextId)` - Auto-saves on todo changes

**Error Handling**:
- Validates localStorage availability
- Validates data structure before loading
- Handles QuotaExceededError gracefully
- Clears invalid data automatically
- Console logging for debugging

### 3. Statistics Tracking (App.svelte)
Real-time statistics displayed at the top of the app:
- **Active Todos**: Count of incomplete tasks
- **Completed Todos**: Count of completed tasks
- Uses Svelte reactive statements (`$:`) for automatic updates

### 4. Story Feature (StoryModal.svelte, stories.js)
A "Tell me a story" button that displays random inspirational stories:

**Story Collection** (stories.js):
- 8 curated stories including fables, parables, and folktales
- Each story has: title, content, and author
- Stories: "The Oak and the Reed", "The Two Wolves", "The Cracked Pot", etc.
- `getRandomStory()` function for random selection

**Modal Component** (StoryModal.svelte):
- Animated overlay and card design
- Close button and ESC key support
- Click outside to close
- Responsive design for mobile devices
- Smooth fade-in and slide-up animations

## Development Workflow

### Available Commands

```bash
# Start development server
npm run dev
# or
pnpm dev

# Build for production
npm run build
# or
pnpm build

# Preview production build
npm run preview
# or
pnpm preview
```

### Development Server
- Default port: Usually 5173 (Vite default)
- Hot module replacement (HMR) enabled
- Instant component updates

### Build Output
- Production files generated in `dist/` directory
- Optimized and minified assets
- Tree-shaking for minimal bundle size

## Code Patterns and Conventions

### Svelte Reactive Patterns

**Reactive Statements** (`$:`):
```javascript
// Auto-computed values that update when dependencies change
$: activeTodos = todos.filter(todo => !todo.completed).length;
$: completedTodos = todos.filter(todo => todo.completed).length;

// Auto-save side effect when todos change
$: if (todos) {
  saveTodosToStorage(todos, nextId);
}
```

**Component Lifecycle**:
```javascript
import { onMount, onDestroy } from 'svelte';

onMount(() => {
  // Load data, add event listeners
});

onDestroy(() => {
  // Cleanup event listeners
});
```

### State Management
- Component-level state using `let` declarations
- No external state management library
- Simple, predictable data flow
- Immutable update patterns for arrays:
  ```javascript
  // Good: Create new array
  todos = [...todos, newTodo];

  // Good: Map to new array
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  ```

### Event Handling
- Inline event handlers: `on:click={handler}`
- Event handler functions defined in `<script>` section
- Keyboard events: `on:keypress={handleKeyPress}`

### CSS Styling
- Component-scoped styles in `<style>` blocks
- No CSS-in-JS or CSS modules needed
- Gradient backgrounds: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Smooth transitions: `transition: transform 0.2s, box-shadow 0.2s`
- CSS animations with `@keyframes`

### Accessibility Features
- Semantic HTML elements
- Proper ARIA labels: `aria-label`, `aria-modal`
- Keyboard navigation support (ESC key)
- Associated labels with form inputs

## Storage Implementation Details

### Version Management
The app uses versioned storage (`STORAGE_VERSION = 1`) to allow for future data migrations if needed.

### Type Safety
All stored data is validated on load:
- `todos` must be an array
- `nextId` must be a number
- Each todo must have: `id` (number), `text` (string), `completed` (boolean)

### Failure Handling
- If localStorage is unavailable: App works in memory-only mode
- If stored data is invalid: Clears storage and starts fresh
- If quota exceeded: Shows error in console, continues with existing data

## Component Communication

### Props (Parent → Child)
```javascript
// StoryModal receives props
export let story = null;
export let onClose = () => {};

// Parent passes props
<StoryModal story={currentStory} onClose={handleCloseStory} />
```

### Callbacks (Child → Parent)
```javascript
// Child calls parent function
onClose();

// Parent defines handler
function handleCloseStory() {
  showStory = false;
}
```

## Browser Compatibility

The app uses standard web APIs:
- localStorage (with feature detection)
- ES6+ JavaScript features
- Modern CSS (flexbox, grid, animations)

Recommended browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Future Enhancements

Potential features to consider (see `.agent/specs/` for planned specs):
- Drag-and-drop reordering
- Todo categories/tags
- Due dates and reminders
- Search/filter functionality
- Export/import todos
- Dark mode

## Troubleshooting

### Todos Not Persisting
- Check browser console for localStorage errors
- Verify localStorage is not disabled in browser settings
- Check if storage quota is exceeded (rare)

### Development Server Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check port availability (default 5173)

### Build Failures
- Ensure all dependencies are installed
- Check for TypeScript/syntax errors
- Verify Node.js version compatibility

## References

- [Svelte Documentation](https://svelte.dev/docs)
- [Vite Documentation](https://vitejs.dev/)
- [MDN Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## Project Metadata

- **Package Name**: project
- **Version**: 1.0.0
- **Type**: module (ES modules)
- **Created**: 2025-11-24
- **Last Updated**: 2025-11-30
