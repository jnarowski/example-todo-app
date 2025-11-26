# Prisma Database Integration

**Status**: review
**Created**: 2025-11-26
**Package**: example-todo-app
**Total Complexity**: 68 points
**Phases**: 4
**Tasks**: 12
**Overall Avg Complexity**: 5.7/10

## Complexity Breakdown

| Phase                        | Tasks | Total Points | Avg Complexity | Max Task |
| ---------------------------- | ----- | ------------ | -------------- | -------- |
| Phase 1: Setup & Config      | 3     | 14           | 4.7/10         | 6/10     |
| Phase 2: Schema & Migrations | 2     | 10           | 5.0/10         | 6/10     |
| Phase 3: Backend API         | 4     | 28           | 7.0/10         | 8/10     |
| Phase 4: Frontend Integration| 3     | 16           | 5.3/10         | 7/10     |
| **Total**                    | **12**| **68**       | **5.7/10**     | **8/10** |

## Overview

Replace the current in-memory todo storage with a persistent Prisma-based database backend. This will enable todos to persist across page refreshes and provide a foundation for multi-user support and advanced features.

## User Story

As a user
I want my todos to be saved to a database
So that my tasks persist across browser sessions and page refreshes

## Technical Approach

Implement a full-stack solution with Prisma ORM connected to SQLite (development) and PostgreSQL (production). Create REST API endpoints in a new Node.js/Express backend server, and update the Svelte frontend to consume these APIs instead of managing state locally.

## Key Design Decisions

1. **Database Choice**: SQLite for local development (zero-config), PostgreSQL for production (scalability)
2. **API Architecture**: REST endpoints with Express.js for simplicity and broad compatibility
3. **Migration Strategy**: Use Prisma Migrate for type-safe schema evolution and rollback capability

## Architecture

### File Structure
```
├── prisma/
│   ├── schema.prisma          # Prisma schema definition
│   └── migrations/            # Database migrations
├── server/
│   ├── index.js               # Express server entry point
│   ├── routes/
│   │   └── todos.js           # Todo CRUD endpoints
│   └── lib/
│       └── prisma.js          # Prisma client singleton
├── src/
│   ├── App.svelte             # Updated with API calls
│   └── lib/
│       └── api.js             # API client utilities
└── package.json               # Updated with new dependencies
```

### Integration Points

**Database Layer**:
- `prisma/schema.prisma` - Todo model definition with id, text, completed, createdAt, updatedAt
- `server/lib/prisma.js` - Prisma client initialization and singleton pattern

**Backend API**:
- `server/index.js` - Express server setup with CORS, JSON middleware, error handling
- `server/routes/todos.js` - CRUD endpoints (GET /todos, POST /todos, PATCH /todos/:id, DELETE /todos/:id)

**Frontend**:
- `src/lib/api.js` - Centralized API client with error handling
- `src/App.svelte` - Replace local state with API calls, add loading states and error handling

## Implementation Details

### 1. Prisma Setup

Initialize Prisma with SQLite for development. Configure the database schema with a Todo model containing all necessary fields including timestamps for audit trails.

**Key Points**:
- Use SQLite for zero-config local development
- Configure environment variables for database connections
- Set up Prisma Client generation in postinstall script

### 2. Database Schema

Design a simple but extensible Todo schema with proper indexing and constraints. Include soft-delete capability for future requirements.

**Key Points**:
- Auto-incrementing integer ID for simplicity
- Text field with reasonable length constraints
- Boolean completed flag with default false
- Timestamps for audit trail

### 3. Backend API Server

Create an Express.js server with RESTful endpoints for todos. Implement proper error handling, validation, and CORS configuration for frontend integration.

**Key Points**:
- Separate server process from Vite dev server
- RESTful conventions for endpoint naming
- Structured error responses with status codes
- Request validation middleware

### 4. Frontend API Integration

Update the Svelte app to make HTTP requests instead of managing local state. Add loading states, error handling, and optimistic updates for better UX.

**Key Points**:
- Centralized API client for consistency
- Loading states during async operations
- Error boundaries with user-friendly messages
- Optimistic updates for perceived performance

## Files to Create/Modify

### New Files (7)

1. `prisma/schema.prisma` - Prisma schema with Todo model
2. `server/index.js` - Express server entry point
3. `server/routes/todos.js` - Todo CRUD route handlers
4. `server/lib/prisma.js` - Prisma client singleton
5. `src/lib/api.js` - Frontend API client utilities
6. `.env` - Environment variables for database URL
7. `.env.example` - Example environment configuration

### Modified Files (2)

1. `package.json` - Add Prisma, Express, and related dependencies
2. `src/App.svelte` - Replace local state with API calls, add loading/error states

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Setup & Configuration

**Phase Complexity**: 14 points (avg 4.7/10)

- [x] 1.1 [4/10] Install Prisma and backend dependencies
  - Add @prisma/client, prisma, express, cors, dotenv packages
  - Update package.json with new scripts for database operations
  - File: `package.json`
  - Command: `pnpm add @prisma/client express cors dotenv && pnpm add -D prisma`

- [x] 1.2 [6/10] Initialize Prisma with SQLite configuration
  - Run prisma init command to create schema and .env
  - Configure SQLite database URL for development
  - Create .env.example for documentation
  - Files: `prisma/schema.prisma`, `.env`, `.env.example`
  - Command: `pnpm prisma init --datasource-provider sqlite`

- [x] 1.3 [4/10] Create Prisma client singleton module
  - Implement singleton pattern to prevent multiple instances
  - Add proper error handling and logging
  - Export configured client for use in routes
  - File: `server/lib/prisma.js`

#### Completion Notes

- What was implemented: Installed all Prisma and backend dependencies (@prisma/client, prisma CLI, express, cors, dotenv). Initialized Prisma with SQLite configuration. Created Prisma client singleton module with proper logging and graceful shutdown handling.
- Deviations from plan (if any): Prisma 7.0 created a prisma.config.ts file in addition to .env - this is fine and doesn't affect functionality.
- Important context or decisions: Used singleton pattern to prevent multiple client instances during hot-reload in development. Added environment-based logging (verbose in dev, errors only in prod).
- Known issues or follow-ups (if any): None

### Phase 2: Schema & Migrations

**Phase Complexity**: 10 points (avg 5.0/10)

- [x] 2.1 [4/10] Define Todo model in Prisma schema
  - Create Todo model with id, text, completed, createdAt, updatedAt fields
  - Add appropriate indexes and constraints
  - Configure default values and auto-generation
  - File: `prisma/schema.prisma`

- [x] 2.2 [6/10] Create and apply initial migration
  - Generate migration files with descriptive name
  - Apply migration to create database and tables
  - Verify schema in database with Prisma Studio
  - Command: `pnpm prisma migrate dev --name init`

#### Completion Notes

- What was implemented: Created Todo model with id, text, completed, createdAt, updatedAt fields. Applied initial migration to create database and tables. Generated Prisma Client for use in application.
- Deviations from plan (if any): Prisma 7 uses prisma.config.ts instead of url in schema.prisma. Removed url property from datasource block as it's now configured in prisma.config.ts. Prisma Client generated to src/generated/prisma instead of node_modules.
- Important context or decisions: Added index on createdAt for efficient sorting. Used SQLite with file:./dev.db for zero-config local development.
- Known issues or follow-ups (if any): Need to update prisma client import path in server/lib/prisma.js to match new generation location.

### Phase 3: Backend API Implementation

**Phase Complexity**: 28 points (avg 7.0/10)

- [x] 3.1 [8/10] Create Express server with middleware
  - Set up Express app with JSON parsing, CORS, error handling
  - Configure port and environment-based settings
  - Add request logging for debugging
  - Implement graceful shutdown for database connections
  - File: `server/index.js`

- [x] 3.2 [7/10] Implement GET /todos endpoint
  - Fetch all todos from database ordered by createdAt
  - Include proper error handling and status codes
  - Add response shape validation
  - File: `server/routes/todos.js`

- [x] 3.3 [7/10] Implement POST /todos endpoint
  - Validate request body for required fields
  - Create new todo with Prisma client
  - Return created todo with 201 status
  - Handle duplicate and validation errors
  - File: `server/routes/todos.js`

- [x] 3.4 [6/10] Implement PATCH /todos/:id and DELETE /todos/:id endpoints
  - PATCH: Toggle completed status or update text
  - DELETE: Remove todo from database
  - Handle not found errors with 404
  - Return appropriate response for each operation
  - File: `server/routes/todos.js`

#### Completion Notes

- What was implemented: Created Express server with full CRUD API for todos. Implemented GET /todos (list all), POST /todos (create), PATCH /todos/:id (update), and DELETE /todos/:id (remove). Added comprehensive error handling, request validation, CORS configuration, and graceful shutdown.
- Deviations from plan (if any): None. Implemented all endpoints as specified with proper validation and error handling.
- Important context or decisions: Used 204 No Content for DELETE responses. Added text length validation (max 500 chars). Implemented structured error responses with consistent format. Added health check endpoint at /health for monitoring. CORS configured to allow localhost:5173 (Vite dev server).
- Known issues or follow-ups (if any): None

### Phase 4: Frontend Integration

**Phase Complexity**: 16 points (avg 5.3/10)

- [x] 4.1 [5/10] Create API client utility module
  - Implement fetch wrapper with base URL configuration
  - Add error handling and response parsing
  - Create typed methods for each endpoint (getTodos, createTodo, etc.)
  - File: `src/lib/api.js`

- [x] 4.2 [7/10] Update App.svelte with API integration
  - Replace local state management with API calls
  - Add loading states during API requests
  - Implement error handling and user feedback
  - Add optimistic updates for better UX
  - Fetch todos on component mount
  - File: `src/App.svelte`

- [x] 4.3 [4/10] Update package.json scripts for concurrent dev servers
  - Add server dev script to start Express backend
  - Update main dev script to run both Vite and server concurrently
  - Add concurrently package for process management
  - File: `package.json`
  - Command: `pnpm add -D concurrently`

#### Completion Notes

- What was implemented: Created API client utility module with error handling. Updated App.svelte to replace in-memory state with API calls. Added loading states, error banners with retry functionality, and optimistic updates for instant UI feedback. Configured concurrent dev servers with single command to run both frontend and backend.
- Deviations from plan (if any): None. All features implemented as specified.
- Important context or decisions: Implemented optimistic updates with rollback on errors for better UX. Loading states only show on initial load to avoid UI flickering. Error messages display with retry button. API base URL configurable via VITE_API_URL env var. Dev script uses concurrently to run both servers with colored output prefixes.
- Known issues or follow-ups (if any): None

## Testing Strategy

### Unit Tests

**`server/routes/todos.test.js`** - Test todo CRUD operations:

```javascript
describe('Todo API', () => {
  test('GET /todos returns all todos', async () => {
    const response = await request(app).get('/todos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /todos creates a new todo', async () => {
    const newTodo = { text: 'Test todo' };
    const response = await request(app).post('/todos').send(newTodo);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.text).toBe('Test todo');
    expect(response.body.completed).toBe(false);
  });

  test('PATCH /todos/:id toggles completion', async () => {
    // Test implementation
  });

  test('DELETE /todos/:id removes todo', async () => {
    // Test implementation
  });
});
```

### Integration Tests

Test the full stack integration with a test database. Verify that frontend API calls correctly communicate with the backend and that data persists across requests.

### E2E Tests

**`tests/e2e/todo-persistence.spec.js`** - Test todo persistence:

1. Create a new todo
2. Refresh the page
3. Verify todo still exists
4. Toggle completion status
5. Refresh the page
6. Verify completion status persisted

## Success Criteria

- [ ] Todos persist across page refreshes
- [ ] All CRUD operations (create, read, update, delete) work correctly
- [ ] Loading states display during async operations
- [ ] Error messages show when operations fail
- [ ] Database migrations run successfully
- [ ] Both dev servers (frontend and backend) start with single command
- [ ] No console errors in browser or server logs
- [ ] TypeScript types generated from Prisma schema
- [ ] Environment variables properly configured

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Install dependencies
pnpm install
# Expected: All packages installed successfully

# Generate Prisma client
pnpm prisma generate
# Expected: ✔ Generated Prisma Client

# Run database migrations
pnpm prisma migrate dev
# Expected: Database migrations applied successfully

# Build verification
pnpm build
# Expected: Successful build with no errors

# Start backend server (in separate terminal)
pnpm run server
# Expected: Server running on http://localhost:3001

# Start frontend dev server (in separate terminal)
pnpm run dev
# Expected: Vite dev server running on http://localhost:5173
```

**Manual Verification:**

1. Start application: `pnpm run dev` (should start both servers)
2. Navigate to: `http://localhost:5173`
3. Verify: Add a new todo and see it appear in the list
4. Test: Toggle completion status and delete a todo
5. Refresh the page
6. Verify: All todos persist and maintain their state
7. Check browser console: No errors
8. Check server logs: Successful API requests logged

**Feature-Specific Checks:**

- Open Prisma Studio (`pnpm prisma studio`) and verify todos appear in database
- Create multiple todos, refresh page, verify all persist
- Test error handling by stopping server and attempting to add todo
- Verify loading states appear briefly during operations
- Check network tab to confirm API calls are being made

## Implementation Notes

### 1. Database Connection Management

Prisma Client should be instantiated once and reused across all requests. Use a singleton pattern to prevent connection pool exhaustion in development when hot-reloading occurs.

### 2. CORS Configuration

Configure CORS to allow requests from the Vite dev server (http://localhost:5173). In production, update to allow only the deployed frontend domain.

### 3. Error Handling Strategy

Implement consistent error response format:
```json
{
  "error": "Error message",
  "details": "Additional context"
}
```

### 4. Environment Variables

Create separate .env files for development and production. Never commit .env to version control. Document all required variables in .env.example.

## Dependencies

- `@prisma/client` - Prisma ORM client
- `prisma` - Prisma CLI (dev dependency)
- `express` - Web framework for Node.js
- `cors` - CORS middleware for Express
- `dotenv` - Environment variable management
- `concurrently` - Run multiple processes concurrently (dev dependency)

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Svelte Tutorial - Fetching Data](https://svelte.dev/tutorial/fetching-data)

## Next Steps

1. Install Prisma and backend dependencies
2. Initialize Prisma with SQLite datasource
3. Define Todo schema in prisma/schema.prisma
4. Create initial database migration
5. Implement Express server with todo routes
6. Create API client module in frontend
7. Update App.svelte to use API calls
8. Test full flow with manual verification
9. Add error handling and loading states
10. Document setup process in README
