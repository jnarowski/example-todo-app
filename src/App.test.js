import { render, screen, fireEvent } from '@testing-library/svelte'
import { describe, it, expect } from 'vitest'
import App from './App.svelte'

describe('App', () => {
  describe('Basic rendering and interaction', () => {
    it('renders todo app with initial state', () => {
      render(App)
      expect(screen.getByText('Todo App')).toBeInTheDocument()
      expect(screen.getByText('Active: 0')).toBeInTheDocument()
      expect(screen.getByText('Completed: 0')).toBeInTheDocument()
      expect(screen.getByText('Flagged: 0')).toBeInTheDocument()
    })

    it('shows empty state message when no todos', () => {
      render(App)
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
    })

    it('adds a new todo when clicking Add button', async () => {
      render(App)
      const input = screen.getByPlaceholderText('What needs to be done?')
      const button = screen.getByText('Add')

      await fireEvent.input(input, { target: { value: 'Test todo' } })
      await fireEvent.click(button)

      expect(screen.getByText('Test todo')).toBeInTheDocument()
      expect(screen.getByText('Active: 1')).toBeInTheDocument()
    })

    it('clears input after adding todo', async () => {
      render(App)
      const input = screen.getByPlaceholderText('What needs to be done?')
      const button = screen.getByText('Add')

      await fireEvent.input(input, { target: { value: 'Test todo' } })
      await fireEvent.click(button)

      expect(input.value).toBe('')
    })

    it('adds todo when pressing Enter key', async () => {
      render(App)
      const input = screen.getByPlaceholderText('What needs to be done?')

      await fireEvent.input(input, { target: { value: 'Test todo with Enter' } })
      await fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })

      expect(screen.getByText('Test todo with Enter')).toBeInTheDocument()
      expect(screen.getByText('Active: 1')).toBeInTheDocument()
    })
  })

  describe('Todo manipulation', () => {
    it('toggles todo completion status', async () => {
      render(App)
      const input = screen.getByPlaceholderText('What needs to be done?')
      const button = screen.getByText('Add')

      // Add a todo
      await fireEvent.input(input, { target: { value: 'Todo to complete' } })
      await fireEvent.click(button)

      expect(screen.getByText('Active: 1')).toBeInTheDocument()
      expect(screen.getByText('Completed: 0')).toBeInTheDocument()

      // Toggle completion
      const checkbox = screen.getByRole('checkbox')
      await fireEvent.click(checkbox)

      expect(screen.getByText('Active: 0')).toBeInTheDocument()
      expect(screen.getByText('Completed: 1')).toBeInTheDocument()

      // Toggle back
      await fireEvent.click(checkbox)

      expect(screen.getByText('Active: 1')).toBeInTheDocument()
      expect(screen.getByText('Completed: 0')).toBeInTheDocument()
    })

    it('deletes a todo', async () => {
      render(App)
      const input = screen.getByPlaceholderText('What needs to be done?')
      const addButton = screen.getByText('Add')

      // Add a todo
      await fireEvent.input(input, { target: { value: 'Todo to delete' } })
      await fireEvent.click(addButton)

      expect(screen.getByText('Todo to delete')).toBeInTheDocument()
      expect(screen.getByText('Active: 1')).toBeInTheDocument()

      // Delete the todo
      const deleteButton = screen.getByText('Delete')
      await fireEvent.click(deleteButton)

      expect(screen.queryByText('Todo to delete')).not.toBeInTheDocument()
      expect(screen.getByText('Active: 0')).toBeInTheDocument()
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
    })

    it('flags and unflags a todo', async () => {
      render(App)
      const input = screen.getByPlaceholderText('What needs to be done?')
      const addButton = screen.getByText('Add')

      // Add a todo
      await fireEvent.input(input, { target: { value: 'Todo to flag' } })
      await fireEvent.click(addButton)

      expect(screen.getByText('Flagged: 0')).toBeInTheDocument()

      // Flag the todo
      const flagButton = screen.getByTitle('Flag task')
      await fireEvent.click(flagButton)

      expect(screen.getByText('Flagged: 1')).toBeInTheDocument()

      // Unflag the todo
      const unflagButton = screen.getByTitle('Unflag task')
      await fireEvent.click(unflagButton)

      expect(screen.getByText('Flagged: 0')).toBeInTheDocument()
    })

    it('hides empty state when todos exist', async () => {
      render(App)
      const input = screen.getByPlaceholderText('What needs to be done?')
      const button = screen.getByText('Add')

      // Initially empty
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()

      // Add a todo
      await fireEvent.input(input, { target: { value: 'Test todo' } })
      await fireEvent.click(button)

      // Empty state should be hidden
      expect(screen.queryByText('No todos yet. Add one above!')).not.toBeInTheDocument()
    })
  })

  describe('Statistics and edge cases', () => {
    it('updates active todos count correctly', async () => {
      render(App)
      const input = screen.getByPlaceholderText('What needs to be done?')
      const button = screen.getByText('Add')

      expect(screen.getByText('Active: 0')).toBeInTheDocument()

      // Add first todo
      await fireEvent.input(input, { target: { value: 'Todo 1' } })
      await fireEvent.click(button)
      expect(screen.getByText('Active: 1')).toBeInTheDocument()

      // Add second todo
      await fireEvent.input(input, { target: { value: 'Todo 2' } })
      await fireEvent.click(button)
      expect(screen.getByText('Active: 2')).toBeInTheDocument()

      // Complete one todo
      const checkboxes = screen.getAllByRole('checkbox')
      await fireEvent.click(checkboxes[0])
      expect(screen.getByText('Active: 1')).toBeInTheDocument()
    })

    it('updates completed todos count correctly', async () => {
      render(App)
      const input = screen.getByPlaceholderText('What needs to be done?')
      const button = screen.getByText('Add')

      expect(screen.getByText('Completed: 0')).toBeInTheDocument()

      // Add two todos
      await fireEvent.input(input, { target: { value: 'Todo 1' } })
      await fireEvent.click(button)
      await fireEvent.input(input, { target: { value: 'Todo 2' } })
      await fireEvent.click(button)

      expect(screen.getByText('Completed: 0')).toBeInTheDocument()

      // Complete first todo
      const checkboxes = screen.getAllByRole('checkbox')
      await fireEvent.click(checkboxes[0])
      expect(screen.getByText('Completed: 1')).toBeInTheDocument()

      // Complete second todo
      await fireEvent.click(checkboxes[1])
      expect(screen.getByText('Completed: 2')).toBeInTheDocument()

      // Uncomplete first todo
      await fireEvent.click(checkboxes[0])
      expect(screen.getByText('Completed: 1')).toBeInTheDocument()
    })

    it('updates flagged todos count correctly', async () => {
      render(App)
      const input = screen.getByPlaceholderText('What needs to be done?')
      const button = screen.getByText('Add')

      expect(screen.getByText('Flagged: 0')).toBeInTheDocument()

      // Add two todos
      await fireEvent.input(input, { target: { value: 'Todo 1' } })
      await fireEvent.click(button)
      await fireEvent.input(input, { target: { value: 'Todo 2' } })
      await fireEvent.click(button)

      expect(screen.getByText('Flagged: 0')).toBeInTheDocument()

      // Flag first todo
      const flagButtons = screen.getAllByTitle('Flag task')
      await fireEvent.click(flagButtons[0])
      expect(screen.getByText('Flagged: 1')).toBeInTheDocument()

      // Flag second todo
      await fireEvent.click(flagButtons[1])
      expect(screen.getByText('Flagged: 2')).toBeInTheDocument()

      // Unflag first todo
      const unflagButtons = screen.getAllByTitle('Unflag task')
      await fireEvent.click(unflagButtons[0])
      expect(screen.getByText('Flagged: 1')).toBeInTheDocument()
    })

    it('does not add empty todos', async () => {
      render(App)
      const input = screen.getByPlaceholderText('What needs to be done?')
      const button = screen.getByText('Add')

      // Try to add empty todo
      await fireEvent.click(button)
      expect(screen.getByText('Active: 0')).toBeInTheDocument()
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
    })

    it('does not add whitespace-only todos', async () => {
      render(App)
      const input = screen.getByPlaceholderText('What needs to be done?')
      const button = screen.getByText('Add')

      // Try to add whitespace-only todo
      await fireEvent.input(input, { target: { value: '   ' } })
      await fireEvent.click(button)

      expect(screen.getByText('Active: 0')).toBeInTheDocument()
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
    })

    it('maintains independent state for multiple todos', async () => {
      render(App)
      const input = screen.getByPlaceholderText('What needs to be done?')
      const button = screen.getByText('Add')

      // Add three todos
      await fireEvent.input(input, { target: { value: 'Todo 1' } })
      await fireEvent.click(button)
      await fireEvent.input(input, { target: { value: 'Todo 2' } })
      await fireEvent.click(button)
      await fireEvent.input(input, { target: { value: 'Todo 3' } })
      await fireEvent.click(button)

      // Complete and flag different todos
      const checkboxes = screen.getAllByRole('checkbox')
      const flagButtons = screen.getAllByTitle('Flag task')

      await fireEvent.click(checkboxes[0]) // Complete Todo 1
      await fireEvent.click(flagButtons[1]) // Flag Todo 2

      // Verify states
      expect(screen.getByText('Active: 2')).toBeInTheDocument()
      expect(screen.getByText('Completed: 1')).toBeInTheDocument()
      expect(screen.getByText('Flagged: 1')).toBeInTheDocument()

      // Verify Todo 1 is completed
      expect(checkboxes[0]).toBeChecked()
      expect(checkboxes[1]).not.toBeChecked()
      expect(checkboxes[2]).not.toBeChecked()
    })
  })
})
