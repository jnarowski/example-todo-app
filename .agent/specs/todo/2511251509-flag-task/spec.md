# Flag Task Feature

**Status**: review
**Created**: 2025-11-25
**Package**: example-todo-app
**Total Complexity**: 18 points
**Phases**: 3
**Tasks**: 7
**Overall Avg Complexity**: 2.6/10

## Complexity Breakdown

| Phase                    | Tasks | Total Points | Avg Complexity | Max Task |
| ------------------------ | ----- | ------------ | -------------- | -------- |
| Phase 1: Data Model      | 2     | 4            | 2.0/10         | 2/10     |
| Phase 2: UI Components   | 3     | 9            | 3.0/10         | 4/10     |
| Phase 3: Visual Polish   | 2     | 5            | 2.5/10         | 3/10     |
| **Total**                | **7** | **18**       | **2.6/10**     | **4/10** |

## Overview

Add the ability to flag/star important tasks to help users prioritize their work. Flagged tasks will be visually distinguished with a star icon and can be toggled on/off. This feature allows users to highlight critical or high-priority items in their todo list.

## User Story

As a user
I want to flag important tasks
So that I can quickly identify and focus on high-priority items in my todo list

## Technical Approach

Extend the existing todo data model to include a `flagged` boolean property. Add a clickable star icon button to each todo item in the UI. Use conditional styling to visually distinguish flagged tasks. Implement toggle functionality similar to the existing `toggleTodo` pattern for completed status.

## Key Design Decisions

1. **Data Model Extension**: Add `flagged: boolean` property to todo objects, defaulting to `false` to maintain backwards compatibility
2. **Visual Design**: Use a star icon (⭐/☆) that toggles between filled and outline states, positioned between checkbox and text
3. **Interaction Pattern**: Follow existing toggle pattern - clicking the star toggles the flag state without affecting completion status

## Architecture

### File Structure

```
src/
└── App.svelte (modified)
    ├── Script section - add flagged property and toggle function
    ├── Template section - add star icon button
    └── Style section - add flagged task styling
```

### Integration Points

**Component State**:

- `App.svelte` - Add `flagged` property to todo objects
- `App.svelte` - Add `toggleFlag()` function
- `App.svelte` - Add reactive stats for flagged count

**UI Layer**:

- `App.svelte` - Add star icon button to todo-item template
- `App.svelte` - Add CSS for flag button and flagged state

## Implementation Details

### 1. Data Model Extension

Add a `flagged` boolean property to each todo object in the component state. This property will track whether a task is flagged as important.

**Key Points**:

- Initialize new todos with `flagged: false`
- Ensure flagged state persists through todo operations (toggle complete, etc.)
- Use the same immutable update pattern as existing todo operations

### 2. Toggle Flag Function

Create a new function `toggleFlag(id)` that updates the flagged state of a specific todo, following the same pattern as `toggleTodo()`.

**Key Points**:

- Map through todos array to find matching id
- Toggle the `flagged` property immutably
- Update todos array to trigger Svelte reactivity

### 3. UI Components

Add visual elements to display and interact with the flag state:

- Star icon button (⭐ filled when flagged, ☆ outline when not flagged)
- Position between checkbox and task text
- Clickable to toggle flag state
- Visual styling for flagged tasks (e.g., background highlight)

**Key Points**:

- Use Unicode star characters (⭐ U+2B50, ☆ U+2606) for simplicity
- Style button to remove default button appearance
- Add hover effects for better UX
- Consider adding a subtle background color to flagged tasks

### 4. Statistics Display

Add a stat counter for flagged tasks in the existing stats section, showing how many tasks are currently flagged.

**Key Points**:

- Use Svelte reactive statement ($:) to compute count
- Display alongside existing Active/Completed stats
- Update automatically as tasks are flagged/unflagged

## Files to Create/Modify

### New Files (0)

No new files required.

### Modified Files (1)

1. `src/App.svelte` - Add flagged property to data model, toggle function, star button UI, and styling for flagged tasks

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Data Model

**Phase Complexity**: 4 points (avg 2.0/10)

- [x] 1.1 [2/10] Add `flagged` property to todo data model
  - Update `addTodo()` function to initialize `flagged: false` for new todos
  - Update line 8: `todos = [...todos, { id: nextId++, text: newTodo, completed: false, flagged: false }];`
  - File: `src/App.svelte`
- [x] 1.2 [2/10] Create `toggleFlag()` function
  - Add function after `toggleTodo()` around line 18
  - Implement: `function toggleFlag(id) { todos = todos.map(todo => todo.id === id ? { ...todo, flagged: !todo.flagged } : todo); }`
  - File: `src/App.svelte`

#### Completion Notes

- What was implemented: Added `flagged: false` property to todo data model in `addTodo()` function and created `toggleFlag()` function following the same pattern as `toggleTodo()`
- Deviations from plan (if any): None - implemented exactly as specified
- Important context or decisions: Used immutable update pattern consistent with existing Svelte reactivity model
- Known issues or follow-ups (if any): None

### Phase 2: UI Components

**Phase Complexity**: 9 points (avg 3.0/10)

- [x] 2.1 [3/10] Add reactive stat for flagged todos count
  - Add after line 30: `$: flaggedTodos = todos.filter(todo => todo.flagged).length;`
  - File: `src/App.svelte`
- [x] 2.2 [2/10] Add flagged stat to stats display
  - Insert after line 39 (in stats div): `<span class="stat">Flagged: {flaggedTodos}</span>`
  - File: `src/App.svelte`
- [x] 2.3 [4/10] Add star icon button to todo items
  - Insert after checkbox input (around line 61), before label
  - Add: `<button on:click={() => toggleFlag(todo.id)} class="flag-button" title="{todo.flagged ? 'Unflag' : 'Flag'} task">{todo.flagged ? '⭐' : '☆'}</button>`
  - File: `src/App.svelte`

#### Completion Notes

- What was implemented: Added reactive flaggedTodos counter, displayed it in stats section, and added star button between checkbox and label with conditional rendering (⭐ when flagged, ☆ when not)
- Deviations from plan (if any): None - implemented exactly as specified
- Important context or decisions: Star button includes accessible title attribute for better UX
- Known issues or follow-ups (if any): None

### Phase 3: Visual Polish

**Phase Complexity**: 5 points (avg 2.5/10)

- [x] 3.1 [3/10] Add CSS styling for flag button
  - Add after `.delete-button` styles (around line 204)
  - Include: base button styles, hover effect, transition, cursor pointer
  - Styles: Remove default button styling, set font-size: 20px, transparent background, no border, add hover scale transform
  - File: `src/App.svelte`
- [x] 3.2 [2/10] Add visual distinction for flagged tasks
  - Add CSS class modifier for flagged tasks
  - Add: `.todo-item.flagged { background: #fffbea; border-left: 4px solid #f59e0b; }`
  - Update todo-item template to include: `class:flagged={todo.flagged}`
  - File: `src/App.svelte`

#### Completion Notes

- What was implemented: Added flag button CSS with transparent background, hover scale effect, and transition. Added flagged task styling with yellow background and orange border-left accent
- Deviations from plan (if any): None - implemented exactly as specified
- Important context or decisions: Used subtle yellow background (#fffbea) and orange accent (#f59e0b) to convey importance without being overwhelming
- Known issues or follow-ups (if any): None

## Testing Strategy

### Unit Tests

No formal unit tests exist in this project. Testing will be manual and verified through the Validation section.

### Integration Tests

Not applicable - single component application.

### E2E Tests (if applicable)

Not applicable for this simple feature. Manual testing covers all scenarios.

## Success Criteria

- [ ] Todo items have a clickable star icon that toggles between filled (⭐) and outline (☆) states
- [ ] Flagged tasks are visually distinguished with a highlighted background
- [ ] Flag state persists when toggling completion status
- [ ] Flag state persists when adding/deleting other todos
- [ ] Stats section shows accurate count of flagged todos
- [ ] Star button has hover effects for better UX
- [ ] Application builds without errors
- [ ] No console errors or warnings

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Build verification
npm run build
# Expected: BUILD SUCCESS with no errors

# Type checking
npx svelte-check
# Expected: No type errors (if svelte-check is installed)

# Development mode
npm run dev
# Expected: Server starts on http://localhost:5173
```

**Manual Verification:**

1. Start application: `npm run dev`
2. Navigate to: `http://localhost:5173`
3. Verify: Add a new todo and click the star icon - it should toggle between ☆ and ⭐
4. Test edge cases:
   - Flag a task, then mark it complete - flag should remain
   - Flag a task, then delete it - no errors should occur
   - Flag multiple tasks - count in stats should update correctly
   - Unflag a task - star should change back to outline, count should decrease
5. Check console: No errors or warnings

**Feature-Specific Checks:**

- Star icon is visible and properly positioned in each todo item
- Clicking star toggles the flagged state without affecting checkbox
- Flagged tasks have the yellow/gold highlighted background
- Flagged count in stats updates in real-time
- Hover effects work on star button

## Implementation Notes

### 1. Unicode Star Characters

Using Unicode characters (⭐ and ☆) avoids the need for icon libraries or SVG assets. This keeps the implementation simple and maintains zero dependencies beyond the existing stack.

### 2. Styling Approach

The flagged task styling uses a subtle yellow background (#fffbea) with an orange border-left accent (#f59e0b). This provides clear visual distinction without being overwhelming. Colors were chosen to convey importance/priority.

### 3. Immutable State Updates

Following Svelte's reactivity model, all state updates use immutable patterns (map/filter returning new arrays). This ensures proper reactivity and re-rendering.

## Dependencies

- No new dependencies required

## References

- Existing todo toggle pattern in `src/App.svelte`
- Svelte reactivity documentation: https://svelte.dev/docs/svelte-components#script-3-$-marks-a-statement-as-reactive
- Unicode star characters: U+2B50 (⭐), U+2606 (☆)

## Next Steps

1. Implement Phase 1: Add flagged property to data model and toggle function
2. Implement Phase 2: Add UI components (star button and stats)
3. Implement Phase 3: Add visual styling and polish
4. Run build and manual testing per Validation section
5. Consider future enhancement: Filter view to show only flagged tasks
