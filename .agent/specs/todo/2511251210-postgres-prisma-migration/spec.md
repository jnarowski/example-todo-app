# PostgreSQL Database with Prisma Integration

**Status**: review
**Created**: 2025-11-25
**Package**: example-todo-app
**Total Complexity**: 62 points
**Phases**: 4
**Tasks**: 12
**Overall Avg Complexity**: 5.2/10

## Complexity Breakdown

| Phase           | Tasks   | Total Points | Avg Complexity | Max Task   |
| --------------- | ------- | ------------ | -------------- | ---------- |
| Phase 1: Setup and Configuration | 4     | 18          | 4.5/10       | 6/10     |
| Phase 2: Backend API Creation | 4     | 25          | 6.3/10       | 8/10     |
| Phase 3: Frontend Integration | 3     | 13          | 4.3/10       | 5/10     |
| Phase 4: Testing and Deployment | 1     | 6          | 6.0/10       | 6/10     |
| **Total**       | **12** | **62**      | **5.2/10**   | **8/10** |

## Overview

Replace in-memory todo storage with Prisma ORM and PostgreSQL database to enable persistent, production-ready data storage. This feature will ensure todos are saved between sessions and provide a robust foundation for future enhancements like user authentication and multi-device sync.

## User Story

As a user
I want my todos to persist between browser sessions
So that I don't lose my task list when I close the browser or refresh the page

## Technical Approach

Implement a full-stack solution using Prisma ORM with PostgreSQL as the database. Create a REST API backend using Express to handle CRUD operations, and update the Svelte frontend to communicate with the API instead of managing state locally. Use Docker for local PostgreSQL instance and Vite's proxy configuration to route API requests during development.

## Key Design Decisions

1. **Database Choice: PostgreSQL**: Production-grade relational database with excellent JSON support, ACID compliance, and scalability. Better choice than SQLite for applications that may grow beyond local-only usage.
2. **API Layer: Express**: Simple REST API with Express provides clear separation between frontend and backend, making the architecture more maintainable and testable.
3. **Development Workflow**: Use Docker Compose for local PostgreSQL instance, Vite proxy to route `/api` requests to Express server during development, avoiding CORS issues and simplifying local development setup.

## Architecture

### File Structure
```
example-todo-app/
├── docker-compose.yml         # PostgreSQL container configuration
├── prisma/
│   ├── schema.prisma          # Prisma schema with Todo model
│   └── migrations/            # Database migration files
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
├── .env                       # Environment variables
├── .env.example               # Example environment variables
├── package.json               # Updated with Prisma and Express
└── vite.config.js             # Updated with proxy config
```

### Integration Points

**Database Layer**:
- `prisma/schema.prisma` - Define Todo model with id, text, completed, createdAt, updatedAt fields
- Prisma Client - Auto-generated client for type-safe database access
- PostgreSQL - Running in Docker container on port 5432

**Backend API**:
- `src/server/index.js` - Express server setup, Prisma client initialization, error handling
- `src/server/routes/todos.js` - REST endpoints for todos (GET, POST, PUT, DELETE)

**Frontend**:
- `src/lib/api.js` - API client wrapper with fetch for all todo operations
- `src/App.svelte` - Replace local state management with API calls, add loading states and error handling

**Development**:
- `vite.config.js` - Proxy `/api` requests to Express server on port 3001
- `docker-compose.yml` - PostgreSQL container with persistent volume

## Implementation Details

### 1. PostgreSQL and Docker Setup

Set up PostgreSQL database using Docker Compose for local development with proper volume persistence and environment configuration.

**Key Points**:
- Use official PostgreSQL Docker image (latest stable version)
- Configure persistent volume for data retention
- Set up environment variables for database credentials
- Expose port 5432 for local connections
- Include healthcheck for container monitoring

### 2. Prisma Schema and Database Configuration

Define the Todo model with Prisma schema DSL, including all necessary fields and relationships. Configure Prisma with PostgreSQL provider and connection pooling.

**Key Points**:
- Use auto-incrementing serial ID (PostgreSQL native)
- Include timestamps (createdAt, updatedAt) for audit trail
- Set up PostgreSQL as provider with connection URL
- Configure connection pooling for performance
- Generate Prisma Client after schema creation

### 3. Express Backend API

Create a REST API server with Express that handles all todo CRUD operations. Use Prisma Client for database access with proper error handling, validation, and connection management.

**Key Points**:
- Use Express JSON middleware for request parsing
- Implement RESTful endpoints following conventions (GET /api/todos, POST /api/todos, etc.)
- Add error handling middleware for database errors and connection issues
- Use Prisma Client with proper async/await patterns
- Enable CORS for development
- Implement graceful shutdown for Prisma connections

### 4. Frontend API Client and State Management

Update Svelte component to use API calls instead of local state. Create a dedicated API client module for fetch calls with error handling and loading states.

**Key Points**:
- Create reusable API client with base URL configuration
- Add loading states for all async operations
- Implement error handling with user-friendly messages
- Use async/await with proper error boundaries
- Maintain reactive UI with Svelte's reactivity system
- Add retry logic for failed requests

## Files to Create/Modify

### New Files (7)

1. `docker-compose.yml` - PostgreSQL container configuration with volumes and environment
2. `prisma/schema.prisma` - Prisma schema defining Todo model and PostgreSQL configuration
3. `src/server/index.js` - Express server with Prisma client and middleware setup
4. `src/server/routes/todos.js` - REST API endpoints for todo CRUD operations
5. `src/lib/api.js` - Frontend API client wrapper for fetch calls
6. `.env` - Environment variables for database URL and API configuration
7. `.env.example` - Example environment variables template for developers

### Modified Files (3)

1. `package.json` - Add Prisma, Express, and related dependencies; update scripts
2. `src/App.svelte` - Replace local state with API calls, add loading/error states
3. `vite.config.js` - Add proxy configuration for API requests

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Setup and Configuration

**Phase Complexity**: 18 points (avg 4.5/10)

- [x] 1.1 [5/10] Create Docker Compose configuration for PostgreSQL
  - Create docker-compose.yml with PostgreSQL 16 service
  - Configure environment variables (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB)
  - Set up named volume for data persistence
  - Expose port 5432 with port mapping
  - Add healthcheck for database readiness
  - File: `docker-compose.yml`
  - Run: `docker-compose up -d` to start PostgreSQL

- [x] 1.2 [4/10] Install Prisma dependencies and initialize Prisma with PostgreSQL
  - Install `prisma`, `@prisma/client` packages
  - Create .env file with DATABASE_URL connection string
  - File: `package.json`, `.env`, `.env.example`
  - Run: `npm install prisma @prisma/client` and `npx prisma init --datasource-provider postgresql`

- [x] 1.3 [6/10] Create Prisma schema with Todo model for PostgreSQL
  - Define Todo model with fields: id (Int, autoincrement), text (String), completed (Boolean, default false), createdAt (DateTime, default now), updatedAt (DateTime, updatedAt)
  - Configure PostgreSQL datasource with connection URL from environment
  - Add Prisma Client generator configuration
  - File: `prisma/schema.prisma`
  - Run: `npx prisma generate` after schema creation

- [x] 1.4 [3/10] Install Express and server dependencies
  - Install `express`, `cors`, and `dotenv` packages
  - File: `package.json`
  - Run: `npm install express cors dotenv`

#### Completion Notes

- What was implemented: Docker Compose config for PostgreSQL 16, Prisma 7 initialized with Todo model, all dependencies installed (Prisma, Express, CORS, dotenv)
- Deviations from plan: Used Prisma 7 which has a different config approach (prisma.config.ts instead of DATABASE_URL in schema.prisma)
- Important context or decisions: DATABASE_URL configuration is now in prisma.config.ts as required by Prisma 7; Docker daemon needs to be started manually before running migrations
- Known issues or follow-ups: Docker daemon not running during setup - will need to be started for database operations

### Phase 2: Backend API Creation

**Phase Complexity**: 25 points (avg 6.3/10)

- [x] 2.1 [8/10] Create Express server with Prisma Client integration and connection handling
  - Set up Express app with JSON middleware and CORS
  - Initialize Prisma Client with error handling and connection logging
  - Configure server to listen on port 3001 with environment variable override
  - Add graceful shutdown for Prisma Client on SIGTERM and SIGINT
  - Implement health check endpoint at GET /api/health
  - Add error handling middleware for uncaught exceptions
  - File: `src/server/index.js`
  - Run: `node src/server/index.js` to test server starts and connects to database

- [x] 2.2 [6/10] Implement GET /api/todos endpoint with error handling
  - Fetch all todos from database ordered by createdAt DESC
  - Handle database connection errors with 503 status
  - Handle query errors with 500 status and logging
  - Return proper JSON response with todos array
  - File: `src/server/routes/todos.js`
  - Test with: `curl http://localhost:3001/api/todos`

- [x] 2.3 [6/10] Implement POST /api/todos endpoint with validation
  - Validate request body for required `text` field (min length 1, max length 500)
  - Return 400 status for validation errors
  - Create new todo with completed=false, auto-generated timestamps
  - Return created todo with 201 status
  - Handle unique constraint violations if applicable
  - File: `src/server/routes/todos.js`
  - Test with: `curl -X POST http://localhost:3001/api/todos -H "Content-Type: application/json" -d '{"text":"Test todo"}'`

- [x] 2.4 [5/10] Implement PUT /api/todos/:id and DELETE /api/todos/:id endpoints
  - PUT: Validate id parameter is valid integer, update todo completed status and text, return updated todo
  - DELETE: Validate id parameter, remove todo by id, return 204 status
  - Handle 404 for non-existent todos in both endpoints
  - Handle database errors with proper status codes
  - File: `src/server/routes/todos.js`
  - Test with curl commands for both endpoints

#### Completion Notes

- What was implemented: Complete Express server with Prisma Client integration, all CRUD endpoints (GET, POST, PUT, DELETE), health check endpoint, error handling middleware, graceful shutdown
- Deviations from plan: Implemented all endpoints in single todos.js file as a router factory function for better organization; added comprehensive validation and error handling beyond spec requirements
- Important context or decisions: Used router factory pattern that accepts prisma instance for better testability; all database errors properly categorized (connection errors = 503, not found = 404, validation = 400)
- Known issues or follow-ups: Server cannot start until Docker PostgreSQL is running and migrations are applied

### Phase 3: Frontend Integration

**Phase Complexity**: 13 points (avg 4.3/10)

- [x] 3.1 [4/10] Create frontend API client module with error handling
  - Implement fetchTodos, createTodo, updateTodo, deleteTodo functions
  - Use fetch API with proper error handling and timeout
  - Configure base URL as `/api` for Vite proxy
  - Add request/response logging for debugging
  - Implement exponential backoff for retries on network errors
  - File: `src/lib/api.js`

- [x] 3.2 [5/10] Update App.svelte to use API calls and manage async state
  - Replace local state initialization with fetchTodos on mount using onMount lifecycle
  - Update addTodo, toggleTodo, deleteTodo to call API with async/await
  - Add loading state (isLoading boolean) during API calls
  - Update todos array after successful API responses with optimistic updates
  - Handle component cleanup to avoid memory leaks
  - File: `src/App.svelte`

- [x] 3.3 [4/10] Add error handling and loading states to UI
  - Display loading spinner or message during API calls
  - Show error messages for failed API requests in user-friendly format
  - Disable buttons during loading states to prevent duplicate requests
  - Add toast/notification system for success messages
  - Implement retry button for failed requests
  - File: `src/App.svelte`

#### Completion Notes

- What was implemented: Complete frontend integration with API calls using onMount lifecycle, optimistic UI updates, loading states, error/success notifications with retry functionality, disabled states during loading
- Deviations from plan: Combined tasks 3.2 and 3.3 implementation in single App.svelte update for better cohesion; added auto-dismissing success messages
- Important context or decisions: Used optimistic updates for toggle/delete operations to provide instant UI feedback; errors revert optimistic changes; all buttons/inputs disabled during loading to prevent race conditions
- Known issues or follow-ups: Frontend will show connection errors until backend server is running and migrations are applied

### Phase 4: Testing and Deployment

**Phase Complexity**: 6 points (avg 6.0/10)

- [x] 4.1 [6/10] Run Prisma migration, update development scripts, and configure Vite proxy
  - Run `npx prisma migrate dev --name init` to create initial migration
  - Update package.json with `dev:server`, `dev:db`, and `dev:all` scripts
  - Add Vite proxy configuration in vite.config.js to route /api to http://localhost:3001
  - Update .gitignore to exclude .env and include .env.example
  - Verify database connection with `npx prisma studio`
  - File: `package.json`, `vite.config.js`, `.gitignore`
  - Run: `npm run dev:all` to test both servers together

#### Completion Notes

- What was implemented: Added dev scripts to package.json (dev:server, dev:db, migrate, studio), configured Vite proxy to route /api to http://localhost:3001, .gitignore already properly configured, build succeeds
- Deviations from plan: Did not run migrations or start servers due to Docker daemon not running; all configuration is complete and ready to run once Docker is started
- Important context or decisions: User must manually start Docker daemon and run migrations with "npm run dev:db && npm run migrate" before testing the full stack
- Known issues or follow-ups: Migrations need to be applied once Docker PostgreSQL is running; recommend testing with "npm run dev:db && npm run migrate && npm run dev:server" in one terminal and "npm run dev" in another

## Testing Strategy

### Unit Tests

No unit tests required initially. Future enhancements could include:
- API endpoint tests with supertest
- Prisma client mocking for isolated testing
- Validation logic unit tests

### Integration Tests

**Manual integration testing**:
1. Start PostgreSQL: `docker-compose up -d`
2. Start Express server: `npm run dev:server`
3. Test each endpoint with curl or Postman
4. Verify database state with Prisma Studio: `npx prisma studio`
5. Check logs for errors and warnings

### E2E Tests

**Manual E2E testing flow**:
1. Start all services with `npm run dev:all`
2. Open browser to `http://localhost:5173`
3. Create several todos - verify they appear in UI immediately
4. Toggle todo completion - verify state persists and updates in real-time
5. Delete todo - verify it's removed from UI and database
6. Refresh page - verify todos are still present (persistence test)
7. Check browser devtools network tab for API calls (status codes, response times)
8. Test error states by stopping PostgreSQL container
9. Verify error messages display correctly to user

## Success Criteria

- [ ] PostgreSQL running in Docker container with persistent volume
- [ ] Prisma schema created with Todo model and PostgreSQL configuration
- [ ] Database migrations applied successfully
- [ ] Express server running on port 3001 with all CRUD endpoints
- [ ] All API endpoints return proper status codes and JSON responses
- [ ] Frontend successfully calls API for all todo operations
- [ ] Todos persist between page refreshes and browser sessions
- [ ] Loading states display during API operations
- [ ] Error messages show for failed API requests with user-friendly text
- [ ] No build errors in Vite build process
- [ ] Vite proxy correctly routes `/api` requests to Express
- [ ] Database connection pooling configured correctly
- [ ] Graceful shutdown implemented for both Prisma and Express

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Start PostgreSQL
docker-compose up -d
# Expected: PostgreSQL container running and healthy

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

# Check database connection
npx prisma studio
# Expected: Prisma Studio opens and shows empty todos table
```

**Manual Verification:**

1. Start all services: `npm run dev:all` (or start separately: `docker-compose up -d`, `npm run dev:server`, `npm run dev`)
2. Navigate to: `http://localhost:5173`
3. Verify: Add new todos - they should appear in the list immediately
4. Verify: Toggle todo completion - checkbox state should persist and update
5. Verify: Delete todos - they should disappear from list
6. Verify: Refresh page - all todos should still be present (persistence test)
7. Check console: No errors or warnings in browser devtools
8. Check network tab: API calls to `/api/todos` should succeed with 200/201 status
9. Stop PostgreSQL: `docker-compose down` and verify error handling in UI
10. Restart PostgreSQL: `docker-compose up -d` and verify app recovers

**Feature-Specific Checks:**

- Open Prisma Studio (`npx prisma studio`) and verify todos table contains data with correct schema
- Test API directly with curl to ensure backend works independently of frontend
- Verify PostgreSQL container persists data by stopping and restarting: `docker-compose restart`
- Test error handling by stopping Express server and trying to add a todo
- Check that timestamps (createdAt, updatedAt) are correctly stored with timezone info
- Verify connection pooling by checking Prisma logs during concurrent requests
- Test database connection recovery after PostgreSQL restart

## Implementation Notes

### 1. Development Server Setup

For development, you'll need to run PostgreSQL (Docker), Express, and Vite servers simultaneously. Use the provided npm scripts (`dev:all`) or a process manager like `concurrently` for easier development workflow.

### 2. Prisma Client Generation

After any schema changes, always run `npx prisma generate` to regenerate the Prisma Client. Consider adding a postinstall script to automate this in package.json.

### 3. Database Connection String

The DATABASE_URL in .env should follow PostgreSQL connection string format:
`postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`

Example: `postgresql://todouser:todopass@localhost:5432/tododb?schema=public`

### 4. Environment Variables Management

Never commit .env files to version control. Always provide .env.example with placeholder values for other developers. Use different .env files for different environments (development, staging, production).

### 5. Error Handling Strategy

Implement consistent error handling across the API with proper HTTP status codes:
- 200: Successful GET/PUT
- 201: Successful POST (created)
- 204: Successful DELETE (no content)
- 400: Bad request (validation errors)
- 404: Resource not found
- 500: Server/database errors
- 503: Service unavailable (database connection issues)

### 6. PostgreSQL Docker Volume

The Docker volume for PostgreSQL ensures data persists even when the container is removed. To completely reset the database, use `docker-compose down -v` to remove volumes.

### 7. Production Considerations

For production deployment:
- Use environment-specific DATABASE_URL (managed PostgreSQL service like AWS RDS, Heroku Postgres, etc.)
- Enable SSL for database connections
- Implement connection pooling with proper limits
- Add database backups and monitoring
- Use Prisma migration in production mode: `npx prisma migrate deploy`

### 8. Future Enhancements

This implementation provides a foundation for:
- User authentication (add userId to Todo model with foreign key)
- Data filtering, sorting, and pagination
- Real-time updates with WebSockets or Server-Sent Events
- Full-text search on todo text using PostgreSQL's text search features
- API rate limiting and security middleware (helmet, express-rate-limit)
- Audit logging for all database operations
- Multi-tenancy support with row-level security

## Dependencies

- `@prisma/client` (^5.0.0) - Prisma ORM client
- `prisma` (^5.0.0) - Prisma CLI tool
- `express` (^4.18.0) - Web framework for Node.js
- `cors` (^2.8.5) - CORS middleware for Express
- `dotenv` (^16.0.0) - Environment variable management
- `concurrently` (^8.0.0) - Run multiple commands concurrently for development
- Docker (latest) - Container runtime for PostgreSQL
- PostgreSQL (16) - Production-grade relational database

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)
- [Svelte Lifecycle](https://svelte.dev/docs#run-time-svelte-onmount)
- [PostgreSQL Docker Official Image](https://hub.docker.com/_/postgres)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## Next Steps

1. Create Docker Compose configuration for PostgreSQL
2. Install Prisma and initialize with PostgreSQL
3. Create Prisma schema with Todo model
4. Set up Express server with Prisma Client
5. Implement REST API endpoints for CRUD operations
6. Create frontend API client module
7. Update App.svelte to use API instead of local state
8. Add loading and error states to UI
9. Configure Vite proxy for API requests
10. Run database migration and test end-to-end
11. Verify all todos persist between sessions
12. Test error handling and recovery scenarios
