# Tell Me a Story Feature

**Status**: draft
**Created**: 2025-11-25
**Package**: project
**Total Complexity**: 32 points
**Phases**: 3
**Tasks**: 8
**Overall Avg Complexity**: 4.0/10

## Complexity Breakdown

| Phase                      | Tasks   | Total Points | Avg Complexity | Max Task   |
| -------------------------- | ------- | ------------ | -------------- | ---------- |
| Phase 1: Story Data        | 2       | 6            | 3.0/10         | 4/10       |
| Phase 2: UI Components     | 4       | 18           | 4.5/10         | 6/10       |
| Phase 3: Testing & Polish  | 2       | 8            | 4.0/10         | 5/10       |
| **Total**                  | **8**   | **32**       | **4.0/10**     | **6/10**   |

## Overview

Add a "Tell me a story" feature to the todo app that displays random short stories in a modal overlay. Users can click a button to view a story, providing a delightful break from task management.

## User Story

As a todo app user
I want to read a random short story
So that I can take a mental break and add some joy to my productivity workflow

## Technical Approach

Implement a story feature using Svelte's reactive patterns and component architecture. Create a stories data module with a collection of short stories, add a "Tell me a story" button to the main UI, and display selected stories in a modal overlay component. Use existing app styling patterns for consistency.

## Key Design Decisions

1. **Local Story Storage**: Stories stored in a JavaScript module rather than fetching from an API to keep the feature simple and fast
2. **Modal Overlay Pattern**: Stories displayed in a modal to maintain focus and provide clear entry/exit UX
3. **Reactive State Management**: Use Svelte's built-in reactivity rather than external state management for simplicity

## Architecture

### File Structure
```
src/
├── App.svelte                 # Modified: Add story button and modal
├── components/
│   └── StoryModal.svelte      # New: Modal component for displaying stories
├── data/
│   └── stories.js             # New: Story data collection
├── app.css                    # Existing: Global styles
└── main.js                    # Existing: App entry point
```

### Integration Points

**Main Application**:
- `src/App.svelte` - Add story button, import StoryModal, handle show/hide state

**Story System**:
- `src/data/stories.js` - Story data and selection logic
- `src/components/StoryModal.svelte` - Story display component

## Implementation Details

### 1. Story Data Module

Create a centralized story data module containing a collection of short, engaging stories with metadata.

**Key Points**:
- Each story has title, content, and author fields
- Export a function to get a random story
- Include 5-10 diverse stories (fables, parables, short tales)
- Keep stories concise (200-500 words)

### 2. Story Modal Component

Build a reusable modal component that displays story content with proper styling and close functionality.

**Key Points**:
- Accepts `story` object and `onClose` callback as props
- Overlay background with click-to-close
- Modal card with title, content, and author attribution
- Escape key to close
- Smooth fade-in animation
- Matches existing app visual style

### 3. App Integration

Integrate the story feature into the main app component with a prominent call-to-action button.

**Key Points**:
- Add "Tell me a story" button below stats section
- Manage `showStory` and `currentStory` state
- Import and conditionally render StoryModal
- Handle story selection and modal display

## Files to Create/Modify

### New Files (2)

1. `src/data/stories.js` - Story data collection and random selection logic
2. `src/components/StoryModal.svelte` - Modal component for story display

### Modified Files (1)

1. `src/App.svelte` - Add story button, import modal, manage story state

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Story Data

**Phase Complexity**: 6 points (avg 3.0/10)

- [ ] 1.1 [2/10] Create stories data module with story collection
  - Create file with array of 5-10 story objects (title, content, author)
  - Include diverse story types: fables, parables, short tales
  - File: `src/data/stories.js`

- [ ] 1.2 [4/10] Add random story selection function
  - Export `getRandomStory()` function that returns a random story from collection
  - Ensure function handles empty array edge case
  - Use `Math.random()` for selection
  - File: `src/data/stories.js`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 2: UI Components

**Phase Complexity**: 18 points (avg 4.5/10)

- [ ] 2.1 [6/10] Create StoryModal component
  - Build modal with overlay background, card container, close button
  - Accept `story` prop (title, content, author) and `onClose` callback
  - Style to match app theme (gradients, border-radius, shadows)
  - Add click-outside-to-close functionality
  - Implement escape key handler for closing
  - File: `src/components/StoryModal.svelte`

- [ ] 2.2 [4/10] Add CSS animations to modal
  - Fade-in animation for overlay (0.2s)
  - Slide-up animation for modal card (0.3s)
  - Use CSS transitions and transform properties
  - File: `src/components/StoryModal.svelte`

- [ ] 2.3 [5/10] Integrate story button in App.svelte
  - Import StoryModal and stories module
  - Add state: `showStory` (boolean), `currentStory` (object or null)
  - Create `handleShowStory()` function to select and display story
  - Add "Tell me a story" button below stats section
  - File: `src/App.svelte`

- [ ] 2.4 [3/10] Wire up modal visibility and close handlers
  - Conditionally render StoryModal when `showStory` is true
  - Pass `currentStory` and close handler to modal
  - Close handler sets `showStory = false`
  - File: `src/App.svelte`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 3: Testing & Polish

**Phase Complexity**: 8 points (avg 4.0/10)

- [ ] 3.1 [5/10] Manual testing of story feature
  - Test: Click "Tell me a story" button displays modal with story
  - Test: Click overlay closes modal
  - Test: Click close button closes modal
  - Test: Press Escape key closes modal
  - Test: Stories are randomized (click multiple times)
  - Test: Modal styling matches app theme
  - Test: Animations work smoothly
  - Verify: No console errors

- [ ] 3.2 [3/10] Code review and refinement
  - Review code for consistency with existing patterns
  - Ensure proper indentation and formatting
  - Check for accessibility (button labels, modal focus)
  - Verify responsive behavior on mobile widths
  - File: All modified files

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

## Testing Strategy

### Unit Tests

No unit tests required for this feature (Svelte app has no test infrastructure in package.json).

### Integration Tests

Manual integration testing covering:
- Story selection randomization
- Modal display/hide state management
- Event handler integration (button click, overlay click, escape key)

### E2E Tests

Manual E2E scenarios:
1. User clicks story button → modal appears with story content
2. User clicks overlay → modal closes
3. User presses Escape → modal closes
4. User clicks button multiple times → sees different stories

## Success Criteria

- [ ] Clicking "Tell me a story" button displays a random story in a modal
- [ ] Modal displays story title, content, and author attribution
- [ ] Modal can be closed by clicking overlay, close button, or pressing Escape
- [ ] Stories are randomized on each button click
- [ ] Modal styling is consistent with app theme (gradients, shadows, colors)
- [ ] Modal animations work smoothly (fade-in, slide-up)
- [ ] Feature works on mobile and desktop viewports
- [ ] No console errors or warnings
- [ ] Code follows existing Svelte patterns in the app

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Build verification
npm run build
# Expected: Build completes successfully with no errors

# Preview production build
npm run preview
# Expected: Server starts, app loads successfully
```

**Manual Verification:**

1. Start application: `npm run dev`
2. Navigate to: `http://localhost:5173` (or port shown in terminal)
3. Verify: "Tell me a story" button appears below stats section
4. Click button: Modal appears with story content (title, text, author)
5. Click overlay: Modal closes
6. Click button again: Different story appears (randomized)
7. Press Escape key: Modal closes
8. Check console: No errors or warnings
9. Test on mobile viewport: Button and modal are responsive

**Feature-Specific Checks:**

- Stories are displayed with proper formatting and readability
- Modal overlay dims the background appropriately
- Close button is clearly visible and clickable
- Modal animations feel smooth and polished
- Story button styling matches existing "Add" button style
- All stories in collection are accessible

## Implementation Notes

### 1. Story Content Guidelines

Choose stories that are:
- Short (200-500 words max)
- Universally appropriate for all audiences
- Diverse in theme (wisdom, nature, kindness, perseverance)
- Attributed to original authors or marked as traditional

### 2. Accessibility Considerations

While not explicitly required, consider:
- Adding `aria-label` to close button
- Trapping focus within modal when open
- Ensuring sufficient color contrast in modal text

### 3. Performance

Feature has minimal performance impact:
- Stories loaded synchronously (small data size)
- No external API calls
- Modal rendered conditionally (not always in DOM)

## Dependencies

- No new dependencies required
- Uses existing Svelte framework and Vite build tools

## References

- Svelte documentation: https://svelte.dev/docs
- Modal accessibility patterns: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- CSS animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations

## Next Steps

1. Create `src/data/stories.js` with story collection
2. Build `src/components/StoryModal.svelte` component
3. Integrate story button and modal into `src/App.svelte`
4. Test all interaction patterns (click, escape, close)
5. Verify styling consistency and responsiveness
6. Run build to ensure no errors
