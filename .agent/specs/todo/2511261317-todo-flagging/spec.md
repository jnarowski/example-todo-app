# Todo Flagging Feature

**Status**: review
**Created**: 2025-11-26
**Package**: project
**Total Complexity**: 23 points
**Phases**: 3
**Tasks**: 7
**Overall Avg Complexity**: 3.3/10

## Complexity Breakdown

| Phase           | Tasks   | Total Points | Avg Complexity | Max Task   |
| --------------- | ------- | ------------ | -------------- | ---------- |
| Phase 1: Data Model | 2     | 5            | 2.5/10         | 3/10       |
| Phase 2: UI Implementation | 3     | 11           | 3.7/10         | 5/10       |
| Phase 3: Filtering & Stats | 2     | 7            | 3.5/10         | 4/10       |
| **Total**       | **7**   | **23**       | **3.3/10**     | **5/10**   |

## Overview

Add the ability to flag/star individual todos to mark them as important or high priority. Flagged todos will be visually distinguished with a flag icon, can be toggled on/off, and will be tracked in the statistics display. This feature allows users to quickly identify and prioritize important tasks.

## User Story

As a todo app user
I want to flag important todos
So that I can quickly identify and prioritize high-priority tasks at a glance

## Technical Approach

Add a boolean `flagged` property to the todo data model and implement UI controls (flag button with icon) to toggle this state. Update the reactive statistics to track flagged todo count. Add visual styling to distinguish flagged todos from regular ones. Optionally implement filtering to show only flagged todos.

## Key Design Decisions

1. **Boolean Flag Property**: Use simple boolean rather than priority levels to keep the feature lightweight and easy to use
2. **Visual Indicator**: Use a star/flag icon button inline with each todo item for easy toggling without modals or extra clicks
3. **Statistics Integration**: Add flagged count to existing stats bar to provide quick overview of important tasks
4. **Persistent State**: Store flagged state in the todo object so it persists with add/delete operations

## Architecture

### File Structure
```
src/
  App.svelte          # Main app component (modified)
package.json          # Project dependencies (no changes)
```

### Integration Points

**Todo Data Model**:
- `src/App.svelte` (lines 2-8) - Add `flagged: false` to todo object structure

**UI Components**:
- `src/App.svelte` (lines 54-67) - Add flag button to todo item template
- `src/App.svelte` (lines 29-31) - Add flagged todos reactive statement
- `src/App.svelte` (lines 37-40) - Add flagged stat display

**Event Handlers**:
- `src/App.svelte` (lines 6-27) - Add `toggleFlag` function

## Implementation Details

### 1. Data Model Extension

Extend the todo object structure to include a `flagged` boolean property. When creating new todos in the `addTodo` function, initialize `flagged` to `false`. Ensure the flag state is preserved when toggling completion status.

**Key Points**:
- Add `flagged: false` to todo object initialization
- Preserve flagged state across all todo operations
- No migration needed since this is a new client-side app

### 2. Toggle Flag Function

Create a `toggleFlag(id)` function that updates the `flagged` property of the specified todo, similar to the existing `toggleTodo` pattern.

**Key Points**:
- Follow existing pattern from `toggleTodo` function
- Use immutable update pattern with map
- Simple boolean toggle logic

### 3. UI Flag Button

Add a flag/star button to each todo item in the list, positioned before or after the checkbox. The button should show a filled icon when flagged and an outline icon when not flagged.

**Key Points**:
- Use Unicode star character (★/☆) or flag emoji (🚩) for icon
- Position button inline with checkbox and text
- Apply conditional styling based on flagged state
- Make button visually distinct but not overwhelming

### 4. Flagged Statistics

Add a reactive statement to calculate the number of flagged todos and display this count in the stats section alongside active and completed counts.

**Key Points**:
- Use Svelte reactive declaration: `$: flaggedTodos = todos.filter(todo => todo.flagged).length`
- Add stat display in the stats section
- Use consistent styling with existing stat badges

### 5. Visual Styling

Style flagged todos and the flag button to make flagged items stand out. Consider background color, border, or icon color changes.

**Key Points**:
- Add `.todo-item.flagged` CSS class for visual distinction
- Style flag button with hover states
- Ensure flagged state is visible but not distracting
- Maintain consistent design language with existing styles

## Files to Create/Modify

### New Files (0)

No new files required.

### Modified Files (1)

1. `src/App.svelte` - Add flagged property to data model, implement toggle function, add flag button UI, add flagged statistics, and add styling for flagged todos

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Data Model

**Phase Complexity**: 5 points (avg 2.5/10)

- [x] 1.1 [2/10] Add `flagged` property to todo data model
  - Update `addTodo` function to initialize new todos with `flagged: false`
  - File: `src/App.svelte` (line 8)
  - Verify todo objects now have: `{ id, text, completed, flagged }`

- [x] 1.2 [3/10] Implement `toggleFlag` function
  - Create new function that toggles the `flagged` boolean for a specific todo ID
  - Follow the same immutable update pattern as `toggleTodo`
  - File: `src/App.svelte` (after line 17)
  - Test by temporarily calling the function in console

#### Completion Notes

- Added `flagged: false` property to todo object initialization in `addTodo` function (line 8)
- Implemented `toggleFlag` function following the same immutable update pattern as `toggleTodo` (lines 19-23)
- Todo objects now have structure: `{ id, text, completed, flagged }`
- No deviations from plan - straightforward implementation

### Phase 2: UI Implementation

**Phase Complexity**: 11 points (avg 3.7/10)

- [x] 2.1 [3/10] Add flag button to todo item template
  - Add a button element within the `.todo-item` list item
  - Position it between checkbox and text label
  - Wire up the `toggleFlag` function to the button's click handler
  - File: `src/App.svelte` (lines 54-67)
  - Use Unicode star: `{todo.flagged ? '★' : '☆'}` or flag emoji `{todo.flagged ? '🚩' : '⚐'}`

- [x] 2.2 [3/10] Add reactive statement for flagged todos count
  - Add: `$: flaggedTodos = todos.filter(todo => todo.flagged).length`
  - File: `src/App.svelte` (after line 31)
  - Verify it updates reactively when flagging/unflagging todos

- [x] 2.3 [5/10] Style the flag button and flagged todos
  - Add CSS for `.flag-button` with hover states and transitions
  - Add CSS for `.todo-item.flagged` to visually distinguish flagged items
  - Consider golden/yellow color for star icon when flagged
  - Optional: Add subtle background color or border to flagged todo items
  - File: `src/App.svelte` (style section, lines 75-212)

#### Completion Notes

- Added flag button between checkbox and text label with star icons (★/☆) (lines 68-70)
- Implemented reactive statement for flagged todos count (line 37)
- Added comprehensive styling for flag button with hover effects and transitions (lines 223-238)
- Styled flagged todos with golden color (#f39c12), left border, and subtle background (#fff9e6) (lines 240-251)
- Flag button scales on hover and flagged star is colored golden - provides clear visual feedback

### Phase 3: Filtering & Stats

**Phase Complexity**: 7 points (avg 3.5/10)

- [x] 3.1 [3/10] Add flagged stat to stats display
  - Add a third stat badge showing flagged count: `<span class="stat">Flagged: {flaggedTodos}</span>`
  - File: `src/App.svelte` (lines 37-40)
  - Maintain consistent spacing and styling with existing stats

- [ ] 3.2 [4/10] Optional: Add filter to show only flagged todos
  - Add filter buttons or toggle to show All/Active/Completed/Flagged todos
  - Update the `#each` loop to filter based on selected view
  - Add state variable for current filter: `let filter = 'all'`
  - File: `src/App.svelte`
  - This is optional and can be implemented if time permits
  - **SKIPPED**: Core flagging feature is complete; filtering can be added in a future iteration if needed

#### Completion Notes

- Added "Flagged" stat to stats display showing count of flagged todos (line 47)
- Stats section now shows Active, Completed, and Flagged counts with consistent styling
- Skipped optional filtering feature (task 3.2) to focus on core flagging functionality
- All core requirements for flagging feature are now complete

## Testing Strategy

### Unit Tests

No unit test framework is currently configured. Testing will be manual.

### Integration Tests

No integration test framework is currently configured.

### Manual Testing

1. Add several todos
2. Flag some todos by clicking the flag button
3. Verify flag icon changes state (filled vs outline)
4. Verify flagged count updates in stats
5. Toggle flag off and verify count decrements
6. Verify flagged state persists when toggling completion
7. Delete a flagged todo and verify count updates
8. Test with empty list, all flagged, none flagged scenarios

## Success Criteria

- [ ] Each todo has a clickable flag/star button
- [ ] Flag button shows different icon for flagged vs unflagged state
- [ ] Clicking flag button toggles the flagged state
- [ ] Flagged todos are visually distinguished (color, icon, or styling)
- [ ] Stats section displays count of flagged todos
- [ ] Flagged count updates reactively when flagging/unflagging
- [ ] Flagged state persists when completing/uncompleting todos
- [ ] Flagged state is preserved when adding/deleting other todos
- [ ] UI is responsive and buttons are easily clickable
- [ ] No console errors or warnings

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Build verification
npm run build
# Expected: Build completes successfully with no errors

# Development server (for manual testing)
npm run dev
# Expected: Dev server starts on localhost:5173 or similar
```

**Manual Verification:**

1. Start application: `npm run dev`
2. Navigate to: `http://localhost:5173` (or port shown in console)
3. Verify: Add 3-5 todos
4. Test flagging:
   - Click flag button on first todo
   - Verify icon changes to filled/flagged state
   - Verify "Flagged" count in stats increases to 1
   - Click flag button again to unflag
   - Verify icon returns to outline state
   - Verify "Flagged" count returns to 0
5. Test with multiple flagged todos:
   - Flag 2-3 different todos
   - Verify each shows flagged icon
   - Verify count shows correct number
6. Test interaction with completion:
   - Flag a todo, then mark it complete
   - Verify flag state is preserved
   - Unflag it while completed
   - Verify flag state changes correctly
7. Test deletion:
   - Flag a todo, then delete it
   - Verify flagged count decrements appropriately
8. Check console: No errors or warnings

**Feature-Specific Checks:**

- Flag button is easily clickable and doesn't interfere with checkbox or delete button
- Visual distinction of flagged todos is clear but not overwhelming
- Flagged count in stats is accurate and updates immediately
- Icon choice (star vs flag) is intuitive and visually appealing
- Hover states on flag button provide clear feedback

## Implementation Notes

### 1. Icon Choice

Consider using either a star icon (★/☆) or flag icon (🚩/⚐) for the toggle button. Star may be more intuitive for "favorite/important" while flag is more literal to "flagging". Unicode characters are sufficient for this simple app without needing an icon library.

### 2. Color Scheme

For flagged todos, consider using a golden/yellow color for stars or red for flags to align with common UI patterns. Ensure sufficient contrast for accessibility.

### 3. Optional Enhancements

If time permits after core implementation:
- Add keyboard shortcut to flag selected todo
- Add "Clear all flags" bulk action
- Add filter/view to show only flagged todos
- Add sort option to show flagged todos at top
- Persist todos to localStorage so flags survive page refresh

## Dependencies

- No new dependencies required

## References

- Existing todo app code patterns in `src/App.svelte`
- Svelte reactive statements documentation: https://svelte.dev/docs/svelte-components#script-3-$-marks-a-statement-as-reactive
- Unicode star character reference: U+2605 (★) and U+2606 (☆)

## Next Steps

1. Review and approve this specification
2. Execute Phase 1 tasks to add data model support
3. Execute Phase 2 tasks to implement UI and styling
4. Execute Phase 3 tasks to add statistics and optional filtering
5. Perform manual testing and validation
6. Iterate on styling and UX based on testing feedback
