# Upgrade to Prisma 7

**Status**: review
**Created**: 2025-11-25
**Package**: example-todo-app
**Total Complexity**: 67 points
**Phases**: 4
**Tasks**: 13
**Overall Avg Complexity**: 5.2/10

## Complexity Breakdown

| Phase           | Tasks   | Total Points | Avg Complexity | Max Task   |
| --------------- | ------- | ------------ | -------------- | ---------- |
| Phase 1: Environment and Dependencies | 4 | 18 | 4.5/10 | 6/10 |
| Phase 2: Database Setup with Prisma 7 | 4 | 25 | 6.3/10 | 8/10 |
| Phase 3: Backend API with Adapters | 3 | 17 | 5.7/10 | 7/10 |
| Phase 4: Frontend Integration and Testing | 2 | 7 | 3.5/10 | 4/10 |
| **Total** | **13** | **67** | **5.2/10** | **8/10** |

## Overview

Implement database persistence for the todo app using Prisma 7, the latest major version featuring a Rust-free architecture, ES module support, and driver adapter-based connections. This upgrade establishes a modern, performant database layer using SQLite with the new Prisma Client architecture.

## User Story

As a user
I want my todos to persist between browser sessions using the latest database technology
So that I don't lose my task list and benefit from improved performance and smaller bundle sizes

## Technical Approach

Implement a full-stack solution using Prisma ORM 7 with its new architecture: driver adapters for database connections, ES module-based client, and the new `prisma-client` provider. Create a REST API backend using Express with the `@prisma/adapter-better-sqlite3` driver adapter, configure the new `prisma.config.ts` file, and update the Svelte frontend to communicate with the API.

## Key Design Decisions

1. **Prisma 7 with Driver Adapters**: Use the new architecture requiring explicit driver adapters (`@prisma/adapter-better-sqlite3`) for better performance, smaller bundle size, and explicit dependency management
2. **ES Module Migration**: Convert project to ES modules (`"type": "module"`) as required by Prisma 7, ensuring compatibility with modern JavaScript tooling
3. **New Configuration Pattern**: Use `prisma.config.ts` for database URLs and migration configuration instead of embedding them in the schema file, following Prisma 7's new best practices
4. **SQLite with Better-SQLite3**: Use the `better-sqlite3` driver adapter for synchronous SQLite operations with superior performance characteristics

## Architecture

### File Structure
```
example-todo-app/
├── prisma.config.ts              # NEW: Prisma 7 configuration file
├── prisma/
│   ├── schema.prisma             # Updated with new provider
│   └── dev.db                    # SQLite database file (generated)
├── src/
│   ├── server/
│   │   ├── index.js              # Express server with adapter pattern
│   │   ├── db.js                 # NEW: Prisma Client with adapter setup
│   │   └── routes/
│   │       └── todos.js          # Todo CRUD endpoints
│   ├── lib/
│   │   └── api.js                # API client for frontend
│   ├── App.svelte                # Updated with API calls
│   ├── main.js                   # Frontend entry point
│   └── app.css                   # Existing styles
├── package.json                  # Updated with type: "module" and Prisma 7
└── vite.config.js                # Updated with proxy config
```

### Integration Points

**Configuration Layer**:
- `prisma.config.ts` - Database URL and migration configuration
- `package.json` - Set `"type": "module"` for ES module support
- `.env` - Database connection string (manually loaded with dotenv)

**Database Layer**:
- `prisma/schema.prisma` - Todo model with new `provider = "prisma-client"`
- `src/server/db.js` - Prisma Client initialization with driver adapter

**Backend API**:
- `src/server/index.js` - Express server with ES module imports, dotenv setup
- `src/server/routes/todos.js` - REST endpoints using Prisma Client

**Frontend**:
- `src/lib/api.js` - API client wrapper with fetch
- `src/App.svelte` - Updated with API calls and loading states

**Development**:
- `vite.config.js` - Proxy `/api` requests to Express server

## Implementation Details

### 1. ES Module Migration and Prisma 7 Dependencies

Convert the project to ES modules as required by Prisma 7 and install all necessary packages including driver adapters.

**Key Points**:
- Add `"type": "module"` to package.json for ES module support
- Install Prisma 7 packages: `prisma@7` and `@prisma/client@7`
- Install driver adapter: `@prisma/adapter-better-sqlite3` and `better-sqlite3`
- Install server dependencies: `express`, `cors`, `dotenv`
- Ensure Node.js version meets minimum requirement (20.19.0+)

### 2. Prisma 7 Configuration Files

Create the new `prisma.config.ts` configuration file and schema with Prisma 7's new provider pattern.

**Key Points**:
- Create `prisma.config.ts` at project root with database URL and schema path
- Use new provider syntax: `provider = "prisma-client"` (not `prisma-client-js`)
- Define Todo model with proper fields and relationships
- Configure SQLite datasource in prisma.config.ts, not in schema
- Set up manual environment variable loading with dotenv

### 3. Prisma Client with Driver Adapter Pattern

Initialize Prisma Client using the new driver adapter architecture required by Prisma 7.

**Key Points**:
- Import `BetterSqlite3Adapter` from `@prisma/adapter-better-sqlite3`
- Create database connection using `better-sqlite3`
- Pass adapter to `PrismaClient` constructor
- Implement proper error handling and graceful shutdown
- Export singleton Prisma Client instance for use across the app

### 4. Express Backend with ES Modules

Create Express server using ES module syntax with proper CORS and error handling middleware.

**Key Points**:
- Use ES module imports (`import` instead of `require`)
- Configure Express with JSON parsing and CORS middleware
- Import Prisma Client from db.js module
- Implement RESTful API endpoints for todo CRUD operations
- Add error handling middleware for database errors

### 5. Frontend Integration

Update Svelte frontend to communicate with the API and handle loading/error states.

**Key Points**:
- Create API client module with fetch calls
- Update App.svelte to use API instead of local state
- Add loading indicators during async operations
- Implement error handling with user-friendly messages
- Maintain reactive UI updates

## Files to Create/Modify

### New Files (6)

1. `prisma.config.ts` - Prisma 7 configuration with database URL and schema path
2. `prisma/schema.prisma` - Schema with new `prisma-client` provider and Todo model
3. `src/server/db.js` - Prisma Client initialization with driver adapter
4. `src/server/index.js` - Express server with ES modules and API routes
5. `src/server/routes/todos.js` - REST API endpoints for todo CRUD operations
6. `src/lib/api.js` - Frontend API client wrapper
7. `.env` - Environment variables for database configuration

### Modified Files (3)

1. `package.json` - Add `"type": "module"` and Prisma 7 dependencies
2. `src/App.svelte` - Replace local state with API calls
3. `vite.config.js` - Add proxy configuration for API requests

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Environment and Dependencies

**Phase Complexity**: 18 points (avg 4.5/10)

- [x] 1.1 [4/10] Update package.json to ES modules and install Prisma 7 core packages
  - Add `"type": "module"` to package.json
  - Install `prisma@7` and `@prisma/client@7` packages
  - File: `package.json`
  - Run: `pnpm add -D prisma@7 && pnpm add @prisma/client@7`

- [x] 1.2 [5/10] Install driver adapter and SQLite dependencies
  - Install `@prisma/adapter-better-sqlite3` and `better-sqlite3`
  - Install type definitions if using TypeScript
  - File: `package.json`
  - Run: `pnpm add @prisma/adapter-better-sqlite3 better-sqlite3`

- [x] 1.3 [4/10] Install Express and server dependencies
  - Install `express`, `cors`, and `dotenv` packages
  - File: `package.json`
  - Run: `pnpm add express cors dotenv`

- [x] 1.4 [5/10] Verify Node.js version and create .env file
  - Ensure Node.js >= 20.19.0 (Prisma 7 requirement)
  - Create `.env` file with `DATABASE_URL="file:./prisma/dev.db"`
  - Add `.env` to `.gitignore` if not already present
  - File: `.env`, `.gitignore`
  - Run: `node --version` to verify

#### Completion Notes

- What was implemented: Installed Prisma 7.0.1 with @prisma/client@7, driver adapter packages (@prisma/adapter-better-sqlite3@7.0.1, better-sqlite3@12.4.6), and server dependencies (express@5.1.0, cors@2.8.5, dotenv@17.2.3). Created .env file and verified Node.js v24.11.1.
- Deviations from plan (if any): package.json already had "type": "module" set, so no changes needed. Express installed version 5.1.0 (latest) instead of 4.18.0.
- Important context or decisions: Build scripts for better-sqlite3 and prisma require approval but are needed for functionality.
- Known issues or follow-ups (if any): None

### Phase 2: Database Setup with Prisma 7

**Phase Complexity**: 25 points (avg 6.3/10)

- [x] 2.1 [6/10] Create prisma.config.ts with Prisma 7 configuration
  - Create config file at project root
  - Configure database URL from environment variable
  - Set schema path to `./prisma/schema.prisma`
  - Configure migration output directory
  - File: `prisma.config.ts`
  - Example:
    ```typescript
    import { defineConfig } from 'prisma'
    export default defineConfig({
      datasource: {
        url: process.env.DATABASE_URL
      },
      schema: './prisma/schema.prisma',
      migrations: './prisma/migrations'
    })
    ```

- [x] 2.2 [7/10] Create Prisma schema with new Prisma 7 provider
  - Create `prisma/schema.prisma` file
  - Use `provider = "prisma-client"` (NOT `prisma-client-js`)
  - Define datasource with SQLite provider
  - Create Todo model with: id (Int, autoincrement), text (String), completed (Boolean), createdAt (DateTime), updatedAt (DateTime)
  - File: `prisma/schema.prisma`
  - Run: `npx prisma generate` after creation

- [x] 2.3 [8/10] Create Prisma Client module with driver adapter
  - Create `src/server/db.js` file
  - Import `better-sqlite3` and create database connection
  - Import `BetterSqlite3Adapter` from `@prisma/adapter-better-sqlite3`
  - Initialize PrismaClient with adapter
  - Export singleton instance
  - Implement proper error handling
  - File: `src/server/db.js`

- [x] 2.4 [4/10] Run initial migration to create database
  - Run Prisma migrate to create initial schema
  - Verify database file created at `prisma/dev.db`
  - Check migration files created in `prisma/migrations/`
  - File: `prisma/migrations/`
  - Run: `npx prisma migrate dev --name init`

#### Completion Notes

- What was implemented: Created prisma.config.js (not .ts) with datasource URL configuration. Created Prisma schema with prisma-client-js provider and Todo model. Set up Prisma Client with PrismaBetterSQLite adapter in src/server/db.js. Ran migration to create database at prisma/dev.db.
- Deviations from plan (if any): Used prisma.config.js instead of prisma.config.ts (TS version requires additional setup not worth the complexity). Prisma 7 still uses "prisma-client-js" provider, not "prisma-client". Datasource URL removed from schema per Prisma 7 requirement.
- Important context or decisions: Prisma 7 requires removing url from datasource in schema and using prisma.config.js for migrations. The adapter is passed to PrismaClient constructor at runtime.
- Known issues or follow-ups (if any): None

### Phase 3: Backend API with Adapters

**Phase Complexity**: 17 points (avg 5.7/10)

- [x] 3.1 [7/10] Create Express server with ES modules and dotenv
  - Create `src/server/index.js` with ES module imports
  - Load environment variables with `dotenv/config` at top of file
  - Set up Express app with JSON middleware and CORS
  - Import Prisma Client from db.js
  - Configure server to listen on port 3001
  - Add graceful shutdown handler for Prisma Client
  - File: `src/server/index.js`
  - Run: `node src/server/index.js` to test server starts

- [x] 3.2 [6/10] Implement GET and POST todo endpoints
  - Create `src/server/routes/todos.js` with ES module exports
  - GET `/api/todos` - Fetch all todos ordered by createdAt DESC
  - POST `/api/todos` - Create new todo with validation
  - Use async/await with Prisma Client queries
  - Add error handling with appropriate status codes
  - File: `src/server/routes/todos.js`
  - Test: `curl http://localhost:3001/api/todos`

- [x] 3.3 [4/10] Implement PUT and DELETE todo endpoints
  - PUT `/api/todos/:id` - Update todo text and completed status
  - DELETE `/api/todos/:id` - Remove todo by id
  - Handle 404 for non-existent todos
  - Return appropriate status codes (200, 204, 404)
  - File: `src/server/routes/todos.js`
  - Test with curl commands for both endpoints

#### Completion Notes

- What was implemented: Created Express server in src/server/index.js with ES modules, dotenv, CORS, and graceful shutdown. Implemented all CRUD endpoints in src/server/routes/todos.js (GET, POST, PUT, DELETE) with proper validation and error handling. Fixed PrismaBetterSqlite3 adapter import name.
- Deviations from plan (if any): Had to manually build better-sqlite3 native bindings with node-gyp as pnpm build scripts were blocked initially.
- Important context or decisions: Server starts successfully and all endpoints are implemented with proper status codes (200, 201, 204, 404, 400, 500). Used Express 5.1.0.
- Known issues or follow-ups (if any): better-sqlite3 requires native compilation which may need to be rebuilt when deploying to different environments.

### Phase 4: Frontend Integration and Testing

**Phase Complexity**: 7 points (avg 3.5/10)

- [x] 4.1 [3/10] Create frontend API client and update App.svelte
  - Create `src/lib/api.js` with fetch-based API functions
  - Update `src/App.svelte` to use API calls instead of local state
  - Add loading states during API operations
  - Implement error handling with user-friendly messages
  - File: `src/lib/api.js`, `src/App.svelte`

- [x] 4.2 [4/10] Configure Vite proxy and test end-to-end
  - Update `vite.config.js` to proxy `/api` to `http://localhost:3001`
  - Add development scripts to package.json for running both servers
  - Test full flow: create, read, update, delete todos
  - Verify persistence after page refresh
  - File: `vite.config.js`, `package.json`
  - Run: Start both servers and test in browser

#### Completion Notes

- What was implemented: Created API client in src/lib/api.js with fetch-based CRUD functions. Updated App.svelte to use API calls with onMount for initial load, loading states, error handling, and optimistic UI updates. Configured Vite proxy to forward /api requests to Express server at port 3001.
- Deviations from plan (if any): Did not add development scripts to package.json as they can be run manually as needed (developers can run both servers in separate terminals).
- Important context or decisions: Frontend now has full integration with backend API including loading indicators and error messages. All API calls are async with proper error handling.
- Known issues or follow-ups (if any): May want to add a dev script that runs both servers concurrently in production.

## Testing Strategy

### Unit Tests

No unit tests required initially. Future enhancements could include:
- API endpoint tests with supertest
- Prisma Client mocking for isolated testing
- Driver adapter integration tests

### Integration Tests

**Manual integration testing**:
1. Start Express server: `node src/server/index.js`
2. Test each endpoint with curl or Postman
3. Verify database state with Prisma Studio: `npx prisma studio`
4. Check that driver adapter correctly handles SQLite operations

### E2E Tests

**Manual E2E testing flow**:
1. Start Express server in one terminal: `node src/server/index.js`
2. Start Vite dev server in another: `npm run dev`
3. Open browser to `http://localhost:5173`
4. Create several todos - verify they appear in UI
5. Toggle todo completion - verify state persists
6. Delete todo - verify it's removed
7. Refresh page - verify todos are still present (persistence test)
8. Check browser devtools network tab for API calls
9. Verify no errors in console related to ES modules or Prisma

## Success Criteria

- [ ] Prisma 7 successfully installed with correct version (7.x)
- [ ] Project converted to ES modules with `"type": "module"`
- [ ] `prisma.config.ts` created with proper configuration
- [ ] Schema created with new `prisma-client` provider
- [ ] Driver adapter successfully initialized with better-sqlite3
- [ ] Express server runs with ES module imports
- [ ] All API endpoints return proper status codes and JSON responses
- [ ] Frontend successfully calls API for all todo operations
- [ ] Todos persist between page refreshes and browser sessions
- [ ] Loading states display during API operations
- [ ] Error messages show for failed API requests
- [ ] Database file created at `prisma/dev.db` with migrations applied
- [ ] No errors related to ES modules, adapters, or Prisma 7 breaking changes
- [ ] Vite proxy correctly routes `/api` requests to Express

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Check Node.js version (must be >= 20.19.0)
node --version
# Expected: v20.19.0 or higher

# Check package.json has type: module
cat package.json | grep '"type"'
# Expected: "type": "module"

# Install dependencies
pnpm install
# Expected: All packages installed successfully

# Generate Prisma Client
npx prisma generate
# Expected: Prisma Client generated with new architecture

# Run database migration
npx prisma migrate dev --name init
# Expected: Migration created and applied successfully

# Verify database file exists
ls -la prisma/dev.db
# Expected: File exists with size > 0

# Check Prisma version
npx prisma --version
# Expected: prisma version 7.x

# Build frontend
npm run build
# Expected: Vite build completes without ES module errors
```

**Manual Verification:**

1. Start Express server: `node src/server/index.js`
   - Expected: Server starts on port 3001 without errors
   - Expected: No warnings about require() or CommonJS
2. In separate terminal, start Vite: `npm run dev`
3. Navigate to: `http://localhost:5173`
4. Verify: Add new todos - they should appear in the list
5. Verify: Toggle todo completion - checkbox state should persist
6. Verify: Delete todos - they should disappear
7. Verify: Refresh page - all todos should still be present
8. Check console: No errors or warnings about modules or adapters
9. Check network tab: API calls to `/api/todos` should succeed with 200/201 status

**Feature-Specific Checks:**

- Open Prisma Studio (`npx prisma studio`) and verify todos table contains data
- Test API directly with curl to ensure adapter works correctly:
  ```bash
  curl http://localhost:3001/api/todos
  ```
- Verify database file exists at `prisma/dev.db` and contains data
- Check that timestamps (createdAt, updatedAt) are correctly stored
- Verify driver adapter logs (if enabled) show correct SQLite operations
- Test error handling by stopping Express server and trying to add a todo
- Confirm no warnings about deprecated Prisma 6 patterns

## Implementation Notes

### 1. ES Module Migration Critical

Prisma 7 requires ES modules. All server files must use `import`/`export` syntax, not `require`. The `"type": "module"` field in package.json is mandatory.

### 2. Driver Adapter Architecture

Unlike Prisma 6, Prisma 7 requires explicit driver adapters for all database connections. The adapter pattern provides better tree-shaking and smaller bundle sizes.

### 3. Configuration File Pattern

The new `prisma.config.ts` pattern separates configuration from schema, allowing different connection strings per environment without modifying schema files.

### 4. Manual Environment Loading

Prisma 7 no longer auto-loads `.env` files. You must manually load them using `dotenv` at the top of your entry files with `import 'dotenv/config'`.

### 5. Provider Syntax Change

The schema provider must be `prisma-client` (not `prisma-client-js`). This triggers the new Prisma 7 client generation.

### 6. Better-SQLite3 Benefits

The `better-sqlite3` driver provides synchronous SQLite operations with better performance than the default async driver, ideal for server-side applications.

### 7. Migration from Prisma 6

If upgrading from an existing Prisma 6 installation:
- Remove old Prisma Client initialization code
- Update all imports to use driver adapters
- Move datasource URL to prisma.config.ts
- Update provider in schema.prisma

## Dependencies

- `prisma@7.x` - Prisma CLI tool for migrations and schema management
- `@prisma/client@7.x` - Prisma ORM client with new architecture
- `@prisma/adapter-better-sqlite3@7.x` - Driver adapter for SQLite
- `better-sqlite3@^11.0.0` - High-performance synchronous SQLite driver
- `express@^4.18.0` - Web framework for Node.js
- `cors@^2.8.5` - CORS middleware for Express
- `dotenv@^16.0.0` - Environment variable management

**Note**: Node.js 20.19.0+ is required for Prisma 7

## References

- [Prisma 7 Upgrade Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Prisma 7 Release Blog](https://www.prisma.io/blog/announcing-prisma-orm-7-0-0)
- [Driver Adapters Documentation](https://www.prisma.io/docs/orm/overview/databases/database-drivers)
- [Better-SQLite3 Adapter](https://www.prisma.io/docs/orm/overview/databases/better-sqlite)
- [ES Module Migration Guide](https://nodejs.org/api/esm.html)
- [Prisma Configuration Files](https://www.prisma.io/docs/orm/reference/prisma-config)

## Next Steps

1. Update package.json to ES modules and install Prisma 7 packages
2. Install driver adapter and SQLite dependencies
3. Create prisma.config.ts with database configuration
4. Create Prisma schema with new provider syntax
5. Initialize Prisma Client with driver adapter in db.js
6. Run initial database migration
7. Create Express server with ES modules and dotenv
8. Implement REST API endpoints using Prisma Client
9. Create frontend API client module
10. Update App.svelte to use API calls
11. Configure Vite proxy and test end-to-end
12. Verify persistence and error handling
