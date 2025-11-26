import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma/client.ts';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

// Create LibSQL client for local SQLite file
const libsql = createClient({
  url: 'file:dev.db'
});

// Create Prisma adapter
const adapter = new PrismaLibSql(libsql);

// Singleton pattern to prevent multiple Prisma Client instances in development
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
