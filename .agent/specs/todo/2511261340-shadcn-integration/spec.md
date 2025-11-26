# shadcn/ui Integration for Svelte

**Status**: draft
**Created**: 2025-11-26
**Package**: example-todo-app
**Total Complexity**: 47 points
**Phases**: 4
**Tasks**: 11
**Overall Avg Complexity**: 4.3/10

## Complexity Breakdown

| Phase                      | Tasks   | Total Points | Avg Complexity | Max Task   |
| -------------------------- | ------- | ------------ | -------------- | ---------- |
| Phase 1: Setup & Config    | 3       | 15           | 5.0/10         | 6/10       |
| Phase 2: Component Install | 3       | 9            | 3.0/10         | 3/10       |
| Phase 3: Migration         | 4       | 20           | 5.0/10         | 6/10       |
| Phase 4: Verification      | 1       | 3            | 3.0/10         | 3/10       |
| **Total**                  | **11**  | **47**       | **4.3/10**     | **6/10**   |

## Overview

Integrate shadcn-svelte UI component library into the existing Svelte todo app to replace custom CSS styling with professional, accessible, and customizable components. This will provide a consistent design system and improve the overall UI/UX.

## User Story

As a developer
I want to integrate shadcn-svelte into the todo app
So that I can use a professional component library with better accessibility, theming, and maintainability

## Technical Approach

Install and configure shadcn-svelte (the official Svelte port of shadcn/ui) along with its dependencies (Tailwind CSS, tailwind-merge, clsx, etc.). Configure Tailwind with the shadcn theme, set up component aliases, and install essential components (Button, Input, Checkbox, Card). Migrate existing custom-styled elements to use shadcn components while maintaining functionality.

## Key Design Decisions

1. **Use shadcn-svelte**: Official Svelte port of shadcn/ui, designed for Svelte apps
2. **Tailwind CSS**: Required dependency for shadcn-svelte styling system
3. **Component-based approach**: Replace inline styles with reusable shadcn components
4. **Preserve functionality**: Keep all existing todo app logic intact during migration

## Architecture

### File Structure
```
/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── ui/           # shadcn components
│   │   │       ├── button.svelte
│   │   │       ├── input.svelte
│   │   │       ├── checkbox.svelte
│   │   │       └── card.svelte
│   │   └── utils.js          # cn() utility
│   ├── app.css               # Tailwind directives
│   └── App.svelte            # Updated with shadcn components
├── tailwind.config.js        # Tailwind + shadcn config
├── postcss.config.js         # PostCSS config
└── components.json           # shadcn-svelte config
```

### Integration Points

**Build System**:
- `vite.config.js` - No changes needed (Vite already configured)
- `package.json` - Add Tailwind, PostCSS, shadcn-svelte deps

**Styling**:
- `src/app.css` - Replace with Tailwind directives
- `src/App.svelte` - Remove `<style>` block, use shadcn components

**Components**:
- `src/App.svelte` - Migrate to shadcn Button, Input, Checkbox, Card components

## Implementation Details

### 1. Tailwind CSS Setup

Install and configure Tailwind CSS with PostCSS for Vite. Create tailwind.config.js with shadcn theme configuration including custom color palette, border radius, and CSS variables.

**Key Points**:
- Tailwind v3+ required for shadcn-svelte
- PostCSS needed for Vite to process Tailwind
- Config includes shadcn theme with CSS variables
- Dark mode support via class strategy

### 2. shadcn-svelte Configuration

Initialize shadcn-svelte with components.json config file that defines component installation paths, aliases, and Tailwind settings.

**Key Points**:
- Uses `$lib/components/ui` path for components
- Configures TypeScript aliases for imports
- Sets up utility functions location

### 3. Component Installation

Install essential shadcn-svelte components needed for todo app: Button, Input, Checkbox, and Card.

**Key Points**:
- Components are copied into project (not npm packages)
- Each component is fully customizable
- Components use Tailwind classes and CSS variables

### 4. App Migration

Replace custom CSS styling in App.svelte with shadcn components. Remove `<style>` block and update markup to use Button, Input, Checkbox, and Card components.

**Key Points**:
- Maintain all existing functionality
- Keep todo logic unchanged
- Replace only UI elements
- Preserve event handlers

## Files to Create/Modify

### New Files (7)

1. `tailwind.config.js` - Tailwind configuration with shadcn theme
2. `postcss.config.js` - PostCSS configuration for Tailwind
3. `components.json` - shadcn-svelte configuration
4. `src/lib/utils.js` - Utility functions (cn helper)
5. `src/lib/components/ui/button.svelte` - Button component
6. `src/lib/components/ui/input.svelte` - Input component
7. `src/lib/components/ui/checkbox.svelte` - Checkbox component

### Modified Files (2)

1. `package.json` - Add Tailwind, shadcn-svelte dependencies
2. `src/App.svelte` - Replace custom CSS with shadcn components
3. `src/app.css` - Replace with Tailwind directives

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Setup & Configuration

**Phase Complexity**: 15 points (avg 5.0/10)

- [ ] 1.1 [5/10] Install Tailwind CSS and dependencies
  - Install tailwindcss, postcss, autoprefixer, tailwind-merge, clsx, tailwind-variants
  - File: `package.json`
  - Command: `npm install -D tailwindcss postcss autoprefixer && npm install tailwind-merge clsx tailwind-variants`

- [ ] 1.2 [4/10] Configure Tailwind CSS and PostCSS
  - Create tailwind.config.js with shadcn theme configuration
  - Create postcss.config.js with tailwindcss and autoprefixer plugins
  - Update src/app.css with Tailwind directives (@tailwind base, components, utilities)
  - Files: `tailwind.config.js`, `postcss.config.js`, `src/app.css`

- [ ] 1.3 [6/10] Initialize shadcn-svelte configuration
  - Create components.json with shadcn-svelte settings
  - Configure component path as `$lib/components/ui`
  - Set up aliases and utility imports
  - Create src/lib/utils.js with cn() helper function
  - Files: `components.json`, `src/lib/utils.js`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 2: Component Installation

**Phase Complexity**: 9 points (avg 3.0/10)

- [ ] 2.1 [3/10] Install Button component
  - Run: `npx shadcn-svelte@latest add button`
  - Verify component created at `src/lib/components/ui/button.svelte`
  - File: `src/lib/components/ui/button.svelte`

- [ ] 2.2 [3/10] Install Input component
  - Run: `npx shadcn-svelte@latest add input`
  - Verify component created at `src/lib/components/ui/input.svelte`
  - File: `src/lib/components/ui/input.svelte`

- [ ] 2.3 [3/10] Install Checkbox and Card components
  - Run: `npx shadcn-svelte@latest add checkbox card`
  - Verify components created in `src/lib/components/ui/`
  - Files: `src/lib/components/ui/checkbox.svelte`, `src/lib/components/ui/card.svelte`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 3: Migration

**Phase Complexity**: 20 points (avg 5.0/10)

- [ ] 3.1 [4/10] Import shadcn components in App.svelte
  - Add import statements for Button, Input, Checkbox, Card components
  - Add import for Card subcomponents (CardHeader, CardTitle, CardContent)
  - File: `src/App.svelte`

- [ ] 3.2 [6/10] Replace input section with shadcn components
  - Replace custom input with Input component
  - Replace custom button with Button component
  - Preserve bind:value and event handlers
  - File: `src/App.svelte`

- [ ] 3.3 [6/10] Replace todo list items with shadcn components
  - Replace custom checkbox with Checkbox component
  - Replace delete button with Button component variant="destructive"
  - Preserve todo toggle and delete functionality
  - File: `src/App.svelte`

- [ ] 3.4 [4/10] Wrap layout with Card component
  - Replace .container div with Card component
  - Use CardHeader for title and stats
  - Use CardContent for todo list
  - Remove all custom CSS from `<style>` block
  - File: `src/App.svelte`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 4: Verification

**Phase Complexity**: 3 points (avg 3.0/10)

- [ ] 4.1 [3/10] Test all functionality and styling
  - Verify app builds successfully
  - Test add todo functionality
  - Test toggle todo completion
  - Test delete todo
  - Verify responsive design
  - Check for console errors

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

## Testing Strategy

### Unit Tests

No unit tests required for this feature - it's primarily a UI migration. All existing functionality remains unchanged.

### Integration Tests

**Manual Testing**:
- Add new todos and verify they appear in list
- Toggle todo completion and verify checkboxes work
- Delete todos and verify they're removed
- Verify keyboard Enter key still adds todos
- Check stats update correctly

### E2E Tests

Not applicable for this feature.

## Success Criteria

- [ ] Tailwind CSS successfully configured and processing styles
- [ ] shadcn-svelte components installed in `src/lib/components/ui/`
- [ ] All custom CSS removed from App.svelte
- [ ] App uses Button, Input, Checkbox, and Card components
- [ ] All existing todo functionality preserved (add, toggle, delete)
- [ ] Stats display correctly (active and completed counts)
- [ ] App builds without errors or warnings
- [ ] No console errors in browser
- [ ] Responsive design maintained
- [ ] Keyboard shortcuts still work (Enter to add)

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Build verification
npm run build
# Expected: Build completes successfully without errors

# Dev server check
npm run dev
# Expected: Dev server starts on http://localhost:5173
```

**Manual Verification:**

1. Start application: `npm run dev`
2. Navigate to: `http://localhost:5173`
3. Verify: App displays with shadcn components (styled buttons, inputs, cards)
4. Test functionality:
   - Add a new todo using the input and button
   - Toggle a todo's completion status using checkbox
   - Delete a todo using the delete button
   - Verify stats update correctly
   - Press Enter in input field to add todo
5. Check console: No errors or warnings
6. Check responsive design: Resize browser window

**Feature-Specific Checks:**

- Verify Button components have hover effects
- Verify Input component has focus ring
- Verify Checkbox component is accessible (keyboard navigation)
- Verify Card component has proper shadow and border radius
- Check dark mode support (if enabled in Tailwind config)

## Implementation Notes

### 1. shadcn-svelte vs shadcn/ui

shadcn-svelte is the official Svelte port of shadcn/ui. It's specifically designed for Svelte apps and uses the same design principles but with Svelte-specific implementations. Do not attempt to use the React version.

### 2. Component Installation

Components are installed into your project (not as npm packages). This means they're fully customizable and you own the code. The CLI tool simply copies component files into your project.

### 3. CSS Variables

shadcn-svelte uses CSS variables for theming. The Tailwind config includes these variables which can be customized in the theme section.

### 4. TypeScript Support

While this project doesn't use TypeScript, shadcn-svelte components support it. If adding TypeScript later, components will work with proper types.

## Dependencies

- `tailwindcss` (^3.4.0) - Utility-first CSS framework
- `postcss` (^8.4.0) - CSS transformation tool
- `autoprefixer` (^10.4.0) - PostCSS plugin for vendor prefixes
- `tailwind-merge` (^2.0.0) - Merge Tailwind classes without conflicts
- `clsx` (^2.0.0) - Conditional class name utility
- `tailwind-variants` (^0.1.0) - Component variant utility
- `shadcn-svelte` (CLI tool) - Component installation tool

## References

- [shadcn-svelte Documentation](https://www.shadcn-svelte.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Svelte Documentation](https://svelte.dev/docs)

## Next Steps

1. Install Tailwind CSS and dependencies
2. Configure Tailwind and PostCSS
3. Initialize shadcn-svelte configuration
4. Install required shadcn components
5. Migrate App.svelte to use shadcn components
6. Remove custom CSS
7. Test all functionality
8. Verify build succeeds
