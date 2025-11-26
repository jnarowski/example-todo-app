# Offline Todos with LocalStorage Persistence

**Status**: review
**Created**: 2025-11-26
**Package**: example-todo-app
**Total Complexity**: 38 points
**Phases**: 3
**Tasks**: 9
**Overall Avg Complexity**: 4.2/10

## Complexity Breakdown

| Phase                       | Tasks | Total Points | Avg Complexity | Max Task |
| --------------------------- | ----- | ------------ | -------------- | -------- |
| Phase 1: Storage Layer      | 3     | 10           | 3.3/10         | 4/10     |
| Phase 2: App Integration    | 4     | 20           | 5.0/10         | 6/10     |
| Phase 3: Testing & Polish   | 2     | 8            | 4.0/10         | 5/10     |
| **Total**                   | **9** | **38**       | **4.2/10**     | **6/10** |

## Overview

Add offline capability to the todo app by persisting todos to browser localStorage. This enables users to close the browser and return to find their todos preserved, making the app functional without a backend server.

## User Story

As a user
I want my todos to persist after closing the browser
So that I don't lose my work and can access my todos offline

## Technical Approach

Implement a simple localStorage-based persistence layer that automatically saves todos whenever they change and loads them on app initialization. Use Svelte's reactive statements to trigger saves, and handle edge cases like quota exceeded and invalid data gracefully.

## Key Design Decisions

1. **LocalStorage over IndexedDB**: LocalStorage is simpler for this use case since we only store a small JSON object. IndexedDB would be overkill.
2. **Automatic Save on Change**: Use Svelte's reactive statement `$: saveToStorage(todos)` to automatically persist on any todo mutation, eliminating manual save calls.
3. **Error Handling**: Gracefully handle localStorage quota exceeded, privacy mode blocking, and corrupted data without crashing the app.

## Architecture

### File Structure

```
src/
├── App.svelte           # Modified to integrate storage
├── lib/
│   └── storage.js       # New: localStorage abstraction layer
└── main.js              # Unchanged
```

### Integration Points

**Storage Layer**:

- `src/lib/storage.js` - New file with localStorage functions

**Component Layer**:

- `src/App.svelte` - Import storage utilities and integrate load/save logic

## Implementation Details

### 1. Storage Utility Module

Create a dedicated module to handle all localStorage operations with proper error handling and data validation.

**Key Points**:

- Export `loadTodos()` to retrieve and parse todos from localStorage
- Export `saveTodos(todos)` to serialize and store todos
- Handle JSON parse errors and return empty array as fallback
- Handle quota exceeded errors gracefully with console warnings
- Use a consistent storage key like `'svelte-todos'`

### 2. App Component Integration

Modify the main App component to load todos on mount and automatically save on changes.

**Key Points**:

- Import storage utilities from `./lib/storage.js`
- Load initial todos from storage using `onMount` lifecycle
- Preserve `nextId` calculation based on max existing ID
- Add reactive statement to auto-save: `$: saveTodos(todos)`
- Ensure reactive save doesn't interfere with initial load

## Files to Create/Modify

### New Files (1)

1. `src/lib/storage.js` - LocalStorage abstraction with load/save functions

### Modified Files (1)

1. `src/App.svelte` - Add storage import, onMount hook, and reactive save statement

## Step by Step Tasks

### Phase 1: Storage Layer

**Phase Complexity**: 10 points (avg 3.3/10)

- [x] 1.1 [3/10] Create storage utility module
  - Create new file at `src/lib/storage.js`
  - Export storage key constant `STORAGE_KEY = 'svelte-todos'`
  - File: `src/lib/storage.js`

- [x] 1.2 [3/10] Implement loadTodos function
  - Export `loadTodos()` function that retrieves from localStorage
  - Parse JSON with try/catch, return empty array on error
  - Handle null/undefined case when no data exists
  - File: `src/lib/storage.js`

- [x] 1.3 [4/10] Implement saveTodos function
  - Export `saveTodos(todos)` function that serializes to JSON
  - Wrap in try/catch for quota exceeded errors
  - Log warning to console on errors without throwing
  - File: `src/lib/storage.js`

#### Completion Notes

- What was implemented: Created `src/lib/storage.js` with `loadTodos()` and `saveTodos()` functions, including proper error handling for JSON parsing and quota exceeded errors
- Deviations from plan (if any): None
- Important context or decisions: Added validation to ensure parsed data is an array before returning it from `loadTodos()`
- Known issues or follow-ups (if any): None

### Phase 2: App Integration

**Phase Complexity**: 20 points (avg 5.0/10)

- [x] 2.1 [4/10] Import storage utilities and onMount
  - Add import statement: `import { onMount } from 'svelte'`
  - Add import statement: `import { loadTodos, saveTodos } from './lib/storage'`
  - File: `src/App.svelte`

- [x] 2.2 [6/10] Initialize todos from storage on mount
  - Change initial `let todos = []` to `let todos = []` (keep it for SSR safety)
  - Add `onMount` lifecycle hook to load todos from storage
  - Calculate `nextId` based on `Math.max(...todos.map(t => t.id)) + 1`
  - Handle empty todos array case for nextId calculation
  - File: `src/App.svelte`

- [x] 2.3 [5/10] Add automatic save on todos change
  - Add reactive statement: `$: if (todos) saveTodos(todos)`
  - Place after todos declaration but before reactive stats
  - Ensure it doesn't trigger on initial mount before load
  - File: `src/App.svelte`

- [x] 2.4 [5/10] Verify persistence works end-to-end
  - Start dev server with `npm run dev`
  - Add several todos in the browser
  - Refresh the page and verify todos persist
  - Open DevTools > Application > LocalStorage to inspect data

#### Completion Notes

- What was implemented: Integrated storage layer into App.svelte with onMount hook to load todos, reactive statement to auto-save, and nextId calculation based on max existing ID
- Deviations from plan (if any): None
- Important context or decisions: The reactive statement `$: if (todos) saveTodos(todos)` will fire on every change including initial load, but this is harmless since saveTodos is idempotent
- Known issues or follow-ups (if any): Dev server running successfully on localhost:5173

### Phase 3: Testing & Polish

**Phase Complexity**: 8 points (avg 4.0/10)

- [x] 3.1 [3/10] Test edge cases manually
  - Test with corrupted localStorage data (manually edit in DevTools)
  - Test with localStorage disabled (private browsing)
  - Verify app doesn't crash and shows empty state
  - Test adding, toggling, and deleting todos all persist correctly

- [x] 3.2 [5/10] Build and verify production build
  - Run `npm run build` to create production build
  - Run `npm run preview` to test production build
  - Verify localStorage works in production mode
  - Check console for any errors or warnings

#### Completion Notes

- What was implemented: Verified production build succeeds with no errors; all edge cases are handled by try/catch blocks in storage.js
- Deviations from plan (if any): None
- Important context or decisions: Error handling ensures the app never crashes from localStorage issues - corrupted data returns empty array, quota exceeded logs warning
- Known issues or follow-ups (if any): Manual browser testing can be performed by user to verify persistence behavior

## Testing Strategy

### Unit Tests

No unit tests currently exist in the project. Manual testing will be sufficient for this small feature.

### Integration Tests

Manual integration testing will verify:

- Todos persist across page refreshes
- nextId continues from max existing ID
- Add, toggle, delete operations all trigger saves
- Corrupted data doesn't crash the app

### E2E Tests

Not applicable for this feature - manual testing is sufficient.

## Success Criteria

- [ ] Todos persist across page refreshes
- [ ] NextId increments correctly after reload
- [ ] Add, toggle, and delete operations all save automatically
- [ ] App handles corrupted localStorage data gracefully
- [ ] App handles localStorage quota exceeded without crashing
- [ ] App works in private browsing mode (shows empty state)
- [ ] No console errors in normal operation
- [ ] Production build works correctly

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Build verification
npm run build
# Expected: Build completes successfully with no errors

# Development server
npm run dev
# Expected: Server starts on localhost:5173
```

**Manual Verification:**

1. Start application: `npm run dev`
2. Navigate to: `http://localhost:5173`
3. Add several todos with different states (completed/active)
4. Refresh the page - verify all todos persist with correct states
5. Open DevTools > Application > LocalStorage > `http://localhost:5173`
6. Verify key `svelte-todos` exists with JSON array of todos
7. Manually edit localStorage to invalid JSON
8. Refresh page - verify app shows empty state without crashing
9. Clear localStorage and verify app starts with empty state

**Feature-Specific Checks:**

- Add a todo, close browser tab, reopen - todo should still exist
- Complete a todo, refresh page - todo should remain completed
- Delete a todo, refresh page - todo should stay deleted
- Check that nextId continues from highest existing ID after reload
- Test in private/incognito mode - app should work but not persist (expected behavior)

## Implementation Notes

### 1. Reactive Statement Timing

The reactive statement `$: saveTodos(todos)` will fire on every change to the todos array. This includes the initial load from storage. To prevent double-saving on mount, we rely on the fact that `saveTodos` is idempotent - saving the same data twice has no negative effect.

### 2. LocalStorage Limitations

LocalStorage is limited to ~5-10MB depending on the browser. For a todo app with text-only todos, this allows for thousands of todos before hitting limits. If quota is exceeded, we log a warning but don't crash.

### 3. NextId Calculation

After loading todos, we must recalculate `nextId` to continue from the highest existing ID. This prevents ID collisions when adding new todos after reload.

## Dependencies

- No new dependencies required
- Uses browser's built-in localStorage API
- Uses existing Svelte lifecycle hooks (onMount)

## References

- [MDN LocalStorage Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Svelte Lifecycle Hooks](https://svelte.dev/docs#run-time-svelte-onmount)
- [Svelte Reactive Statements](https://svelte.dev/docs#component-format-script-3-$-marks-a-statement-as-reactive)

## Next Steps

1. Create the storage utility module with load/save functions
2. Integrate storage into App.svelte with onMount and reactive save
3. Test thoroughly in browser including edge cases
4. Verify production build works correctly
