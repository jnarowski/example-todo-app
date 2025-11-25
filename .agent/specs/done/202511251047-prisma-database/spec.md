# Prisma Database Integration

**Status**: completed
**Created**: 2025-11-25
**Package**: example-todo-app
**Total Complexity**: 54 points
**Phases**: 4
**Tasks**: 11
**Overall Avg Complexity**: 4.9/10

## Complexity Breakdown

| Phase           | Tasks   | Total Points | Avg Complexity | Max Task   |
| --------------- | ------- | ------------ | -------------- | ---------- |
| Phase 1: Setup and Configuration | 3 | 14 | 4.7/10 | 6/10 |
| Phase 2: Backend API Creation | 4 | 24 | 6.0/10 | 7/10 |
| Phase 3: Frontend Integration | 3 | 13 | 4.3/10 | 5/10 |
| Phase 4: Testing and Migration | 1 | 3 | 3.0/10 | 3/10 |
| **Total** | **11** | **54** | **4.9/10** | **7/10** |

## Overview

Replace in-memory todo storage with Prisma ORM and SQLite database to enable persistent data storage. This feature will ensure todos are saved between sessions and provide a foundation for future enhancements like user authentication and multi-device sync.

## User Story

As a user
I want my todos to persist between browser sessions
So that I don't lose my task list when I close the browser or refresh the page

## Technical Approach

Implement a full-stack solution using Prisma ORM with SQLite as the database. Create a REST API backend using Express to handle CRUD operations, and update the Svelte frontend to communicate with the API instead of managing state locally. Use Vite's proxy configuration to route API requests during development.

## Key Design Decisions

1. **Database Choice: SQLite**: Lightweight, zero-configuration database perfect for local development and small-scale deployments. Can be easily migrated to PostgreSQL or MySQL later if needed.
2. **API Layer: Express**: Simple REST API with Express provides clear separation between frontend and backend, making the architecture more maintainable and testable.
3. **Development Workflow**: Use Vite proxy to route `/api` requests to Express server during development, avoiding CORS issues and simplifying local development setup.

## Architecture

### File Structure
```
example-todo-app/
├── prisma/
│   ├── schema.prisma          # Prisma schema with Todo model
│   └── dev.db                 # SQLite database file (generated)
├── src/
│   ├── server/
│   │   ├── index.js           # Express server entry point
│   │   └── routes/
│   │       └── todos.js       # Todo CRUD endpoints
│   ├── lib/
│   │   └── api.js             # API client for frontend
│   ├── App.svelte             # Updated with API calls
│   ├── main.js                # Frontend entry point
│   └── app.css                # Existing styles
├── package.json               # Updated with Prisma and Express
└── vite.config.js             # Updated with proxy config
```

### Integration Points

**Database Layer**:
- `prisma/schema.prisma` - Define Todo model with id, text, completed, createdAt, updatedAt fields
- Prisma Client - Auto-generated client for type-safe database access

**Backend API**:
- `src/server/index.js` - Express server setup, Prisma client initialization, error handling
- `src/server/routes/todos.js` - REST endpoints for todos (GET, POST, PUT, DELETE)

**Frontend**:
- `src/lib/api.js` - API client wrapper with fetch for all todo operations
- `src/App.svelte` - Replace local state management with API calls, add loading states and error handling

**Development**:
- `vite.config.js` - Proxy `/api` requests to Express server on port 3001

## Implementation Details

### 1. Prisma Schema and Database Setup

Define the Todo model with Prisma schema DSL, including all necessary fields and relationships. Initialize Prisma with SQLite provider for local development.

**Key Points**:
- Use auto-incrementing integer ID for simplicity
- Include timestamps (createdAt, updatedAt) for audit trail
- Set up SQLite as provider for zero-configuration development
- Generate Prisma Client after schema creation

### 2. Express Backend API

Create a REST API server with Express that handles all todo CRUD operations. Use Prisma Client for database access with proper error handling and validation.

**Key Points**:
- Use Express JSON middleware for request parsing
- Implement RESTful endpoints following conventions (GET /api/todos, POST /api/todos, etc.)
- Add error handling middleware for database errors
- Use Prisma Client with proper async/await patterns
- Enable CORS for development

### 3. Frontend API Client and State Management

Update Svelte component to use API calls instead of local state. Create a dedicated API client module for fetch calls with error handling.

**Key Points**:
- Create reusable API client with base URL configuration
- Add loading states for all async operations
- Implement error handling with user-friendly messages
- Use async/await with proper error boundaries
- Maintain reactive UI with Svelte's reactivity system

### 4. Development Environment Configuration

Configure Vite to proxy API requests and set up development scripts for running both frontend and backend servers.

**Key Points**:
- Use Vite proxy to route `/api` requests to Express
- Update package.json scripts for concurrent server runs
- Add environment variable support for API URLs
- Configure hot reload for both frontend and backend

## Files to Create/Modify

### New Files (5)

1. `prisma/schema.prisma` - Prisma schema defining Todo model and database configuration
2. `src/server/index.js` - Express server with Prisma client and middleware setup
3. `src/server/routes/todos.js` - REST API endpoints for todo CRUD operations
4. `src/lib/api.js` - Frontend API client wrapper for fetch calls
5. `.env` - Environment variables for database URL and API configuration

### Modified Files (3)

1. `package.json` - Add Prisma, Express, and related dependencies; update scripts
2. `src/App.svelte` - Replace local state with API calls, add loading/error states
3. `vite.config.js` - Add proxy configuration for API requests

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Setup and Configuration

**Phase Complexity**: 14 points (avg 4.7/10)

- [ ] 1.1 [4/10] Install Prisma dependencies and initialize Prisma with SQLite
  - Install `prisma`, `@prisma/client`, and `prisma` as dev dependency
  - File: `package.json`
  - Run: `npm install prisma @prisma/client` and `npx prisma init --datasource-provider sqlite`

- [ ] 1.2 [6/10] Create Prisma schema with Todo model
  - Define Todo model with fields: id (Int, autoincrement), text (String), completed (Boolean), createdAt (DateTime), updatedAt (DateTime)
  - Configure SQLite datasource with file path `./prisma/dev.db`
  - File: `prisma/schema.prisma`
  - Run: `npx prisma generate` after schema creation

- [ ] 1.3 [4/10] Install Express and server dependencies
  - Install `express`, `cors`, and `dotenv` packages
  - File: `package.json`
  - Run: `npm install express cors dotenv`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 2: Backend API Creation

**Phase Complexity**: 24 points (avg 6.0/10)

- [ ] 2.1 [7/10] Create Express server with Prisma Client integration
  - Set up Express app with JSON middleware and CORS
  - Initialize Prisma Client with error handling
  - Configure server to listen on port 3001
  - Add graceful shutdown for Prisma Client
  - File: `src/server/index.js`
  - Run: `node src/server/index.js` to test server starts

- [ ] 2.2 [6/10] Implement GET /api/todos endpoint
  - Fetch all todos from database ordered by createdAt DESC
  - Handle database errors with 500 status
  - File: `src/server/routes/todos.js`
  - Test with: `curl http://localhost:3001/api/todos`

- [ ] 2.3 [6/10] Implement POST /api/todos endpoint
  - Validate request body for required `text` field
  - Create new todo with completed=false, auto-generated timestamps
  - Return created todo with 201 status
  - File: `src/server/routes/todos.js`
  - Test with: `curl -X POST http://localhost:3001/api/todos -H "Content-Type: application/json" -d '{"text":"Test todo"}'`

- [ ] 2.4 [5/10] Implement PUT /api/todos/:id and DELETE /api/todos/:id endpoints
  - PUT: Update todo completed status and text, return updated todo
  - DELETE: Remove todo by id, return 204 status
  - Handle 404 for non-existent todos
  - File: `src/server/routes/todos.js`
  - Test with curl commands for both endpoints

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 3: Frontend Integration

**Phase Complexity**: 13 points (avg 4.3/10)

- [ ] 3.1 [4/10] Create frontend API client module
  - Implement fetchTodos, createTodo, updateTodo, deleteTodo functions
  - Use fetch API with proper error handling
  - Configure base URL as `/api` for Vite proxy
  - File: `src/lib/api.js`

- [ ] 3.2 [5/10] Update App.svelte to use API calls
  - Replace local state initialization with fetchTodos on mount
  - Update addTodo, toggleTodo, deleteTodo to call API
  - Add loading state (isLoading boolean) during API calls
  - Update todos array after successful API responses
  - File: `src/App.svelte`

- [ ] 3.3 [4/10] Add error handling and loading states to UI
  - Display loading spinner or message during API calls
  - Show error messages for failed API requests
  - Disable buttons during loading states
  - File: `src/App.svelte`

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 4: Testing and Migration

**Phase Complexity**: 3 points (avg 3.0/10)

- [ ] 4.1 [3/10] Run Prisma migration and update development scripts
  - Run `npx prisma migrate dev --name init` to create initial migration
  - Update package.json with `dev:server` and `dev:all` scripts
  - Verify database file created at `prisma/dev.db`
  - File: `package.json`
  - Run: `npm run dev:all` to test both servers together

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

## Testing Strategy

### Unit Tests

No unit tests required initially. Future enhancements could include:
- API endpoint tests with supertest
- Prisma client mocking for isolated testing

### Integration Tests

**Manual integration testing**:
1. Start Express server: `node src/server/index.js`
2. Test each endpoint with curl or Postman
3. Verify database state with Prisma Studio: `npx prisma studio`

### E2E Tests

**Manual E2E testing flow**:
1. Start both servers with `npm run dev:all`
2. Open browser to `http://localhost:5173`
3. Create several todos - verify they appear in UI
4. Toggle todo completion - verify state persists
5. Delete todo - verify it's removed
6. Refresh page - verify todos are still present (persistence test)
7. Check browser devtools network tab for API calls

## Success Criteria

- [ ] Prisma schema created with Todo model and SQLite database
- [ ] Express server running on port 3001 with all CRUD endpoints
- [ ] All API endpoints return proper status codes and JSON responses
- [ ] Frontend successfully calls API for all todo operations
- [ ] Todos persist between page refreshes and browser sessions
- [ ] Loading states display during API operations
- [ ] Error messages show for failed API requests
- [ ] Database file created at `prisma/dev.db` with migrations applied
- [ ] No TypeScript/build errors in Vite build
- [ ] Vite proxy correctly routes `/api` requests to Express

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

# Build frontend
npm run build
# Expected: Vite build completes without errors

# Type checking (if TypeScript configured)
npx tsc --noEmit
# Expected: No type errors (or skip if using plain JS)
```

**Manual Verification:**

1. Start Express server: `node src/server/index.js`
2. In separate terminal, start Vite dev server: `npm run dev`
3. Navigate to: `http://localhost:5173`
4. Verify: Add new todos - they should appear in the list
5. Verify: Toggle todo completion - checkbox state should persist
6. Verify: Delete todos - they should disappear
7. Verify: Refresh page - all todos should still be present
8. Check console: No errors or warnings in browser devtools
9. Check network tab: API calls to `/api/todos` should succeed with 200/201 status

**Feature-Specific Checks:**

- Open Prisma Studio (`npx prisma studio`) and verify todos table contains data
- Test API directly with curl to ensure backend works independently
- Verify database file exists at `prisma/dev.db` and contains data
- Test error handling by stopping Express server and trying to add a todo
- Check that timestamps (createdAt, updatedAt) are correctly stored

## Implementation Notes

### 1. Development Server Setup

For development, you'll need to run both Express and Vite servers simultaneously. Consider using `concurrently` package or npm-run-all for easier development workflow.

### 2. Prisma Client Generation

After any schema changes, always run `npx prisma generate` to regenerate the Prisma Client. Consider adding a postinstall script to automate this.

### 3. Database Location

The SQLite database file (`prisma/dev.db`) should be added to `.gitignore` to avoid committing local data. Migrations in `prisma/migrations/` should be committed.

### 4. Error Handling Strategy

Implement consistent error handling across the API with proper HTTP status codes:
- 200: Successful GET/PUT
- 201: Successful POST (created)
- 204: Successful DELETE (no content)
- 400: Bad request (validation errors)
- 404: Resource not found
- 500: Server/database errors

### 5. Future Enhancements

This implementation provides a foundation for:
- User authentication (add userId to Todo model)
- Data filtering and pagination
- Real-time updates with WebSockets
- Migration to PostgreSQL for production
- API rate limiting and security middleware

## Dependencies

- `@prisma/client` (^5.0.0) - Prisma ORM client
- `prisma` (^5.0.0) - Prisma CLI tool
- `express` (^4.18.0) - Web framework for Node.js
- `cors` (^2.8.5) - CORS middleware for Express
- `dotenv` (^16.0.0) - Environment variable management
- `concurrently` (optional) - Run multiple commands concurrently for development

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)
- [Svelte Lifecycle](https://svelte.dev/docs#run-time-svelte-onmount)

## Next Steps

1. Install Prisma and initialize with SQLite database
2. Create Prisma schema with Todo model
3. Set up Express server with Prisma Client
4. Implement REST API endpoints for CRUD operations
5. Create frontend API client module
6. Update App.svelte to use API instead of local state
7. Add loading and error states to UI
8. Configure Vite proxy for API requests
9. Run database migration and test end-to-end
10. Verify all todos persist between sessions
