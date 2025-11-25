# Task Flag Feature

**Status**: completed
**Created**: 2025-11-25
**Package**: project
**Total Complexity**: 26 points
**Phases**: 3
**Tasks**: 7
**Overall Avg Complexity**: 3.7/10

## Complexity Breakdown

| Phase                     | Tasks | Total Points | Avg Complexity | Max Task |
| ------------------------- | ----- | ------------ | -------------- | -------- |
| Phase 1: Data Model       | 2     | 5            | 2.5/10         | 3/10     |
| Phase 2: UI Implementation| 3     | 13           | 4.3/10         | 5/10     |
| Phase 3: Testing & Polish | 2     | 8            | 4.0/10         | 5/10     |
| **Total**                 | **7** | **26**       | **3.7/10**     | **5/10** |

## Overview

Add the ability to flag individual tasks to elevate their priority, causing flagged tasks to appear at the top of the todo list and be visually distinguished from regular tasks. This feature helps users quickly identify and focus on their most important tasks.

## User Story

As a todo app user
I want to flag specific tasks as high priority
So that I can quickly identify and focus on my most important tasks without them getting lost in the list

## Technical Approach

Extend the existing todo data model with a `flagged` boolean property and implement UI controls to toggle the flag state. Flagged tasks will be sorted to the top of the list and styled with a distinctive visual indicator (flag icon and highlighted background). The implementation follows the existing reactive Svelte patterns used for `completed` state.

## Key Design Decisions

1. **Flag Property**: Add `flagged: boolean` to the todo object model alongside existing `id`, `text`, and `completed` properties
2. **Sorting Strategy**: Use reactive statement to sort todos with flagged items first, maintaining original order within flagged/unflagged groups
3. **Visual Design**: Use a flag icon (⚑/🚩 or SVG) with amber/yellow color scheme to indicate high priority without overwhelming the interface

## Architecture

### File Structure
```
src/
├── App.svelte       (modified - add flag functionality)
├── main.js          (unchanged)
└── app.css          (unchanged - styles in component)
```

### Integration Points

**Todo Management**:
- `src/App.svelte` - Add `flagged` property to todo objects
- `src/App.svelte` - Implement `toggleFlag()` function
- `src/App.svelte` - Add reactive sorting for flagged items
- `src/App.svelte` - Add flag button UI and styling

## Implementation Details

### 1. Todo Data Model Extension

Add `flagged` property to the todo object structure when creating new todos and implement a toggle function similar to the existing `toggleTodo` function.

**Key Points**:
- Initialize `flagged: false` in `addTodo()` function at line 8
- Create new `toggleFlag(id)` function following same pattern as `toggleTodo()`
- Maintain immutability using spread operator for state updates

### 2. List Sorting Logic

Implement reactive sorting to display flagged todos at the top of the list while maintaining the original order within each group (flagged/unflagged).

**Key Points**:
- Use Svelte reactive statement (`$:`) to create sorted todo list
- Sort by `flagged` property (true values first) using `.sort()`
- Preserve insertion order within flagged and unflagged groups

### 3. UI Components

Add flag toggle button to each todo item with appropriate icon and styling. Style flagged todos with visual distinction.

**Key Points**:
- Add flag button between checkbox and delete button
- Use unicode flag emoji (⚑) or create SVG icon
- Add conditional styling for flagged state
- Use amber/yellow color scheme for flag indicator
- Add hover states for better UX

## Files to Create/Modify

### New Files (0)

None - all changes in existing file

### Modified Files (1)

1. `src/App.svelte` - Add flag property to data model, implement toggle function, add sorting logic, add flag button UI and styling

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Data Model

**Phase Complexity**: 5 points (avg 2.5/10)

- [ ] 1.1 [2/10] Add `flagged` property to todo object model
  - Update `addTodo()` function at line 8 to include `flagged: false` in new todo objects
  - File: `src/App.svelte`
  - Update: `todos = [...todos, { id: nextId++, text: newTodo, completed: false, flagged: false }];`

- [ ] 1.2 [3/10] Implement `toggleFlag()` function
  - Add new function after `toggleTodo()` (around line 18)
  - Follow same pattern as `toggleTodo()` using immutable map operation
  - File: `src/App.svelte`
  - Code:
    ```javascript
    function toggleFlag(id) {
      todos = todos.map(todo =>
        todo.id === id ? { ...todo, flagged: !todo.flagged } : todo
      );
    }
    ```

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 2: UI Implementation

**Phase Complexity**: 13 points (avg 4.3/10)

- [ ] 2.1 [4/10] Add reactive sorting for flagged todos
  - Add reactive statement after existing reactive statements (around line 31)
  - Sort todos array with flagged items first
  - File: `src/App.svelte`
  - Code:
    ```javascript
    $: sortedTodos = [...todos].sort((a, b) => {
      if (a.flagged === b.flagged) return 0;
      return a.flagged ? -1 : 1;
    });
    ```
  - Update template to use `sortedTodos` instead of `todos` in the `{#each}` block at line 54

- [ ] 2.2 [4/10] Add flag button to todo item UI
  - Add flag button in todo item template between checkbox/label and delete button (around line 63)
  - Use unicode flag emoji or SVG icon
  - Wire up click handler to `toggleFlag(todo.id)`
  - File: `src/App.svelte`
  - Code:
    ```svelte
    <button
      on:click={() => toggleFlag(todo.id)}
      class="flag-button"
      class:flagged={todo.flagged}
      aria-label={todo.flagged ? "Unflag task" : "Flag task"}
    >
      {todo.flagged ? '🚩' : '⚑'}
    </button>
    ```

- [ ] 2.3 [5/10] Add styling for flag button and flagged state
  - Add CSS rules in `<style>` section (around line 210)
  - Style flag button with amber/yellow color scheme
  - Add hover and active states
  - Add visual distinction for flagged todo items
  - File: `src/App.svelte`
  - Code:
    ```css
    .flag-button {
      padding: 6px 10px;
      font-size: 16px;
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      line-height: 1;
    }

    .flag-button:hover {
      background: #fff9e6;
      border-color: #f39c12;
    }

    .flag-button.flagged {
      background: #fff3cd;
      border-color: #f39c12;
    }

    .todo-item.flagged {
      background: #fffbf0;
      border-left: 3px solid #f39c12;
    }

    .todo-item.flagged:hover {
      background: #fff9e6;
    }
    ```

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 3: Testing & Polish

**Phase Complexity**: 8 points (avg 4.0/10)

- [ ] 3.1 [3/10] Add conditional class binding for flagged todo items
  - Add `class:flagged={todo.flagged}` to todo-item li element at line 55
  - File: `src/App.svelte`
  - Update: `<li class="todo-item" class:completed={todo.completed} class:flagged={todo.flagged}>`

- [ ] 3.2 [5/10] Manual testing and visual polish
  - Run dev server and verify all functionality
  - Test flag toggle on multiple todos
  - Verify sorting behavior (flagged items appear first)
  - Test interaction with completed state
  - Verify visual styling is consistent and accessible
  - Test edge cases: flag all items, unflag all items, flag completed items
  - Command: `npm run dev`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

## Testing Strategy

### Unit Tests

No formal unit tests required for this implementation (project doesn't have test infrastructure). All testing will be manual.

### Integration Tests

Manual integration testing will verify:
- Flag toggle doesn't interfere with completed state
- Sorting maintains correct order
- Multiple flags work correctly
- UI remains responsive with many todos

### E2E Tests

Not applicable - project has no E2E test infrastructure.

## Success Criteria

- [ ] Flagged property is added to todo data model
- [ ] Toggle flag function works correctly
- [ ] Flagged todos appear at the top of the list
- [ ] Flag button is visible and clickable on each todo item
- [ ] Visual distinction is clear between flagged and unflagged items
- [ ] Flag state persists through completion toggling
- [ ] No console errors or warnings
- [ ] Application builds successfully
- [ ] UI is responsive and accessible

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Build verification
npm run build
# Expected: Build completed successfully with no errors

# Type checking
npx tsc --noEmit
# Expected: No type errors (project uses vanilla JS, may skip)

# Linting
npm run lint
# Expected: No linting errors (if lint script exists)
```

**Manual Verification:**

1. Start application: `npm run dev`
2. Navigate to: `http://localhost:5173` (or port shown in console)
3. Verify: Create 3-4 todo items
4. Test: Click flag button on 2nd and 4th items
5. Verify: Flagged items jump to top of list
6. Test: Toggle complete state on flagged item
7. Verify: Item remains flagged and at top
8. Test: Click flag button again to unflag
9. Verify: Item returns to original position
10. Check console: No errors or warnings

**Feature-Specific Checks:**

- Flag icon changes appearance when toggled (⚑ to 🚩)
- Flagged items have amber/yellow visual indicator
- Hover states work correctly on flag button
- Multiple flagged items maintain relative order
- Flag and complete states work independently
- Sorted list updates reactively on flag toggle

## Implementation Notes

### 1. State Independence

The `flagged` property should be completely independent of the `completed` state. Users should be able to flag both active and completed tasks.

### 2. Visual Hierarchy

The visual design uses amber/yellow colors to indicate priority without being overwhelming. The flag icon provides a clear, universally understood metaphor for marking importance.

### 3. Sorting Stability

The sort implementation maintains the original insertion order within flagged and unflagged groups, preventing items from jumping around unpredictably when flags are toggled.

## Dependencies

- No new dependencies required

## References

- Existing Svelte reactive patterns in `src/App.svelte`
- Unicode flag characters: ⚑ (U+2691) and 🚩 (U+1F6A9)

## Next Steps

1. Implement data model changes (add `flagged` property and toggle function)
2. Add reactive sorting logic for flagged items
3. Add flag button UI component with click handler
4. Style flag button and flagged items with amber/yellow theme
5. Manual testing to verify functionality
6. Build and deploy
