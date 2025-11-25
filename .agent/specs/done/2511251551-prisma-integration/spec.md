# Prisma Database Integration

**Status**: completed
**Created**: 2025-11-25
**Package**: example-todo-app
**Total Complexity**: 68 points
**Phases**: 5
**Tasks**: 14
**Overall Avg Complexity**: 4.9/10

## Complexity Breakdown

| Phase                     | Tasks | Total Points | Avg Complexity | Max Task |
| ------------------------- | ----- | ------------ | -------------- | -------- |
| Phase 1: Backend Setup    | 3     | 17           | 5.7/10         | 7/10     |
| Phase 2: Database Schema  | 2     | 11           | 5.5/10         | 6/10     |
| Phase 3: API Layer        | 4     | 21           | 5.3/10         | 6/10     |
| Phase 4: Frontend Integration | 3     | 13           | 4.3/10         | 5/10     |
| Phase 5: Testing & Validation | 2     | 6            | 3.0/10         | 4/10     |
| **Total**                 | **14** | **68**      | **4.9/10**     | **7/10** |

## Overview

Replace the in-memory todo state in the Svelte frontend with a persistent database backend using Prisma ORM and Express.js. This migration will enable data persistence across sessions and provide a foundation for future multi-user support.

## User Story

As a user of the todo app
I want my todos to be saved permanently
So that I don't lose my tasks when I refresh the page or close the browser

## Technical Approach

Implement a RESTful API backend using Express.js with Prisma as the ORM layer, connecting to SQLite for local development. The Svelte frontend will be refactored to make HTTP requests to the backend API instead of managing state locally. The backend will be run concurrently with the Vite dev server during development using `concurrently`.

## Key Design Decisions

1. **SQLite for Development**: Using SQLite as the database for simplicity and zero configuration, easily upgradeable to PostgreSQL for production
2. **RESTful API Design**: Implementing standard REST endpoints (GET, POST, PUT, DELETE) for CRUD operations on todos
3. **Express.js Backend**: Lightweight Node.js framework that integrates seamlessly with the existing JavaScript ecosystem
4. **Concurrent Development**: Using `concurrently` to run both Vite dev server and Express backend simultaneously for streamlined development workflow

## Architecture

### File Structure
```
example-todo-app/
├── prisma/
│   ├── schema.prisma          # Prisma schema definition
│   └── migrations/            # Database migrations
├── server/
│   ├── index.js               # Express server entry point
│   ├── routes/
│   │   └── todos.js           # Todo API routes
│   └── db.js                  # Prisma client instance
├── src/
│   ├── App.svelte             # Modified to use API calls
│   ├── lib/
│   │   └── api.js             # API client functions
│   └── main.js                # Unchanged
└── package.json               # Updated with new dependencies
```

### Integration Points

**Backend Layer**:
- `server/index.js` - Express server setup with CORS and JSON middleware
- `server/routes/todos.js` - RESTful CRUD endpoints for todos
- `server/db.js` - Prisma client singleton

**Database Layer**:
- `prisma/schema.prisma` - Todo model definition with Prisma schema
- SQLite database file generated at `prisma/dev.db`

**Frontend Layer**:
- `src/lib/api.js` - HTTP client functions for todo operations
- `src/App.svelte` - Modified to use async API calls instead of local state

## Implementation Details

### 1. Prisma Schema

Define the Todo model with fields matching the current in-memory structure:

**Key Points**:
- `id` as auto-incrementing integer primary key
- `text` as required string field for todo content
- `completed` boolean defaulting to false
- `flagged` boolean defaulting to false
- Timestamps (`createdAt`, `updatedAt`) for audit trail

### 2. Express API Server

Create a lightweight Express server to handle CRUD operations:

**Key Points**:
- CORS enabled for local development (Vite dev server on different port)
- JSON body parsing middleware
- Error handling middleware for database errors
- Server runs on port 3000 by default

### 3. API Routes

Implement RESTful endpoints:
- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo (toggle completed/flagged)
- `DELETE /api/todos/:id` - Delete todo

**Key Points**:
- Proper HTTP status codes (200, 201, 404, 500)
- Request validation for required fields
- Error responses with descriptive messages

### 4. Frontend API Client

Abstract API calls into reusable functions:

**Key Points**:
- Async/await pattern for all API calls
- Error handling and user-friendly error messages
- Base URL configuration for easy environment switching

### 5. Svelte Component Refactor

Update App.svelte to use API calls:

**Key Points**:
- Load todos on component mount using `onMount`
- Replace local state mutations with API calls
- Add loading states for async operations
- Handle errors gracefully with user feedback

## Files to Create/Modify

### New Files (6)

1. `prisma/schema.prisma` - Prisma schema with Todo model
2. `server/index.js` - Express server entry point
3. `server/routes/todos.js` - Todo CRUD API routes
4. `server/db.js` - Prisma client singleton
5. `src/lib/api.js` - Frontend API client functions
6. `.gitignore` entry - Add `prisma/dev.db*` and `node_modules`

### Modified Files (2)

1. `package.json` - Add Prisma, Express, and development dependencies
2. `src/App.svelte` - Replace local state with API calls

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Backend Setup

**Phase Complexity**: 17 points (avg 5.7/10)

- [ ] 1.1 [5/10] Install backend dependencies (Prisma, Express, CORS)
  - Install `prisma`, `@prisma/client`, `express`, `cors`, `concurrently`
  - File: `package.json`
  - Command: `pnpm add prisma @prisma/client express cors && pnpm add -D concurrently`

- [ ] 1.2 [5/10] Initialize Prisma with SQLite provider
  - Run Prisma init with SQLite datasource
  - File: Creates `prisma/schema.prisma` and `.env`
  - Command: `npx prisma init --datasource-provider sqlite`

- [ ] 1.3 [7/10] Create Express server structure and entry point
  - Set up Express app with middleware (CORS, JSON parsing)
  - Create server folder with modular route structure
  - Files: `server/index.js`, `server/db.js`, `server/routes/todos.js`
  - Command: `node server/index.js` should start server on port 3000

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 2: Database Schema & Migration

**Phase Complexity**: 11 points (avg 5.5/10)

- [ ] 2.1 [5/10] Define Todo model in Prisma schema
  - Add Todo model with id, text, completed, flagged, createdAt, updatedAt
  - File: `prisma/schema.prisma`
  - Verify schema syntax with `npx prisma format`

- [ ] 2.2 [6/10] Run initial migration to create database
  - Generate and apply migration to create todos table
  - File: Creates `prisma/dev.db` and migration files
  - Command: `npx prisma migrate dev --name init`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 3: API Layer Implementation

**Phase Complexity**: 21 points (avg 5.3/10)

- [ ] 3.1 [5/10] Implement GET /api/todos endpoint
  - Fetch all todos ordered by createdAt descending
  - File: `server/routes/todos.js`
  - Test: `curl http://localhost:3000/api/todos`

- [ ] 3.2 [6/10] Implement POST /api/todos endpoint
  - Create new todo with validation (text required)
  - File: `server/routes/todos.js`
  - Test: `curl -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"text":"Test"}'`

- [ ] 3.3 [5/10] Implement PUT /api/todos/:id endpoint
  - Update todo (completed, flagged, text fields)
  - File: `server/routes/todos.js`
  - Test: `curl -X PUT http://localhost:3000/api/todos/1 -H "Content-Type: application/json" -d '{"completed":true}'`

- [ ] 3.4 [5/10] Implement DELETE /api/todos/:id endpoint
  - Delete todo by ID with proper error handling
  - File: `server/routes/todos.js`
  - Test: `curl -X DELETE http://localhost:3000/api/todos/1`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 4: Frontend Integration

**Phase Complexity**: 13 points (avg 4.3/10)

- [ ] 4.1 [4/10] Create API client module with fetch functions
  - Implement `getTodos()`, `createTodo()`, `updateTodo()`, `deleteTodo()`
  - File: `src/lib/api.js`
  - Use `http://localhost:3000` as base URL

- [ ] 4.2 [5/10] Refactor App.svelte to use API calls
  - Replace local state management with API calls
  - Add `onMount` to load todos on component initialization
  - Make all CRUD operations async
  - File: `src/App.svelte`

- [ ] 4.3 [4/10] Update package.json scripts for concurrent dev servers
  - Add `dev:server` script to run Express
  - Modify `dev` script to run both Vite and Express with `concurrently`
  - File: `package.json`
  - Command: `pnpm dev` should start both servers

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 5: Testing & Validation

**Phase Complexity**: 6 points (avg 3.0/10)

- [ ] 5.1 [2/10] Update .gitignore for database and environment files
  - Add `prisma/dev.db`, `prisma/dev.db-journal`, `.env` entries
  - File: `.gitignore`

- [ ] 5.2 [4/10] Verify full CRUD flow works end-to-end
  - Test creating, reading, updating, and deleting todos through UI
  - Verify data persists after page refresh
  - Check that all stats (active, completed, flagged) update correctly

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

## Testing Strategy

### Unit Tests

**Future Enhancement** - Unit tests not included in initial implementation:

- API route handlers should be tested with mock Prisma client
- API client functions should be tested with mock fetch
- Consider adding Vitest for testing in future iteration

### Integration Tests

**Manual Testing Checklist**:

1. Start both servers with `pnpm dev`
2. Create a new todo via UI
3. Refresh page and verify todo persists
4. Toggle todo completion status
5. Toggle todo flag status
6. Delete todo
7. Verify stats update correctly for all operations

### E2E Tests

**Future Enhancement** - E2E tests not included in initial implementation:

Consider adding Playwright tests for critical user flows:
- Complete todo workflow (create → complete → delete)
- Flag functionality
- Data persistence across page reloads

## Success Criteria

- [ ] Prisma schema defines Todo model with all required fields
- [ ] Database migrations run successfully and create todos table
- [ ] Express server starts without errors and listens on port 3000
- [ ] All API endpoints (GET, POST, PUT, DELETE) return correct responses
- [ ] Frontend successfully fetches and displays todos from API
- [ ] Creating a todo via UI persists to database
- [ ] Toggling completion/flag status updates database
- [ ] Deleting a todo removes it from database
- [ ] Page refresh loads todos from database (no data loss)
- [ ] Stats (active, completed, flagged) calculate correctly from database data
- [ ] No console errors in browser or terminal
- [ ] Development workflow runs both servers with single `pnpm dev` command

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Install dependencies
pnpm install
# Expected: All dependencies installed successfully

# Format Prisma schema
npx prisma format
# Expected: Schema formatted successfully

# Run database migration
npx prisma migrate dev --name init
# Expected: Migration applied successfully, database created

# Generate Prisma Client
npx prisma generate
# Expected: Prisma Client generated successfully

# Start development servers
pnpm dev
# Expected: Both Vite (port 5173) and Express (port 3000) servers start
```

**Manual Verification:**

1. Start application: `pnpm dev`
2. Navigate to: `http://localhost:5173`
3. Verify: Page loads without errors
4. Test: Create a new todo "Test persistence"
5. Verify: Todo appears in list
6. Test: Refresh the page (Cmd+R / Ctrl+R)
7. Verify: Todo is still present (persisted to database)
8. Test: Toggle todo completion checkbox
9. Verify: Completed count increases, active count decreases
10. Test: Click flag button on todo
11. Verify: Flagged count increases, todo has yellow background
12. Test: Delete the todo
13. Verify: Todo removed, counts update correctly
14. Check console: No errors in browser DevTools console
15. Check terminal: No errors from Express server

**Feature-Specific Checks:**

- Database file exists at `prisma/dev.db`
- API responds to direct curl requests:
  - `curl http://localhost:3000/api/todos` returns JSON array
- Prisma Studio can view data: `npx prisma studio`
- Data persists after stopping and restarting servers

## Implementation Notes

### 1. Database Choice - SQLite

Using SQLite for development simplicity. To migrate to PostgreSQL for production:
1. Update `datasource` in `prisma/schema.prisma` to `postgresql`
2. Update `DATABASE_URL` in `.env` to PostgreSQL connection string
3. Run `npx prisma migrate dev` to generate new migrations
4. No code changes required in application (Prisma abstracts database differences)

### 2. CORS Configuration

The Express server enables CORS for `http://localhost:5173` (Vite dev server). For production:
- Update CORS origin to production frontend URL
- Consider using environment variables for configuration
- Add proper security headers

### 3. Error Handling

Current implementation includes basic error handling. Consider adding:
- Request validation middleware (e.g., express-validator)
- Global error handler for consistent error responses
- Logging framework (e.g., Winston, Pino) for debugging

### 4. Auto-incrementing IDs

Prisma's `@default(autoincrement())` handles ID generation. The frontend no longer needs to track `nextId` since the database manages this automatically.

## Dependencies

- `prisma` (^5.x) - Prisma CLI for migrations and codegen
- `@prisma/client` (^5.x) - Prisma Client for database queries
- `express` (^4.x) - Web framework for API server
- `cors` (^2.x) - CORS middleware for Express
- `concurrently` (^8.x) - Run multiple npm scripts concurrently (dev dependency)

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Svelte Tutorial - Async/Await](https://svelte.dev/tutorial/await-blocks)

## Next Steps

1. Install Prisma and Express dependencies
2. Initialize Prisma with SQLite
3. Create Express server structure
4. Define Todo schema in Prisma
5. Run database migrations
6. Implement API routes
7. Create frontend API client
8. Refactor Svelte component to use API
9. Update development scripts
10. Test full CRUD workflow
