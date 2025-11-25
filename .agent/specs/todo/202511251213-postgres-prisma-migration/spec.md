# Postgres Database with Prisma Migration

**Status**: draft
**Created**: 2025-11-25
**Package**: example-todo-app
**Total Complexity**: 62 points
**Phases**: 4
**Tasks**: 13
**Overall Avg Complexity**: 4.8/10

## Complexity Breakdown

| Phase                           | Tasks | Total Points | Avg Complexity | Max Task |
| ------------------------------- | ----- | ------------ | -------------- | -------- |
| Phase 1: Setup & Configuration  | 4     | 18           | 4.5/10         | 6/10     |
| Phase 2: Database Schema        | 3     | 14           | 4.7/10         | 6/10     |
| Phase 3: Backend API            | 4     | 22           | 5.5/10         | 7/10     |
| Phase 4: Frontend Integration   | 2     | 8            | 4.0/10         | 5/10     |
| **Total**                       | **13**| **62**       | **4.8/10**     | **7/10** |

## Overview

This feature migrates the todo app from in-memory state management to a persistent Postgres database using Prisma ORM. It adds database persistence, backend API endpoints, and updates the frontend to communicate with the API, ensuring todos survive page refreshes and can be accessed across sessions.

## User Story

As a user
I want my todos to persist across page refreshes and browser sessions
So that I never lose my todo list data and can access it from any device

## Technical Approach

The implementation follows a full-stack approach: set up Prisma with Postgres, define the todo schema, create a Node.js/Express API with CRUD endpoints, and update the Svelte frontend to use fetch instead of local state. We'll use Docker for local Postgres development and Prisma's migration system for schema management.

## Key Design Decisions

1. **Prisma as ORM**: Modern type-safe ORM with excellent TypeScript support and migration management
2. **Express API Server**: Lightweight, well-established framework for REST endpoints, easy to add to Vite dev workflow
3. **Docker Postgres**: Containerized database for consistent local development environment
4. **REST API Pattern**: Simple CRUD endpoints (/api/todos) following REST conventions

## Architecture

### File Structure
```
project-root/
├── prisma/
│   ├── schema.prisma        # Database schema definition
│   └── migrations/          # Migration history
├── server/
│   ├── index.js            # Express API server
│   └── db.js               # Prisma client instance
├── src/
│   ├── App.svelte          # Updated with API calls
│   ├── lib/
│   │   └── api.js          # API client functions
│   └── main.js
├── docker-compose.yml      # Postgres container
└── package.json            # Updated dependencies
```

### Integration Points

**Database Layer**:
- `prisma/schema.prisma` - Define Todo model
- `server/db.js` - Prisma client initialization

**Backend Layer**:
- `server/index.js` - Express server with CRUD routes

**Frontend Layer**:
- `src/lib/api.js` - API client functions
- `src/App.svelte` - Replace local state with API calls

## Implementation Details

### 1. Prisma & Database Setup

Install Prisma, initialize schema, and set up Postgres database with Docker. Configure environment variables and generate Prisma client.

**Key Points**:
- Use Docker Compose for local Postgres instance
- Prisma schema defines Todo model with id, text, completed, timestamps
- Environment variables in `.env` for DATABASE_URL
- Prisma Client auto-generated from schema

### 2. Database Schema Design

Define the Todo model with appropriate fields and indexes. Create initial migration to set up the database structure.

**Key Points**:
- Auto-incrementing ID as primary key
- Text field for todo content
- Boolean completed flag
- createdAt and updatedAt timestamps
- Consider index on completed for filtering queries

### 3. Backend API Server

Create Express server with REST endpoints for todo CRUD operations. Integrate with Vite dev server for concurrent frontend/backend development.

**Key Points**:
- GET /api/todos - List all todos
- POST /api/todos - Create new todo
- PATCH /api/todos/:id - Update todo (toggle completed)
- DELETE /api/todos/:id - Delete todo
- Error handling middleware
- CORS configuration for Vite dev server

### 4. Frontend Integration

Update Svelte app to fetch data from API instead of managing local state. Add loading states and error handling for network requests.

**Key Points**:
- Create API client module with fetch wrappers
- Load todos on mount
- Update all mutations to call API endpoints
- Add loading indicators during requests
- Handle API errors gracefully

## Files to Create/Modify

### New Files (7)

1. `prisma/schema.prisma` - Prisma schema definition
2. `server/index.js` - Express API server
3. `server/db.js` - Prisma client export
4. `src/lib/api.js` - Frontend API client
5. `docker-compose.yml` - Postgres container config
6. `.env` - Environment variables (DATABASE_URL)
7. `.env.example` - Template for environment variables

### Modified Files (3)

1. `package.json` - Add Prisma, Express, pg dependencies and scripts
2. `src/App.svelte` - Replace local state with API calls
3. `vite.config.js` - Add proxy config for API routes

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Setup & Configuration

**Phase Complexity**: 18 points (avg 4.5/10)

- [ ] 1.1 [4/10] Install dependencies and initialize Prisma
  - Install `@prisma/client`, `prisma`, `express`, `cors`, `dotenv`, `pg`
  - Run `npx prisma init` to create prisma directory
  - Commands: `pnpm add @prisma/client express cors dotenv pg` and `pnpm add -D prisma`

- [ ] 1.2 [6/10] Create Docker Compose for Postgres
  - Set up Postgres 16 container with persistent volume
  - Configure port 5432, default database, credentials
  - File: `docker-compose.yml`
  - Command: `docker-compose up -d`

- [ ] 1.3 [4/10] Configure environment variables
  - Create `.env` with DATABASE_URL pointing to Docker Postgres
  - Create `.env.example` template
  - Add `.env` to `.gitignore`
  - File: `.env` and `.env.example`

- [ ] 1.4 [4/10] Update package.json scripts
  - Add `db:migrate` for Prisma migrations
  - Add `db:studio` for Prisma Studio
  - Add `db:generate` for client generation
  - Add `dev:server` for backend server
  - File: `package.json`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 2: Database Schema

**Phase Complexity**: 14 points (avg 4.7/10)

- [ ] 2.1 [6/10] Define Todo schema in Prisma
  - Create Todo model with id, text, completed, createdAt, updatedAt
  - Set appropriate field types and defaults
  - Add index on completed field for performance
  - File: `prisma/schema.prisma`

- [ ] 2.2 [4/10] Create initial migration
  - Run Prisma migration to create database tables
  - Name migration "init" or "create_todos"
  - Command: `npx prisma migrate dev --name init`

- [ ] 2.3 [4/10] Generate Prisma Client
  - Generate TypeScript Prisma Client
  - Verify types are available
  - Command: `npx prisma generate`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 3: Backend API

**Phase Complexity**: 22 points (avg 5.5/10)

- [ ] 3.1 [5/10] Create Prisma client module
  - Export configured PrismaClient instance
  - Add proper client instantiation and connection handling
  - File: `server/db.js`

- [ ] 3.2 [7/10] Implement Express API server
  - Create Express app with CORS and JSON middleware
  - Implement GET /api/todos endpoint (fetch all)
  - Implement POST /api/todos endpoint (create)
  - Implement PATCH /api/todos/:id endpoint (update)
  - Implement DELETE /api/todos/:id endpoint (delete)
  - Add error handling middleware
  - File: `server/index.js`

- [ ] 3.3 [5/10] Configure Vite proxy for API
  - Add proxy configuration to forward /api/* to backend server
  - Ensure dev server runs on separate port (e.g., 3001)
  - File: `vite.config.js`

- [ ] 3.4 [5/10] Test API endpoints manually
  - Start Docker Postgres and backend server
  - Use curl or Postman to test all CRUD operations
  - Verify data persists in database
  - Commands: `docker-compose up -d`, `node server/index.js`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 4: Frontend Integration

**Phase Complexity**: 8 points (avg 4.0/10)

- [ ] 4.1 [3/10] Create API client module
  - Implement fetchTodos(), createTodo(), updateTodo(), deleteTodo()
  - Use fetch API with proper error handling
  - Return parsed JSON responses
  - File: `src/lib/api.js`

- [ ] 4.2 [5/10] Update App.svelte with API integration
  - Replace local state initialization with API fetch on mount
  - Update addTodo() to call createTodo() API
  - Update toggleTodo() to call updateTodo() API
  - Update deleteTodo() to call deleteTodo() API
  - Add loading state during initial fetch
  - Add error handling and user feedback
  - File: `src/App.svelte`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

## Testing Strategy

### Unit Tests

**`server/index.test.js`** - API endpoint tests:

- Test GET /api/todos returns array
- Test POST /api/todos creates new todo
- Test PATCH /api/todos/:id updates completed status
- Test DELETE /api/todos/:id removes todo
- Test error cases (invalid ID, missing fields)

### Integration Tests

Test full stack flow:
- Start Postgres and backend
- Frontend creates todo via API
- Verify todo appears in list
- Toggle completed status
- Delete todo
- Refresh page and verify data persists

### E2E Tests

**`e2e/todos.spec.js`** - End-to-end todo flow:

- User adds new todo
- User marks todo as completed
- User deletes todo
- User refreshes page and sees persisted data

## Success Criteria

- [ ] Docker Compose starts Postgres successfully
- [ ] Prisma migrations run without errors
- [ ] Backend API responds to all CRUD endpoints
- [ ] Frontend loads todos from database on mount
- [ ] Creating a todo persists to database
- [ ] Toggling completed status updates database
- [ ] Deleting a todo removes from database
- [ ] Page refresh maintains todo list (persistence verified)
- [ ] No console errors in browser or server
- [ ] TypeScript types (if applicable) compile successfully
- [ ] All existing app functionality preserved

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Start database
docker-compose up -d
# Expected: Postgres container running on port 5432

# Run migrations
npx prisma migrate dev
# Expected: Migrations applied successfully

# Generate Prisma Client
npx prisma generate
# Expected: Client generated in node_modules/@prisma/client

# Start backend server (in separate terminal)
node server/index.js
# Expected: Server listening on port 3001

# Build verification
pnpm build
# Expected: Successful Vite build with no errors

# Type checking (if TypeScript)
pnpm tsc --noEmit
# Expected: No type errors
```

**Manual Verification:**

1. Start application: `pnpm dev` (with backend server running)
2. Navigate to: `http://localhost:5173`
3. Verify: Todos list loads (may be empty initially)
4. Test: Add new todo, verify it appears
5. Test: Toggle todo completed, verify UI updates
6. Test: Delete todo, verify it's removed
7. Test: Refresh page, verify todos persist
8. Check console: No errors in browser DevTools
9. Check server logs: API calls logged, no errors

**Feature-Specific Checks:**

- Open Prisma Studio: `npx prisma studio` - verify todos exist in database
- Test API directly with curl:
  ```bash
  curl http://localhost:3001/api/todos
  curl -X POST http://localhost:3001/api/todos -H "Content-Type: application/json" -d '{"text":"Test todo"}'
  ```
- Stop and restart Docker container, verify data persists across restarts
- Test with network throttling to verify loading states work

## Implementation Notes

### 1. Database Connection Management

Prisma Client handles connection pooling automatically. In development, use a single instance to avoid connection exhaustion. Consider connection limits in production.

### 2. Migration Strategy

Use `prisma migrate dev` in development for automatic migration creation. For production, use `prisma migrate deploy` to apply existing migrations without prompting.

### 3. API Error Handling

Always return appropriate HTTP status codes (200, 201, 400, 404, 500) and consistent error response format. Frontend should handle network failures gracefully.

### 4. CORS Configuration

In development, CORS is wide open. In production, restrict origins to your frontend domain only.

### 5. Environment Variables

Never commit `.env` file. Always provide `.env.example` template for other developers.

## Dependencies

- `@prisma/client` - Prisma ORM client
- `prisma` - Prisma CLI (dev dependency)
- `express` - Web server framework
- `cors` - CORS middleware
- `dotenv` - Environment variable management
- `pg` - PostgreSQL driver
- Docker & Docker Compose - For local Postgres

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Docker Compose for Postgres](https://hub.docker.com/_/postgres)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)

## Next Steps

1. Ensure Docker is installed and running
2. Run `/cmd:implement-spec 202511251213` to begin implementation
3. Test each phase incrementally (database → backend → frontend)
4. Consider adding data seeding script for development
5. Plan for production deployment (managed Postgres, environment config)
