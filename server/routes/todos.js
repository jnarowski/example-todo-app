import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// GET /todos - Fetch all todos
router.get('/', async (req, res, next) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

// POST /todos - Create a new todo
router.post('/', async (req, res, next) => {
  try {
    const { text } = req.body;

    // Validation
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: 'Text field is required and must be a non-empty string'
      });
    }

    if (text.length > 500) {
      return res.status(400).json({
        error: 'Validation failed',
        details: 'Text must be less than 500 characters'
      });
    }

    const todo = await prisma.todo.create({
      data: {
        text: text.trim()
      }
    });

    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
});

// PATCH /todos/:id - Update a todo (toggle completed or update text)
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { completed, text } = req.body;

    // Validate ID
    const todoId = parseInt(id, 10);
    if (isNaN(todoId)) {
      return res.status(400).json({
        error: 'Invalid ID',
        details: 'Todo ID must be a valid number'
      });
    }

    // Build update data
    const updateData = {};
    if (typeof completed === 'boolean') {
      updateData.completed = completed;
    }
    if (text !== undefined) {
      if (typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({
          error: 'Validation failed',
          details: 'Text must be a non-empty string'
        });
      }
      if (text.length > 500) {
        return res.status(400).json({
          error: 'Validation failed',
          details: 'Text must be less than 500 characters'
        });
      }
      updateData.text = text.trim();
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: 'No valid fields provided for update'
      });
    }

    const todo = await prisma.todo.update({
      where: { id: todoId },
      data: updateData
    });

    res.json(todo);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Todo not found',
        details: `Todo with id ${req.params.id} does not exist`
      });
    }
    next(error);
  }
});

// DELETE /todos/:id - Delete a todo
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    const todoId = parseInt(id, 10);
    if (isNaN(todoId)) {
      return res.status(400).json({
        error: 'Invalid ID',
        details: 'Todo ID must be a valid number'
      });
    }

    await prisma.todo.delete({
      where: { id: todoId }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Todo not found',
        details: `Todo with id ${req.params.id} does not exist`
      });
    }
    next(error);
  }
});

export default router;
