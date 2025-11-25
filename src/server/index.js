import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import todosRouter from './routes/todos.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Prisma Client
let prisma;
try {
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  console.log('✓ Prisma Client initialized');
} catch (error) {
  console.error('✗ Failed to initialize Prisma Client:', error);
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// Routes
app.use('/api/todos', todosRouter(prisma));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log('✓ HTTP server closed');
  });

  await prisma.$disconnect();
  console.log('✓ Prisma Client disconnected');

  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export { prisma };
