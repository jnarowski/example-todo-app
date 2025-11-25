import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Create the SQLite database connection
const db = new Database('./prisma/dev.db');

// Create the Prisma adapter for better-sqlite3
const adapter = new PrismaBetterSqlite3(db);

// Initialize Prisma Client with the adapter
const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn']
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  db.close();
  process.exit(0);
});

export default prisma;
