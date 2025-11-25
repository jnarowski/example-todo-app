# Add Vitest Testing Framework

**Status**: review
**Type**: issue
**Created**: 2025-11-25
**Package**: project
**Total Complexity**: 21 points
**Tasks**: 6
**Avg Complexity**: 3.5/10

## Complexity Summary

| Metric          | Value    |
| --------------- | -------- |
| Total Tasks     | 6        |
| Total Points    | 21       |
| Avg Complexity  | 3.5/10   |
| Max Task        | 5/10     |

## Overview

Add Vitest as the testing framework for this Svelte + Vite project. Vitest is the natural choice for Vite-based projects, providing fast unit testing with native ESM support, TypeScript integration, and Svelte component testing capabilities.

## User Story

As a developer
I want to add Vitest to the project
So that I can write and run unit tests for components and utility functions

## Technical Approach

Set up Vitest with Svelte testing support using @testing-library/svelte. Configure Vitest to work with the existing Vite setup, add necessary test scripts to package.json, and create example tests for the main App.svelte component to demonstrate the testing setup.

**Key Points**:
- Install vitest, @testing-library/svelte, and jsdom dependencies
- Create vitest.config.js extending existing vite.config.js
- Add test scripts to package.json
- Write example tests for App.svelte to validate setup
- Use jsdom as test environment for DOM testing

## Files to Create/Modify

### New Files (2)

1. `vitest.config.js` - Vitest configuration extending Vite config
2. `src/App.test.js` - Example test suite for App component

### Modified Files (2)

1. `package.json` - Add vitest dependencies and test scripts
2. `pnpm-lock.yaml` - Updated dependencies (auto-generated)

## Tasks

- [x] [task-1] [2/10] Install Vitest and testing dependencies
  - Run: `pnpm add -D vitest @testing-library/svelte @testing-library/jest-dom jsdom`
  - Adds vitest as test runner
  - Adds @testing-library/svelte for component testing
  - Adds jsdom for DOM environment simulation

- [x] [task-2] [3/10] Create vitest.config.js configuration file
  - File: `vitest.config.js`
  - Import and extend existing vite.config.js
  - Set test environment to jsdom
  - Configure globals and setupFiles if needed
  - Add include pattern for test files

- [x] [task-3] [2/10] Add test scripts to package.json
  - File: `package.json`
  - Add `"test": "vitest"` for watch mode
  - Add `"test:run": "vitest run"` for CI/single run
  - Add `"test:ui": "vitest --ui"` for optional UI mode

- [x] [task-4] [5/10] Write example test suite for App.svelte
  - File: `src/App.test.js`
  - Test component renders correctly
  - Test adding a new todo
  - Test toggling todo completion
  - Test toggling todo flag
  - Test deleting a todo
  - Test computed stats (active, completed, flagged counts)

- [x] [task-5] [2/10] Run tests to verify setup
  - Run: `pnpm test:run`
  - Expected: All tests pass
  - Verify vitest can import and test Svelte components

- [x] [task-6] [7/10] Add tests for edge cases and interactions
  - File: `src/App.test.js`
  - Test empty state display
  - Test Enter key to add todo
  - Test adding empty/whitespace-only todo (should not add)
  - Test multiple todos with different states
  - Test flagged styling is applied

## Completion Notes

- Successfully installed Vitest 4.0.14 with @testing-library/svelte 5.2.9, @testing-library/jest-dom 6.9.1, and jsdom 27.2.0
- Created vitest.config.js that extends the existing Vite setup with jsdom environment and global test utilities
- Added three test scripts to package.json: `test` for watch mode, `test:run` for CI/single run, and `test:ui` for optional UI mode
- Implemented comprehensive test suite with 9 tests covering all core functionality:
  - Component rendering and initial state
  - Adding todos via button click and Enter key
  - Input validation (empty/whitespace rejection)
  - Toggling completion and flag states
  - Deleting todos
  - Multiple todos with different states
  - CSS class application for flagged and completed states
  - Stats calculations (active, completed, flagged counts)
- All tests pass successfully (9/9 passing)
- Edge cases and interactions were covered in the initial test suite implementation

## Testing Strategy

### Unit Tests

**`src/App.test.js`**:
- Component renders with initial state
- Add todo functionality
- Toggle completion functionality
- Toggle flag functionality
- Delete todo functionality
- Stats calculations (active, completed, flagged)
- Empty state display
- Keyboard interaction (Enter key)
- Input validation (empty/whitespace todos)

## Success Criteria

- [x] Vitest installed and configured
- [x] Test command runs successfully
- [x] App.svelte has comprehensive test coverage
- [x] Tests pass consistently
- [x] Test setup documented in test file comments

## Validation

**Automated:**

```bash
# Install dependencies
pnpm install
# Expected: vitest and testing libraries installed

# Run tests
pnpm test:run
# Expected: All tests pass (minimum 8 tests)

# Run tests in watch mode (for development)
pnpm test
# Expected: Vitest starts in watch mode
```

**Manual:**

1. Start app: `pnpm dev`
2. In another terminal: `pnpm test`
3. Modify a test file
4. Verify: Tests re-run automatically
5. Check: Test output is clear and readable

## Implementation Notes

### Vitest Configuration

Vitest works seamlessly with Vite projects by reusing the existing Vite configuration. The vitest.config.js should extend vite.config.js and only add test-specific settings.

### Testing Library Setup

@testing-library/svelte provides utilities for testing Svelte components in a way that resembles how users interact with them. Use render, fireEvent, and screen queries for component testing.

### Test File Naming

Follow convention of `*.test.js` or `*.spec.js` for test files. Place test files adjacent to source files or in a `__tests__` directory.

## Dependencies

- vitest (test runner)
- @testing-library/svelte (Svelte component testing utilities)
- @testing-library/jest-dom (DOM matchers)
- jsdom (DOM environment for tests)

## References

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Svelte](https://testing-library.com/docs/svelte-testing-library/intro/)
