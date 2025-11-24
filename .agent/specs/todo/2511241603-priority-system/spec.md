# Priority System for Todo App

**Status**: review
**Created**: 2025-11-24
**Package**: example-todo-app
**Total Complexity**: 38 points
**Phases**: 3
**Tasks**: 8
**Overall Avg Complexity**: 4.8/10

## Complexity Breakdown

| Phase                        | Tasks | Total Points | Avg Complexity | Max Task |
| ---------------------------- | ----- | ------------ | -------------- | -------- |
| Phase 1: Data Model & State  | 3     | 12           | 4.0/10         | 5/10     |
| Phase 2: UI Components       | 4     | 21           | 5.3/10         | 6/10     |
| Phase 3: Sorting & Polish    | 1     | 5            | 5.0/10         | 5/10     |
| **Total**                    | **8** | **38**       | **4.8/10**     | **6/10** |

## Overview

Add a priority system to the todo app that allows users to assign priority levels (Low, Medium, High, Critical) to each task. Tasks will be visually distinguished by priority and can be sorted/filtered accordingly.

## User Story

As a todo app user
I want to assign priorities to my tasks
So that I can focus on the most important work first and better organize my workload

## Technical Approach

Extend the existing todo data model to include a priority field with four levels (low, medium, high, critical). Add a priority selector dropdown to the input section and display priority badges on each todo item with color-coded styling. Implement sorting to show higher priority items first by default.

## Key Design Decisions

1. **Priority Levels**: Use four standard priority levels (Low, Medium, High, Critical) with distinct colors for quick visual identification
2. **Default Priority**: New todos default to "Medium" priority to avoid forcing users to make a choice for routine tasks
3. **Visual Design**: Use color-coded badges with icons to make priority immediately visible without cluttering the interface
4. **Sorting Strategy**: Sort by priority first (Critical → High → Medium → Low), then by creation order within each priority level

## Architecture

### File Structure

```
src/
├── App.svelte          # Main component (modified)
├── app.css             # Global styles (no changes)
└── main.js             # Entry point (no changes)
```

### Integration Points

**Todo Data Model**:

- `App.svelte` (line 2-8) - Extend todo object to include priority field
- `App.svelte` (line 6-11) - Update addTodo function to accept priority

**UI Components**:

- `App.svelte` (line 42-51) - Add priority selector to input section
- `App.svelte` (line 53-67) - Add priority badge display in todo items
- `App.svelte` (line 75-212) - Add priority-specific styling

## Implementation Details

### 1. Priority Data Model

Add a `priority` field to the todo object with four possible values: 'low', 'medium', 'high', 'critical'. Each todo will store its priority level for filtering and visual display.

**Key Points**:

- Priority is a required field with 'medium' as default
- Stored as lowercase string for consistency
- Integrated into the existing reactive state management

### 2. Priority Selector UI

Add a dropdown select element next to the input field allowing users to choose priority when creating todos. The selector should have clear labels and default to "Medium".

**Key Points**:

- Positioned between the input field and Add button
- Color-coded options matching badge colors
- Bound to reactive state variable `newPriority`
- Styled to match existing design language

### 3. Priority Badge Display

Display a colored badge on each todo item showing its priority level. Use distinct colors and optional icons for visual hierarchy.

**Key Points**:

- High contrast colors: Critical (red), High (orange), Medium (blue), Low (gray)
- Positioned to the left of the checkbox for immediate visibility
- Small, unobtrusive design that doesn't overwhelm the interface

### 4. Priority-Based Sorting

Automatically sort todos by priority (highest first) while maintaining creation order within priority levels.

**Key Points**:

- Reactive computed property updates automatically
- Priority order: Critical → High → Medium → Low
- Preserves existing completed/active filtering logic

## Files to Create/Modify

### New Files (0)

No new files required.

### Modified Files (1)

1. `src/App.svelte` - Add priority field to data model, priority selector UI, priority badges, sorting logic, and priority-specific styles

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Data Model & State

**Phase Complexity**: 12 points (avg 4.0/10)

- [x] 1.1 [3/10] Add priority field to todo data model
  - Update the todo object structure to include `priority` field
  - Default value: 'medium'
  - File: `src/App.svelte` (line 8)
  - Modify: `{ id: nextId++, text: newTodo, completed: false }` → `{ id: nextId++, text: newTodo, completed: false, priority: newPriority }`

- [x] 1.2 [4/10] Add reactive priority state variable
  - Create `newPriority` state variable with default value 'medium'
  - File: `src/App.svelte` (add after line 4)
  - Add: `let newPriority = 'medium';`

- [x] 1.3 [5/10] Update addTodo function to handle priority
  - Modify addTodo to use newPriority value
  - Reset newPriority to 'medium' after adding todo
  - File: `src/App.svelte` (line 6-11)
  - Update function to include priority in new todo object and reset priority

#### Completion Notes

- Added `newPriority` state variable with default value 'medium' at line 4
- Updated todo object structure to include priority field in addTodo function (line 9)
- Priority resets to 'medium' after adding a todo (line 11)
- No deviations from plan - implementation matches spec exactly

### Phase 2: UI Components

**Phase Complexity**: 21 points (avg 5.3/10)

- [x] 2.1 [6/10] Add priority selector dropdown to input section
  - Create select element with four priority options
  - Bind to `newPriority` state variable
  - Position between input field and Add button
  - File: `src/App.svelte` (add after line 50, before closing div)
  - Add: `<select bind:value={newPriority} class="priority-select">...</select>`

- [x] 2.2 [5/10] Add priority badge display to todo items
  - Add priority badge element showing the priority level
  - Position before checkbox in todo item layout
  - File: `src/App.svelte` (add after line 55, before checkbox)
  - Add: `<span class="priority-badge priority-{todo.priority}">{todo.priority}</span>`

- [x] 2.3 [5/10] Style priority selector dropdown
  - Add CSS for priority-select class
  - Match existing design system (border radius, padding, colors)
  - Add hover and focus states
  - File: `src/App.svelte` (add to style section after line 148)
  - Add styles for `.priority-select` with gradient border on focus

- [x] 2.4 [5/10] Style priority badges with color coding
  - Add base `.priority-badge` styles
  - Add color-specific styles for each priority level
  - Critical: red (#e74c3c), High: orange (#e67e22), Medium: blue (#3498db), Low: gray (#95a5a6)
  - File: `src/App.svelte` (add to style section after priority-select styles)
  - Add `.priority-badge` base styles and `.priority-critical`, `.priority-high`, `.priority-medium`, `.priority-low` variants

#### Completion Notes

- Added priority selector dropdown with four options (Low, Medium, High, Critical) between input field and Add button (lines 52-57)
- Added priority badge display before checkbox in todo items (lines 64-66)
- Styled priority selector with border transitions, hover/focus states matching existing design system (lines 161-179)
- Styled priority badges with color-coded backgrounds: Critical (red), High (orange), Medium (blue), Low (gray) - all with uppercase text and rounded corners (lines 185-213)
- No deviations from plan - all styling matches the specified color scheme exactly

### Phase 3: Sorting & Polish

**Phase Complexity**: 5 points (avg 5.0/10)

- [x] 3.1 [5/10] Implement priority-based sorting
  - Create computed property that sorts todos by priority
  - Priority order: critical → high → medium → low
  - Maintain creation order within same priority level
  - File: `src/App.svelte` (add after line 30)
  - Add: `$: sortedTodos = [...todos].sort((a, b) => { ... })`
  - Update template (line 54) to iterate over `sortedTodos` instead of `todos`

#### Completion Notes

- Added priority order mapping object (line 35) to define sorting hierarchy
- Created reactive sortedTodos computed property (lines 38-41) that sorts by priority first, then by ID for stable ordering within same priority
- Updated template to iterate over sortedTodos instead of todos (line 71)
- Also updated empty state check to use sortedTodos (line 88)
- No deviations from plan - sorting works exactly as specified with stable sort maintaining creation order

## Testing Strategy

### Unit Tests

This is a simple Svelte app without a test framework configured. Testing will be manual for this implementation.

**Manual Test Cases**:

1. Add todos with different priorities - verify they appear with correct badges
2. Verify todos are sorted by priority correctly
3. Test priority selector interaction and state updates
4. Verify completed todos maintain their priority display

### Integration Tests

No automated integration tests for this implementation. Manual testing covers:

1. Priority persistence through todo lifecycle (create → complete → delete)
2. Priority display with completed todos
3. Priority selector reset after adding todo

### E2E Tests (if applicable)

Not applicable for this simple feature.

## Success Criteria

- [ ] Todos can be assigned one of four priority levels (Low, Medium, High, Critical)
- [ ] Priority selector is visible and functional in the input section
- [ ] Priority badges are displayed on each todo item with correct colors
- [ ] Todos are automatically sorted by priority (Critical first, Low last)
- [ ] Priority selector defaults to "Medium" after adding a todo
- [ ] Completed todos still show their priority level
- [ ] Priority styling is consistent with existing design language
- [ ] No console errors or warnings
- [ ] Application builds successfully

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Build verification
npm run build
# Expected: successful build with no errors

# Development server
npm run dev
# Expected: dev server starts on http://localhost:5173
```

**Manual Verification:**

1. Start application: `npm run dev`
2. Navigate to: `http://localhost:5173`
3. Verify priority selector shows four options (Low, Medium, High, Critical)
4. Add todos with different priorities - verify badges appear with correct colors
5. Verify todos are sorted: Critical → High → Medium → Low
6. Complete a high-priority todo - verify badge still displays correctly
7. Test edge cases:
   - Add multiple todos with same priority (should maintain creation order)
   - Delete todos and verify sorting remains correct
   - Verify priority selector resets to "Medium" after adding todo
8. Check console: No errors or warnings

**Feature-Specific Checks:**

- Priority badge colors are distinct and readable
- Priority selector styling matches existing design system
- Sorting works correctly with mixed priorities and completion states
- Priority selector is keyboard accessible (tab, arrow keys, enter)
- Hover states work correctly on priority selector

## Implementation Notes

### 1. Priority Values and Display

Use lowercase string values ('low', 'medium', 'high', 'critical') internally for consistency. Display with proper capitalization in UI through CSS or template logic.

### 2. Color Choices

Selected colors provide good contrast and follow common conventions:

- Critical (red): Urgent, requires immediate attention
- High (orange): Important, high priority
- Medium (blue): Normal priority, default
- Low (gray): Nice-to-have, low urgency

### 3. Sorting Stability

Use stable sort to maintain creation order within priority levels. The spread operator and sort method preserve insertion order for equal priority values.

### 4. Future Enhancements

This spec focuses on basic priority functionality. Potential future enhancements could include:

- Priority filtering (show only high priority)
- Drag-and-drop reordering
- Priority statistics in the stats section
- Keyboard shortcuts for priority selection
- Local storage persistence

## Dependencies

- No new dependencies required
- Uses existing Svelte reactivity system
- Standard HTML select element for priority picker

## References

- Svelte reactivity: https://svelte.dev/docs#component-format-script-3-$-marks-a-statement-as-reactive
- Existing codebase: `src/App.svelte`
- Color palette based on Material Design and common priority conventions

## Next Steps

1. Implement Phase 1: Add priority field to data model and state
2. Implement Phase 2: Build UI components (selector and badges)
3. Implement Phase 3: Add sorting logic
4. Test thoroughly with various priority combinations
5. Verify styling matches existing design language
6. Run build and dev server to ensure no errors
