# Task Priority Feature

**Status**: review
**Created**: 2025-11-26
**Package**: example-todo-app
**Total Complexity**: 23 points
**Phases**: 3
**Tasks**: 9
**Overall Avg Complexity**: 2.6/10

## Complexity Breakdown

| Phase                       | Tasks | Total Points | Avg Complexity | Max Task |
| --------------------------- | ----- | ------------ | -------------- | -------- |
| Phase 1: Data Model         | 2     | 5            | 2.5/10         | 3/10     |
| Phase 2: UI Implementation  | 5     | 14           | 2.8/10         | 4/10     |
| Phase 3: Sorting & Filtering| 2     | 4            | 2.0/10         | 2/10     |
| **Total**                   | **9** | **23**       | **2.6/10**     | **4/10** |

## Overview

Add priority levels (Low, Medium, High, Urgent) to tasks, allowing users to assign and change priority for each task. Tasks will be visually distinguished by priority with color coding and can be sorted by priority level.

## User Story

As a todo app user
I want to assign priority levels to my tasks
So that I can focus on the most important items first and organize my work more effectively

## Technical Approach

Extend the existing task data model with a priority field, add a dropdown selector in the UI for priority assignment, implement color-coded visual indicators, and add sorting functionality to order tasks by priority level. All changes are confined to the single `App.svelte` component since this is a simple in-memory application.

## Key Design Decisions

1. **Priority Levels**: Use 4 levels (Low, Medium, High, Urgent) with numeric values (1-4) for easy sorting
2. **Default Priority**: New tasks default to "Medium" priority for balanced urgency
3. **Color Coding**: Use standard priority colors (gray/blue/orange/red) for visual distinction
4. **In-place Editing**: Add priority dropdown directly in task item for quick changes

## Architecture

### File Structure

```
src/
  App.svelte       # Main component (add priority field, UI controls, sorting)
  app.css          # Global styles (may need priority color variables)
  main.js          # Entry point (no changes)
```

### Integration Points

**Task Data Model**:
- `App.svelte` - Add priority field to task objects (lines 8, 14)

**UI Components**:
- `App.svelte` - Add priority dropdown in input section (after line 50)
- `App.svelte` - Add priority badge/indicator in task list (after line 62)
- `App.svelte` - Add priority selector in each task item (after line 62)

**Sorting Logic**:
- `App.svelte` - Add reactive statement for priority-sorted tasks (after line 30)

## Implementation Details

### 1. Priority Data Model

Add priority field to task objects with 4 levels:
- `1` = Low (gray)
- `2` = Medium (blue) - default
- `3` = High (orange)
- `4` = Urgent (red)

**Key Points**:
- Store as number for easy sorting
- Include in task creation
- Default to Medium (2) for new tasks
- Display as text labels in UI

### 2. Priority Input UI

Add priority dropdown next to the "Add" button in the input section:
- Dropdown with 4 options
- Syncs with `newTodoPriority` state variable
- Resets to Medium after adding task

**Key Points**:
- Use native `<select>` element for simplicity
- Style to match existing button aesthetic
- Clear visual labels for each priority level

### 3. Priority Display

Show priority in task list items with:
- Color-coded badge/pill showing priority level
- Small, compact design that doesn't crowd the layout
- Consistent color scheme across all priority levels

**Key Points**:
- Use CSS classes for color coding
- Position between checkbox and text
- Consider accessibility (not just color)

### 4. Priority Editing

Allow changing priority for existing tasks:
- Small dropdown in each task item
- Updates priority on change
- Preserves other task properties

**Key Points**:
- Inline editing without modal
- Immediate update on selection
- Minimal visual disruption

### 5. Priority Sorting

Sort tasks by priority (Urgent → High → Medium → Low) while maintaining completed/active separation:
- Active tasks sorted by priority first
- Completed tasks shown after active tasks
- Secondary sort by creation order (oldest first)

**Key Points**:
- Use reactive statement for automatic sorting
- Maintain completed vs active separation
- Descending priority order (highest first)

## Files to Create/Modify

### New Files (0)

None - all changes to existing files

### Modified Files (1)

1. `src/App.svelte` - Add priority field, UI controls, sorting logic, and styling

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Data Model

**Phase Complexity**: 5 points (avg 2.5/10)

- [x] 1.1 [2/10] Add priority field to task data model
  - Update task creation in `addTodo()` function to include `priority: newTodoPriority`
  - Add `newTodoPriority` state variable (default: 2 for Medium)
  - Update task object structure: `{ id, text, completed, priority }`
  - File: `src/App.svelte`
  - Lines: ~2-10

- [x] 1.2 [3/10] Add priority update function
  - Create `updatePriority(id, priority)` function to change task priority
  - Similar pattern to `toggleTodo()` - map over todos and update matching id
  - Preserve all other task properties
  - File: `src/App.svelte`
  - Lines: ~22-27

#### Completion Notes

- Added `newTodoPriority` state variable with default value of 2 (Medium)
- Updated `addTodo()` to include priority in task objects and reset priority after adding
- Created `updatePriority(id, priority)` function following the same pattern as `toggleTodo()`
- Data model is now ready for UI implementation

### Phase 2: UI Implementation

**Phase Complexity**: 14 points (avg 2.8/10)

- [x] 2.1 [2/10] Add priority dropdown to input section
  - Add `<select>` element between input and "Add" button
  - Options: Low (1), Medium (2), High (3), Urgent (4)
  - Bind to `newTodoPriority` state variable
  - Reset to 2 (Medium) after adding task
  - File: `src/App.svelte`
  - Lines: ~42-51

- [x] 2.2 [3/10] Add priority badge display in task items
  - Add priority badge/pill between checkbox and text
  - Display text labels: "Low", "Medium", "High", "Urgent"
  - Apply CSS class based on priority level for color coding
  - File: `src/App.svelte`
  - Lines: ~54-66

- [x] 2.3 [4/10] Add inline priority editor in task items
  - Add small `<select>` dropdown in each task item
  - Position after priority badge or near delete button
  - Call `updatePriority()` on change
  - Show current priority as selected option
  - File: `src/App.svelte`
  - Lines: ~54-66

- [x] 2.4 [3/10] Add priority color styles
  - Add CSS classes for priority levels: `.priority-low`, `.priority-medium`, `.priority-high`, `.priority-urgent`
  - Colors: gray (#6c757d), blue (#007bff), orange (#fd7e14), red (#dc3545)
  - Add styles for priority badge (small, rounded, inline)
  - Add styles for priority dropdown (compact, minimal)
  - File: `src/App.svelte`
  - Lines: ~75-212 (style section)

- [x] 2.5 [2/10] Style priority input dropdown
  - Match existing input section aesthetic
  - Add border, border-radius, padding
  - Ensure good contrast and readability
  - Responsive sizing (don't break mobile layout)
  - File: `src/App.svelte`
  - Lines: ~75-212 (style section)

#### Completion Notes

- Added priority dropdown to input section with 4 priority levels (Low, Medium, High, Urgent)
- Implemented priority badge display between checkbox and task text with color coding
- Added inline priority editor dropdown in each task item for easy priority changes
- Styled all priority UI elements to match existing design with consistent colors and hover effects
- Used numeric classes (.priority-1 through .priority-4) for flexible CSS application

### Phase 3: Sorting & Filtering

**Phase Complexity**: 4 points (avg 2.0/10)

- [x] 3.1 [2/10] Add priority-based sorting for active tasks
  - Add reactive statement to sort todos by priority (descending)
  - Sort active tasks: Urgent (4) → High (3) → Medium (2) → Low (1)
  - Keep completed tasks at the end
  - Secondary sort by id (creation order)
  - File: `src/App.svelte`
  - Lines: ~29-31

- [x] 3.2 [2/10] Update stats to show priority distribution
  - Optional: Add count of tasks by priority level
  - Display alongside existing Active/Completed stats
  - Format: "Urgent: X, High: Y, Medium: Z, Low: W"
  - File: `src/App.svelte`
  - Lines: ~36-40

#### Completion Notes

- Implemented comprehensive sorting with three-level criteria: completion status, priority (descending), and creation order
- Added priority distribution stats that only appear when there are active tasks
- Sorting is reactive and updates automatically when tasks are added, completed, or priority is changed
- Priority stats show count for each priority level among active tasks only

## Testing Strategy

### Unit Tests

No unit tests required for this simple app (no test framework configured).

### Integration Tests

No integration tests required (no test framework).

### E2E Tests

**Manual E2E Testing** - Verify user flows:

1. Create task with different priorities
2. Change priority of existing task
3. Verify visual distinction (colors)
4. Verify sorting order
5. Complete tasks and verify priority persists
6. Delete tasks with different priorities

## Success Criteria

- [ ] Can assign priority when creating new task
- [ ] Can change priority of existing task
- [ ] Priority is visually indicated with color coding
- [ ] Tasks are sorted by priority (Urgent first, Low last)
- [ ] Completed tasks appear after active tasks regardless of priority
- [ ] Priority dropdown is styled consistently with app design
- [ ] Priority persists when toggling task completion
- [ ] No console errors or warnings
- [ ] Application builds successfully

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Build verification
npm run build
# Expected: Successful build with no errors

# Development mode (visual verification)
npm run dev
# Expected: Dev server starts on localhost:5173
```

**Manual Verification:**

1. Start application: `npm run dev`
2. Navigate to: `http://localhost:5173`
3. Verify: Priority dropdown appears next to Add button
4. Test: Create tasks with different priorities (Low, Medium, High, Urgent)
5. Verify: Tasks show colored priority badges
6. Test: Change priority using dropdown in task items
7. Verify: Tasks re-sort automatically by priority
8. Test: Complete a high priority task
9. Verify: Completed task moves to bottom, priority visible but dimmed
10. Test: Delete tasks with various priorities
11. Check console: No errors or warnings

**Feature-Specific Checks:**

- Verify color coding: Low (gray), Medium (blue), High (orange), Urgent (red)
- Verify sorting order: Urgent → High → Medium → Low
- Verify new tasks default to Medium priority
- Verify priority dropdown resets to Medium after adding task
- Verify completed tasks are grouped separately from active tasks
- Verify priority persists across completion/uncompletion

## Implementation Notes

### 1. Color Accessibility

Use border/icon in addition to color for accessibility. Consider adding a small icon or border to priority badges so colorblind users can distinguish priorities.

### 2. Mobile Responsiveness

Test priority dropdowns on mobile devices. The inline priority editor may need smaller font size or adjusted width to prevent layout breaking on small screens.

### 3. Data Migration

Since this is an in-memory app with no persistence, existing tasks will not have priority field. Consider adding default priority (2) when mapping over existing todos, or accept that page refresh clears all data anyway.

## Dependencies

- No new dependencies required
- Uses native HTML `<select>` element
- Uses existing Svelte reactivity
- Uses existing CSS styling patterns

## References

- Existing todo implementation: `src/App.svelte`
- Priority color standards: Bootstrap alert colors
- Svelte reactivity: https://svelte.dev/tutorial/reactive-declarations

## Next Steps

1. Add priority field to task data model with default value
2. Create updatePriority function following toggleTodo pattern
3. Add priority dropdown to input section (between input and Add button)
4. Add priority badge display in task items with color coding
5. Add inline priority editor dropdown in task items
6. Implement priority-based sorting with reactive statement
7. Style all priority UI elements to match app design
8. Test all priority operations (create, update, sort, complete, delete)
9. Verify visual design and color coding
10. Verify no console errors and successful build
