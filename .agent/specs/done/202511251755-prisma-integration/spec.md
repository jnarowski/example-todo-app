# Prisma Database Integration

**Status**: completed
**Created**: 2025-11-25
**Package**: project
**Total Complexity**: 67 points
**Phases**: 5
**Tasks**: 13
**Overall Avg Complexity**: 5.2/10

## Complexity Breakdown

| Phase                        | Tasks | Total Points | Avg Complexity | Max Task |
| ---------------------------- | ----- | ------------ | -------------- | -------- |
| Phase 1: Setup & Config      | 3     | 15           | 5.0/10         | 6/10     |
| Phase 2: Schema & Migration  | 2     | 12           | 6.0/10         | 7/10     |
| Phase 3: API Layer           | 3     | 18           | 6.0/10         | 7/10     |
| Phase 4: Frontend Integration| 3     | 14           | 4.7/10         | 6/10     |
| Phase 5: Testing & Validation| 2     | 8            | 4.0/10         | 5/10     |
| **Total**                    | **13**| **67**       | **5.2/10**     | **7/10** |

## Overview

Replace the in-memory todo storage with Prisma ORM backed by SQLite database, providing persistent data storage. This migration transforms the app from volatile client-side storage to a robust database solution with proper CRUD operations through an API layer.

## User Story

As a user
I want my todos to persist across browser sessions and page refreshes
So that I don't lose my task list when I close the browser or navigate away

## Technical Approach

Implement a full-stack architecture with:
1. Prisma ORM with SQLite for database operations
2. Express API server exposing RESTful endpoints
3. Frontend refactor to consume API instead of local state
4. Proper error handling and loading states

This approach minimizes external dependencies (SQLite is file-based) while providing production-ready persistence patterns.

## Key Design Decisions

1. **SQLite Database**: File-based database requires no external services, ideal for this application scale
2. **Express API Server**: Separate backend server provides clear separation of concerns and RESTful API patterns
3. **Prisma Client**: Type-safe database access with automatic migrations and schema management
4. **RESTful Endpoints**: Standard CRUD operations (`GET`, `POST`, `PATCH`, `DELETE`) for maintainability

## Architecture

### File Structure

```
project/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── migrations/            # Database migration history
├── server/
│   ├── index.js               # Express server with API routes
│   └── db.js                  # Prisma client singleton
├── src/
│   ├── App.svelte             # Updated with API calls
│   ├── lib/
│   │   └── api.js             # API client functions
│   └── main.js
├── .env                       # Database connection string
└── package.json               # Updated with new dependencies
```

### Integration Points

**Backend**:
- `server/index.js` - Express server with todo CRUD endpoints
- `server/db.js` - Prisma client initialization and export
- `prisma/schema.prisma` - Todo model schema definition

**Frontend**:
- `src/App.svelte` - Replace local state with API calls
- `src/lib/api.js` - Centralized API client functions

**Configuration**:
- `.env` - Database URL configuration
- `package.json` - Add Prisma, Express, CORS dependencies and new scripts

## Implementation Details

### 1. Prisma Setup

Initialize Prisma ORM with SQLite provider, create schema for Todo model with fields: `id`, `text`, `completed`, `createdAt`.

**Key Points**:
- Use SQLite for zero-configuration persistence
- Auto-incrementing integer ID for simplicity
- Timestamp tracking for audit trail
- Default values for `completed` (false) and `createdAt` (now)

### 2. Database Schema

Define Todo model with appropriate field types and constraints matching existing frontend model structure.

**Key Points**:
- `id` as auto-increment primary key
- `text` as required String field
- `completed` as Boolean with false default
- `createdAt` as DateTime with auto-timestamp

### 3. Express API Server

Create REST API server with CORS support and JSON parsing middleware. Implement five endpoints:
- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create new todo
- `PATCH /api/todos/:id` - Toggle completion status
- `DELETE /api/todos/:id` - Delete todo
- Error handling for all routes

**Key Points**:
- CORS enabled for frontend communication
- Proper HTTP status codes (200, 201, 404, 500)
- Request validation for required fields
- Graceful error responses with messages

### 4. Frontend API Integration

Refactor `App.svelte` to use async API calls instead of local state mutations. Add loading states and error handling.

**Key Points**:
- Load todos on component mount
- Loading indicators during API calls
- Error message display for failed operations
- Optimistic updates for better UX (optional)

### 5. Environment Configuration

Setup `.env` file with `DATABASE_URL` pointing to local SQLite file. Update `.gitignore` to exclude database files.

**Key Points**:
- SQLite URL format: `file:./dev.db`
- Exclude `.env` and `*.db` files from git
- Document environment variables in README

## Files to Create/Modify

### New Files (6)

1. `prisma/schema.prisma` - Database schema definition
2. `server/index.js` - Express API server
3. `server/db.js` - Prisma client singleton
4. `src/lib/api.js` - Frontend API client
5. `.env` - Environment variables
6. `.env.example` - Environment template

### Modified Files (3)

1. `package.json` - Add dependencies (prisma, @prisma/client, express, cors) and scripts
2. `src/App.svelte` - Replace local state with API integration
3. `.gitignore` - Exclude database and env files

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Setup & Configuration

**Phase Complexity**: 15 points (avg 5.0/10)

- [ ] 1.1 [4/10] Install Prisma dependencies and initialize Prisma
  - Install: `npm install prisma @prisma/client`
  - Initialize: `npx prisma init --datasource-provider sqlite`
  - Files created: `prisma/schema.prisma`, `.env`

- [ ] 1.2 [6/10] Install Express server dependencies and setup project structure
  - Install: `npm install express cors`
  - Install dev: `npm install -D nodemon concurrently`
  - Create directories: `mkdir -p server src/lib`
  - Files: `server/index.js`, `server/db.js`, `src/lib/api.js`

- [ ] 1.3 [5/10] Configure environment and update package.json scripts
  - Update `.env` with: `DATABASE_URL="file:./dev.db"`
  - Create `.env.example` with template
  - Update `.gitignore`: add `.env`, `*.db`, `*.db-journal`, `node_modules`
  - Add scripts to `package.json`:
    - `"server": "nodemon server/index.js"`
    - `"db:migrate": "npx prisma migrate dev"`
    - `"db:studio": "npx prisma studio"`
    - `"dev:full": "concurrently \"npm run server\" \"npm run dev\""`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 2: Schema & Migration

**Phase Complexity**: 12 points (avg 6.0/10)

- [ ] 2.1 [5/10] Define Todo schema in Prisma
  - Edit: `prisma/schema.prisma`
  - Add Todo model with fields: id (Int, autoincrement), text (String), completed (Boolean, default false), createdAt (DateTime, default now)
  - Ensure generator and datasource blocks are correct

- [ ] 2.2 [7/10] Create and apply initial migration
  - Run: `npx prisma migrate dev --name init`
  - Verify: `dev.db` file created
  - Verify: `prisma/migrations/` directory created with migration SQL
  - Generate client: `npx prisma generate` (runs automatically with migrate)

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 3: API Layer

**Phase Complexity**: 18 points (avg 6.0/10)

- [ ] 3.1 [5/10] Create Prisma client singleton
  - Create: `server/db.js`
  - Import PrismaClient, instantiate singleton, export
  - Handle connection cleanup on process termination

- [ ] 3.2 [7/10] Implement Express server with CRUD endpoints
  - Create: `server/index.js`
  - Setup Express with JSON and CORS middleware
  - Implement routes:
    - `GET /api/todos` - Return all todos ordered by createdAt
    - `POST /api/todos` - Create todo (validate text field)
    - `PATCH /api/todos/:id` - Toggle completed status
    - `DELETE /api/todos/:id` - Delete todo by id
  - Start server on port 3001

- [ ] 3.3 [6/10] Add error handling and validation
  - Add try-catch blocks to all route handlers
  - Return 404 for non-existent todo IDs
  - Return 400 for invalid request bodies
  - Return 500 for database errors with error messages
  - Log errors to console for debugging

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 4: Frontend Integration

**Phase Complexity**: 14 points (avg 4.7/10)

- [ ] 4.1 [4/10] Create API client functions
  - Create: `src/lib/api.js`
  - Implement functions: `fetchTodos()`, `createTodo(text)`, `toggleTodo(id, completed)`, `deleteTodo(id)`
  - Use fetch API with proper headers and error handling
  - Base URL: `http://localhost:3001/api`

- [ ] 4.2 [6/10] Refactor App.svelte to use API
  - Remove local state management logic
  - Add `onMount` to load todos from API
  - Update `addTodo()` to call API and refresh list
  - Update `toggleTodo(id)` to call API with completed status
  - Update `deleteTodo(id)` to call API
  - Add loading state variable and display indicator

- [ ] 4.3 [4/10] Add error handling and loading states
  - Add error state variable for API failures
  - Display error messages in UI
  - Show loading spinner during API calls
  - Handle network errors gracefully
  - Clear error state on successful operations

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 5: Testing & Validation

**Phase Complexity**: 8 points (avg 4.0/10)

- [ ] 5.1 [3/10] Test database operations with Prisma Studio
  - Run: `npx prisma studio`
  - Open browser to Prisma Studio UI
  - Manually create, update, delete todos
  - Verify operations reflect in database

- [ ] 5.2 [5/10] Integration testing of full stack
  - Start both servers: `npm run dev:full`
  - Test create todo functionality
  - Test toggle completion status
  - Test delete todo
  - Verify persistence: refresh page and check todos remain
  - Test error scenarios (server down, invalid data)

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

## Testing Strategy

### Unit Tests

**`server/index.test.js`** - API endpoint testing:

```javascript
describe('Todo API', () => {
  test('GET /api/todos returns all todos', async () => {
    const response = await fetch('http://localhost:3001/api/todos');
    expect(response.status).toBe(200);
    const todos = await response.json();
    expect(Array.isArray(todos)).toBe(true);
  });

  test('POST /api/todos creates new todo', async () => {
    const response = await fetch('http://localhost:3001/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Test todo' })
    });
    expect(response.status).toBe(201);
    const todo = await response.json();
    expect(todo.text).toBe('Test todo');
    expect(todo.completed).toBe(false);
  });

  test('PATCH /api/todos/:id toggles completion', async () => {
    // Create todo first, then toggle
  });

  test('DELETE /api/todos/:id removes todo', async () => {
    // Create todo first, then delete
  });
});
```

### Integration Tests

Test full flow from frontend through API to database:
1. Start servers in test mode
2. Use Playwright or Cypress for E2E tests
3. Verify CRUD operations persist across page refreshes
4. Test error handling (network failures, invalid data)
5. Verify concurrent operations (multiple users)

### Manual Testing

Use Prisma Studio for direct database inspection and verification of data integrity during operations.

## Success Criteria

- [ ] Todos persist across browser refreshes and sessions
- [ ] All CRUD operations (create, read, update, delete) work correctly
- [ ] Frontend displays loading states during API operations
- [ ] Error messages show when operations fail
- [ ] Database file (`dev.db`) is created and contains data
- [ ] Prisma Studio can view and edit todos
- [ ] No console errors in browser or server logs
- [ ] Type safety maintained with Prisma Client
- [ ] CORS configured properly for local development
- [ ] Database migrations run successfully

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Install dependencies
npm install
# Expected: All packages installed successfully

# Generate Prisma Client
npx prisma generate
# Expected: Prisma Client generated successfully

# Run database migration
npx prisma migrate dev --name init
# Expected: Migration created and applied successfully

# Start API server (in separate terminal)
npm run server
# Expected: Server running on http://localhost:3001

# Start frontend dev server (in separate terminal)
npm run dev
# Expected: Vite dev server running on http://localhost:5173

# Or run both concurrently
npm run dev:full
# Expected: Both servers start and run without errors
```

**Manual Verification:**

1. Start application: `npm run dev:full`
2. Navigate to: `http://localhost:5173`
3. Verify: Todo app loads without errors
4. Test create: Add new todo, verify it appears in list
5. Test toggle: Click checkbox, verify completion status changes
6. Test delete: Click delete button, verify todo removed
7. Test persistence: Refresh page, verify todos remain
8. Check console: No errors in browser console
9. Check server: No errors in server terminal

**Feature-Specific Checks:**

- Open Prisma Studio: `npx prisma studio` → Verify todos visible in database
- Test API directly: `curl http://localhost:3001/api/todos` → Verify JSON response
- Stop and restart servers: Verify todos persist across server restarts
- Check database file: Verify `dev.db` file exists in project root
- Test error handling: Stop API server, verify frontend shows error message

## Implementation Notes

### 1. Database Choice: SQLite

SQLite is ideal for this application because:
- Zero configuration required (file-based)
- No external database server needed
- Perfect for development and small-scale apps
- Easy to version control migrations
- Can upgrade to PostgreSQL/MySQL later without major code changes

### 2. API Port Configuration

Using port 3001 for API server to avoid conflict with Vite dev server (5173). Both servers need to run concurrently during development.

### 3. CORS Configuration

CORS must allow requests from `http://localhost:5173` (Vite dev server) to `http://localhost:3001` (API server) for local development.

### 4. Prisma Client Singleton

Important to use singleton pattern for Prisma Client to avoid connection pool exhaustion during development with hot reloading.

### 5. Migration Strategy

Always use Prisma migrations (`migrate dev`) rather than `db push` for production-ready schema management and version control.

## Dependencies

- `prisma` - Prisma CLI for migrations and schema management
- `@prisma/client` - Prisma Client for type-safe database access
- `express` - Web server framework
- `cors` - CORS middleware for Express
- `nodemon` (dev) - Auto-restart server on file changes
- `concurrently` (dev) - Run multiple npm scripts simultaneously

## References

- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)
- [Prisma SQLite Guide](https://www.prisma.io/docs/concepts/database-connectors/sqlite)
- [Express.js Documentation](https://expressjs.com/)
- [Svelte Fetch Tutorial](https://svelte.dev/tutorial/await-blocks)

## Next Steps

1. Install Prisma and initialize with SQLite provider
2. Define Todo schema and run initial migration
3. Create Express API server with CRUD endpoints
4. Refactor frontend to consume API
5. Test persistence across sessions
6. Deploy to production (consider database migration to PostgreSQL)
