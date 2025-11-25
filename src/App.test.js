import { render, fireEvent, screen } from '@testing-library/svelte'
import { describe, it, expect } from 'vitest'
import App from './App.svelte'

describe('App.svelte', () => {
  it('renders the app with title and empty state', () => {
    render(App)
    expect(screen.getByText('Todo App')).toBeInTheDocument()
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
    expect(screen.getByText('Flagged: 0')).toBeInTheDocument()
  })

  it('adds a new todo when clicking Add button', async () => {
    render(App)
    const input = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByText('Add')

    await fireEvent.input(input, { target: { value: 'Test todo' } })
    await fireEvent.click(addButton)

    expect(screen.getByText('Test todo')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('adds a new todo when pressing Enter key', async () => {
    render(App)
    const input = screen.getByPlaceholderText('What needs to be done?')

    await fireEvent.input(input, { target: { value: 'Test todo with Enter' } })
    await fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })

    expect(screen.getByText('Test todo with Enter')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
  })

  it('does not add empty or whitespace-only todos', async () => {
    render(App)
    const input = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByText('Add')

    // Try adding empty todo
    await fireEvent.click(addButton)
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()

    // Try adding whitespace-only todo
    await fireEvent.input(input, { target: { value: '   ' } })
    await fireEvent.click(addButton)
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
  })

  it('toggles todo completion status', async () => {
    render(App)
    const input = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByText('Add')

    await fireEvent.input(input, { target: { value: 'Test todo' } })
    await fireEvent.click(addButton)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()

    await fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
  })

  it('toggles todo flag status', async () => {
    render(App)
    const input = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByText('Add')

    await fireEvent.input(input, { target: { value: 'Test todo' } })
    await fireEvent.click(addButton)

    expect(screen.getByText('Flagged: 0')).toBeInTheDocument()
    const flagButton = screen.getByTitle('Flag task')
    expect(flagButton).toHaveTextContent('☆')

    await fireEvent.click(flagButton)
    expect(screen.getByText('Flagged: 1')).toBeInTheDocument()
    expect(screen.getByTitle('Unflag task')).toHaveTextContent('⭐')
  })

  it('deletes a todo', async () => {
    render(App)
    const input = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByText('Add')

    await fireEvent.input(input, { target: { value: 'Test todo' } })
    await fireEvent.click(addButton)

    expect(screen.getByText('Test todo')).toBeInTheDocument()

    const deleteButton = screen.getByText('Delete')
    await fireEvent.click(deleteButton)

    expect(screen.queryByText('Test todo')).not.toBeInTheDocument()
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
  })

  it('manages multiple todos with different states', async () => {
    render(App)
    const input = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByText('Add')

    // Add three todos
    await fireEvent.input(input, { target: { value: 'Todo 1' } })
    await fireEvent.click(addButton)
    await fireEvent.input(input, { target: { value: 'Todo 2' } })
    await fireEvent.click(addButton)
    await fireEvent.input(input, { target: { value: 'Todo 3' } })
    await fireEvent.click(addButton)

    expect(screen.getByText('Active: 3')).toBeInTheDocument()
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
    expect(screen.getByText('Flagged: 0')).toBeInTheDocument()

    // Complete first todo
    const checkboxes = screen.getAllByRole('checkbox')
    await fireEvent.click(checkboxes[0])

    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()

    // Flag second todo
    const flagButtons = screen.getAllByTitle(/task/)
    await fireEvent.click(flagButtons[1])

    expect(screen.getByText('Flagged: 1')).toBeInTheDocument()

    // Delete third todo
    const deleteButtons = screen.getAllByText('Delete')
    await fireEvent.click(deleteButtons[2])

    expect(screen.queryByText('Todo 3')).not.toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
  })

  it('applies correct CSS classes for completed and flagged todos', async () => {
    render(App)
    const input = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByText('Add')

    await fireEvent.input(input, { target: { value: 'Test todo' } })
    await fireEvent.click(addButton)

    const todoItem = screen.getByText('Test todo').closest('.todo-item')

    // Check flagged class
    const flagButton = screen.getByTitle('Flag task')
    await fireEvent.click(flagButton)
    expect(todoItem).toHaveClass('flagged')

    // Check completed class
    const checkbox = screen.getByRole('checkbox')
    await fireEvent.click(checkbox)
    expect(todoItem).toHaveClass('completed')
  })
})
