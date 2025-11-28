# Flag Todo Feature

**Status**: draft
**Type**: issue
**Created**: 2025-11-28
**Package**: example-todo-app
**Total Complexity**: 28 points
**Tasks**: 6
**Avg Complexity**: 4.7/10

## Complexity Summary

| Metric          | Value    |
| --------------- | -------- |
| Total Tasks     | 6        |
| Total Points    | 28       |
| Avg Complexity  | 4.7/10   |
| Max Task        | 6/10     |

## Overview

Add the ability to flag/star individual todos to mark them as important or high-priority. This feature allows users to visually distinguish priority items with a star icon toggle button and subtle visual styling. The implementation follows the existing `completed` boolean pattern for consistency.

## User Story

As a todo app user
I want to flag important todos with a star icon
So that I can quickly identify and prioritize high-priority tasks

## Technical Approach

Add a `flagged` boolean field to the todo data model, mirroring the existing `completed` field pattern. Implement a toggle button with star icons (★/☆) positioned between the todo text and delete button. Apply visual distinction to flagged todos using gold border accent and light yellow background gradient.

**Key Points**:
- Extend todo schema: `{ id, text, completed, flagged }`
- Backward-compatible localStorage migration for existing todos
- Star icon toggle button: ☆ (unflagged) → ★ (flagged)
- Gold color theme (#f39c12) for flagged todos
- Optional: Sort flagged todos to top and add stats counter

## Files to Create/Modify

### New Files (0)

None - all changes to existing file

### Modified Files (1)

1. `src/App.svelte` - Add flagged field to schema, toggle function, UI button, CSS styling, and optional enhancements

## Tasks

**IMPORTANT: Execute every task in order, top to bottom**

- [ ] [task-1] [4/10] Update data model and add storage migration
  - Modify `addTodo()` function to include `flagged: false` in new todo objects (line 120)
  - Add migration logic in `loadTodosFromStorage()` after validation (after line 72)
  - Migration: `data.todos = data.todos.map(todo => ({ ...todo, flagged: todo.flagged ?? false }))`
  - File: `src/App.svelte`

- [ ] [task-2] [3/10] Implement toggleFlag function
  - Add `toggleFlag(id)` function after `toggleTodo()` (after line 129)
  - Use same pattern: `todos = todos.map(todo => todo.id === id ? { ...todo, flagged: !todo.flagged } : todo)`
  - File: `src/App.svelte`

- [ ] [task-3] [6/10] Add flag button to todo item markup
  - Update `<li>` element to add `class:flagged={todo.flagged}` (line 172)
  - Insert flag button between label and delete button (after line 179)
  - Button structure: `<button on:click={() => toggleFlag(todo.id)} class="flag-button" class:flagged={todo.flagged} aria-label={todo.flagged ? 'Unflag todo' : 'Flag todo'}>{todo.flagged ? '★' : '☆'}</button>`
  - File: `src/App.svelte`

- [ ] [task-4] [5/10] Add CSS styling for flag button and flagged todos
  - Add `.flag-button` styles in `<style>` section (after line 321)
  - Include base styles, hover effects, and flagged/unflagged color states
  - Gold color: `#f39c12` for flagged, `#bbb` for unflagged
  - Add `.todo-item.flagged` styles for visual distinction
  - Border-left: `4px solid #f39c12`, background gradient: `linear-gradient(to right, #fff8e1 0%, #f9f9f9 100%)`
  - File: `src/App.svelte`

- [ ] [task-5] [5/10] Add optional flagged count to stats section
  - Add reactive statement: `$: flaggedTodos = todos.filter(todo => todo.flagged).length` (after line 142)
  - Update stats markup to include `<span class="stat">Flagged: {flaggedTodos}</span>` (after line 156)
  - File: `src/App.svelte`

- [ ] [task-6] [5/10] Add optional sorting to show flagged todos at top
  - Add reactive statement: `$: sortedTodos = [...todos].sort((a, b) => { if (a.flagged === b.flagged) return 0; return a.flagged ? -1 : 1; })` (after line 142)
  - Update `{#each}` loop to use `sortedTodos` instead of `todos` (line 171)
  - Change to: `{#each sortedTodos as todo (todo.id)}`
  - File: `src/App.svelte`

## Testing Strategy

### Unit Tests

**Manual testing approach (no test framework in project)**:
- Create new todo and verify `flagged: false` by default
- Click flag button and verify star icon changes ☆ → ★
- Verify flagged todo shows gold border and yellow background
- Reload page and verify flagged state persists
- Test with existing todos from localStorage (should migrate gracefully)
- Verify flag works independently of completed state

### Integration Tests

**Browser testing**:
- Test localStorage persistence across page reloads
- Test with localStorage disabled (private browsing)
- Verify no console errors or warnings
- Test flag + complete combinations
- Test flag + delete operations

## Success Criteria

- [ ] New todos created with `flagged: false` by default
- [ ] Flag button toggles between ☆ and ★ icons
- [ ] Flagged todos have visual distinction (gold border, yellow background)
- [ ] Flag state persists in localStorage after page reload
- [ ] Existing todos migrate gracefully with flagged defaulting to false
- [ ] Flag button has hover effect and smooth transitions
- [ ] Optional: Flagged count appears in stats section
- [ ] Optional: Flagged todos sorted to top of list
- [ ] No console errors or validation warnings

## Validation

**Automated:**

```bash
# Build
npm run build
# Expected: Build succeeds with no errors

# Dev server
npm run dev
# Expected: App runs on http://localhost:5173
```

**Manual:**

1. Start app: `npm run dev`
2. Navigate to: http://localhost:5173
3. Add new todo and verify unflagged (☆) by default
4. Click flag button and verify:
   - Icon changes to ★
   - Gold border appears on left
   - Background changes to light yellow gradient
5. Reload page and verify flagged state persists
6. Test existing todos load without errors
7. Verify stats show correct flagged count (if implemented)
8. Verify flagged todos appear at top (if sorting implemented)

## Implementation Notes

### Storage Migration Strategy

The migration approach uses the nullish coalescing operator (`??`) to add the `flagged` field to existing todos that don't have it. This is non-destructive and allows old data to work immediately without requiring localStorage clearing.

### Icon Choice Rationale

Unicode star characters (☆/★) were chosen over emoji or icon libraries because:
- No external dependencies required
- Universal "important/favorite" UX pattern
- Cross-platform consistency
- Accessible to screen readers

### Svelte Reactivity Requirements

All array updates must create new array references to trigger Svelte's reactivity system. Using `.map()`, spread operators, and `.filter()` ensures proper reactive updates and automatic localStorage persistence via the existing `$: if (todos)` watcher.

## Dependencies

- No new dependencies

## References

- Plan document: `/Users/jnarowski/.claude/plans/calm-tinkering-garden.md`
- Existing pattern: `completed` boolean field implementation
- Storage key: `svelte-todo-app-v1` (localStorage)
