import express from 'express';

export default function createTodosRouter(prisma) {
  const router = express.Router();

  // GET /api/todos - Fetch all todos
  router.get('/', async (req, res, next) => {
    try {
      const todos = await prisma.todo.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.json(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);

      // Handle database connection errors
      if (error.code === 'P1001' || error.code === 'P1002') {
        return res.status(503).json({
          error: 'Database connection error',
          message: 'Unable to connect to the database',
        });
      }

      // Handle general query errors
      res.status(500).json({
        error: 'Failed to fetch todos',
        message: error.message,
      });
    }
  });

  // POST /api/todos - Create a new todo
  router.post('/', async (req, res, next) => {
    try {
      const { text } = req.body;

      // Validation
      if (!text || typeof text !== 'string') {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Text field is required and must be a string',
        });
      }

      if (text.trim().length === 0) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Text field cannot be empty',
        });
      }

      if (text.length > 500) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Text field must be 500 characters or less',
        });
      }

      // Create todo
      const todo = await prisma.todo.create({
        data: {
          text: text.trim(),
          completed: false,
        },
      });

      res.status(201).json(todo);
    } catch (error) {
      console.error('Error creating todo:', error);

      // Handle database connection errors
      if (error.code === 'P1001' || error.code === 'P1002') {
        return res.status(503).json({
          error: 'Database connection error',
          message: 'Unable to connect to the database',
        });
      }

      res.status(500).json({
        error: 'Failed to create todo',
        message: error.message,
      });
    }
  });

  // PUT /api/todos/:id - Update a todo
  router.put('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { text, completed } = req.body;

      // Validate id
      const todoId = parseInt(id, 10);
      if (isNaN(todoId)) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Invalid todo ID',
        });
      }

      // Build update data
      const updateData = {};
      if (text !== undefined) {
        if (typeof text !== 'string' || text.trim().length === 0) {
          return res.status(400).json({
            error: 'Validation error',
            message: 'Text field must be a non-empty string',
          });
        }
        if (text.length > 500) {
          return res.status(400).json({
            error: 'Validation error',
            message: 'Text field must be 500 characters or less',
          });
        }
        updateData.text = text.trim();
      }

      if (completed !== undefined) {
        if (typeof completed !== 'boolean') {
          return res.status(400).json({
            error: 'Validation error',
            message: 'Completed field must be a boolean',
          });
        }
        updateData.completed = completed;
      }

      // Update todo
      const todo = await prisma.todo.update({
        where: { id: todoId },
        data: updateData,
      });

      res.json(todo);
    } catch (error) {
      console.error('Error updating todo:', error);

      // Handle not found
      if (error.code === 'P2025') {
        return res.status(404).json({
          error: 'Not found',
          message: 'Todo not found',
        });
      }

      // Handle database connection errors
      if (error.code === 'P1001' || error.code === 'P1002') {
        return res.status(503).json({
          error: 'Database connection error',
          message: 'Unable to connect to the database',
        });
      }

      res.status(500).json({
        error: 'Failed to update todo',
        message: error.message,
      });
    }
  });

  // DELETE /api/todos/:id - Delete a todo
  router.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;

      // Validate id
      const todoId = parseInt(id, 10);
      if (isNaN(todoId)) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Invalid todo ID',
        });
      }

      // Delete todo
      await prisma.todo.delete({
        where: { id: todoId },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting todo:', error);

      // Handle not found
      if (error.code === 'P2025') {
        return res.status(404).json({
          error: 'Not found',
          message: 'Todo not found',
        });
      }

      // Handle database connection errors
      if (error.code === 'P1001' || error.code === 'P1002') {
        return res.status(503).json({
          error: 'Database connection error',
          message: 'Unable to connect to the database',
        });
      }

      res.status(500).json({
        error: 'Failed to delete todo',
        message: error.message,
      });
    }
  });

  return router;
}
