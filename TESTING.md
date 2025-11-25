# Testing Guide

This project uses [Vitest](https://vitest.dev/) as the testing framework with [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro) for component testing.

## Quick Start

```bash
# Run tests in watch mode (default)
pnpm test

# Run tests with UI interface
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

## Running Tests

### Watch Mode (Development)

Watch mode automatically reruns tests when files change:

```bash
pnpm test
```

This is the recommended mode during development for instant feedback.

### UI Mode

Vitest UI provides a visual interface for browsing and running tests:

```bash
pnpm test:ui
```

The UI will open in your browser, showing:
- Test hierarchy and organization
- Individual test results
- Code coverage visualization
- Test execution times

### Coverage Reports

Generate a coverage report to see which code is tested:

```bash
pnpm test:coverage
```

Coverage reports are generated in the `coverage/` directory. Open `coverage/index.html` in a browser to view detailed coverage information.

**Coverage Goals:**
- Aim for >80% coverage on application code
- Focus on testing user interactions and business logic
- Don't obsess over 100% coverage - focus on meaningful tests

## Writing Tests

### Test File Location

Tests are colocated with source files using the `.test.js` extension:

```
src/
├── App.svelte
├── App.test.js       <- Tests for App.svelte
└── main.js
```

### Basic Test Structure

```javascript
import { render, fireEvent, screen } from '@testing-library/svelte'
import { describe, it, expect } from 'vitest'
import YourComponent from './YourComponent.svelte'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(YourComponent)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    render(YourComponent)
    const button = screen.getByRole('button', { name: 'Click Me' })

    await fireEvent.click(button)

    expect(screen.getByText('Updated Text')).toBeInTheDocument()
  })
})
```

### Common Testing Patterns

#### 1. Rendering Components

```javascript
it('renders with props', () => {
  render(YourComponent, { props: { title: 'Test Title' } })
  expect(screen.getByText('Test Title')).toBeInTheDocument()
})
```

#### 2. User Interactions

```javascript
it('handles button clicks', async () => {
  render(YourComponent)
  const button = screen.getByRole('button')

  await fireEvent.click(button)

  // Assert expected changes
})

it('handles text input', async () => {
  render(YourComponent)
  const input = screen.getByPlaceholderText('Enter text')

  await fireEvent.input(input, { target: { value: 'Test input' } })

  expect(input.value).toBe('Test input')
})

it('handles keyboard events', async () => {
  render(YourComponent)
  const input = screen.getByRole('textbox')

  await fireEvent.keyDown(input, { key: 'Enter' })

  // Assert expected behavior
})
```

#### 3. Testing State Changes

```javascript
it('updates state correctly', async () => {
  render(YourComponent)

  // Trigger state change
  await fireEvent.click(screen.getByRole('button'))

  // Verify UI reflects new state
  expect(screen.getByText('Updated State')).toBeInTheDocument()
})
```

#### 4. Testing Reactive Statements

```javascript
it('updates computed values', async () => {
  render(TodoApp)

  // Add items
  const input = screen.getByPlaceholderText('What needs to be done?')
  await fireEvent.input(input, { target: { value: 'Test' } })
  await fireEvent.click(screen.getByText('Add'))

  // Check reactive counter
  expect(screen.getByText('Active: 1')).toBeInTheDocument()
})
```

## Query Priority

Use Testing Library queries in this order (most preferred first):

1. **`getByRole`** - Most accessible and semantic
   ```javascript
   screen.getByRole('button', { name: 'Submit' })
   screen.getByRole('textbox', { name: 'Username' })
   ```

2. **`getByLabelText`** - For form inputs with labels
   ```javascript
   screen.getByLabelText('Email')
   ```

3. **`getByPlaceholderText`** - For inputs with placeholders
   ```javascript
   screen.getByPlaceholderText('Enter your name')
   ```

4. **`getByText`** - For text content
   ```javascript
   screen.getByText('Welcome')
   ```

5. **`getByTestId`** - Last resort (avoid when possible)
   ```javascript
   screen.getByTestId('custom-element')
   ```

## Best Practices

### 1. Test User Behavior, Not Implementation

**Good:**
```javascript
it('adds a todo item', async () => {
  render(TodoApp)
  await fireEvent.input(screen.getByPlaceholderText('What needs to be done?'),
    { target: { value: 'Buy milk' } })
  await fireEvent.click(screen.getByText('Add'))

  expect(screen.getByText('Buy milk')).toBeInTheDocument()
})
```

**Avoid:**
```javascript
it('calls addTodo function', async () => {
  // Testing implementation details
  const component = render(TodoApp)
  expect(component.addTodo).toBeDefined()
})
```

### 2. Always Await User Events

Svelte updates may be asynchronous, so always `await` fireEvent calls:

```javascript
// Good
await fireEvent.click(button)

// Bad - may cause flaky tests
fireEvent.click(button)
```

### 3. Use Descriptive Test Names

```javascript
// Good
it('displays error message when submitting empty form')
it('marks todo as completed when checkbox is clicked')

// Bad
it('works')
it('test 1')
```

### 4. Organize Tests with describe Blocks

```javascript
describe('TodoApp', () => {
  describe('Adding todos', () => {
    it('adds todo via button click')
    it('adds todo via Enter key')
    it('clears input after adding')
  })

  describe('Removing todos', () => {
    it('removes todo via delete button')
    it('shows empty state when all todos removed')
  })
})
```

### 5. Test Edge Cases

```javascript
it('prevents adding empty todos')
it('trims whitespace from input')
it('handles multiple rapid clicks')
```

## Debugging Tests

### 1. View Current DOM

```javascript
import { screen } from '@testing-library/svelte'

it('test name', () => {
  render(Component)
  screen.debug() // Prints current DOM to console
})
```

### 2. Query for Elements

```javascript
// See all available queries
screen.getByRole('button') // Throws error if not found
screen.queryByRole('button') // Returns null if not found
screen.findByRole('button') // Returns promise, waits for element
```

### 3. Run Specific Tests

```bash
# Run tests matching pattern
pnpm test App.test.js

# Run only tests with specific name
pnpm test -t "adds a todo"
```

### 4. Use it.only for Focus

```javascript
describe('TodoApp', () => {
  it.only('this test runs', () => {
    // Only this test will execute
  })

  it('this test is skipped', () => {
    // Skipped
  })
})
```

## Configuration

Vitest configuration is in `vitest.config.js`:

```javascript
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,              // No need to import describe, it, expect
      environment: 'jsdom',       // Browser-like environment
      setupFiles: ['./tests/setup.js'], // Test setup file
      coverage: {
        provider: 'v8',          // Coverage provider
        reporter: ['text', 'html'],
      },
    },
  })
)
```

## Common Matchers

```javascript
// Existence
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// Visibility
expect(element).toBeVisible()
expect(element).not.toBeVisible()

// Text content
expect(element).toHaveTextContent('text')
expect(element).toHaveTextContent(/pattern/)

// Form elements
expect(input).toHaveValue('value')
expect(checkbox).toBeChecked()
expect(button).toBeDisabled()

// Attributes
expect(element).toHaveAttribute('aria-label', 'Close')
expect(element).toHaveClass('active')

// Collections
expect(array).toHaveLength(3)
expect(array).toContain(item)
```

## Troubleshooting

### Tests Fail Intermittently

**Problem:** Tests pass sometimes but fail randomly.

**Solution:** Ensure all user events are awaited:
```javascript
await fireEvent.click(button)
await fireEvent.input(input, { target: { value: 'text' } })
```

### Can't Find Element

**Problem:** `Unable to find element` error.

**Solution:**
1. Use `screen.debug()` to see current DOM
2. Verify element exists in the rendered output
3. Try different query methods (getByRole vs getByText)
4. Ensure element isn't hidden by CSS

### Module Import Errors

**Problem:** `Cannot find module` or import errors.

**Solution:**
- Vitest uses the same Vite config, so imports should work
- Check that file paths are correct
- Ensure dependencies are installed (`pnpm install`)

### Coverage Not Generated

**Problem:** Coverage reports are empty or missing files.

**Solution:**
- Ensure tests actually import and render components
- Check `coverage/` directory wasn't deleted
- Verify `vitest.config.js` has coverage configuration

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library - Svelte](https://testing-library.com/docs/svelte-testing-library/intro)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [jest-dom Matchers](https://github.com/testing-library/jest-dom)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Examples

See `src/App.test.js` for comprehensive examples of:
- Component rendering tests
- User interaction tests (click, input, keyboard)
- State management tests
- Reactive computation tests
- Edge case testing
