# MySQL Database Migration

**Status**: completed
**Created**: 2025-11-25
**Package**: example-todo-app
**Total Complexity**: 43 points
**Phases**: 3
**Tasks**: 9
**Overall Avg Complexity**: 4.8/10

## Complexity Breakdown

| Phase           | Tasks   | Total Points | Avg Complexity | Max Task   |
| --------------- | ------- | ------------ | -------------- | ---------- |
| Phase 1: MySQL Setup and Configuration | 3 | 16 | 5.3/10 | 6/10 |
| Phase 2: Schema Migration and Data Transfer | 3 | 18 | 6.0/10 | 7/10 |
| Phase 3: Testing and Cleanup | 3 | 9 | 3.0/10 | 4/10 |
| **Total**       | **9**   | **43**       | **4.8/10**     | **7/10** |

## Overview

Migrate the existing Prisma-based todo application from SQLite to MySQL database. This migration will enable better scalability, concurrent access, and production-ready deployment capabilities while maintaining all existing functionality.

## User Story

As a developer
I want to migrate the todo app from SQLite to MySQL
So that the application can handle multiple users, scale better, and be production-ready with a robust database system

## Technical Approach

Update the Prisma datasource configuration to use MySQL instead of SQLite, create a new MySQL database (local or cloud-based), run Prisma migrations to create the schema in MySQL, and optionally transfer existing data from SQLite to MySQL if preservation is needed.

## Key Design Decisions

1. **Database Choice: MySQL**: Industry-standard relational database with excellent support for concurrent connections, transactions, and scalability. Well-suited for production deployments.
2. **Migration Strategy: Clean Migration**: Create fresh MySQL database with Prisma migrations rather than attempting complex SQLite-to-MySQL data dump. Existing SQLite data can be optionally preserved through manual transfer.
3. **Connection Management**: Use environment variables for MySQL connection strings to support different environments (dev, staging, production) and keep credentials secure.

## Architecture

### File Structure
```
example-todo-app/
├── prisma/
│   ├── schema.prisma          # Updated with MySQL datasource
│   ├── migrations/            # New MySQL migrations
│   └── dev.db                 # Old SQLite file (can be removed)
├── .env                       # MySQL connection string
├── .env.example               # Template for environment variables
├── src/server/
│   └── index.js               # No changes needed
└── package.json               # Add mysql2 dependency
```

### Integration Points

**Database Layer**:
- `prisma/schema.prisma` - Change datasource provider from `sqlite` to `mysql`, update connection URL
- `.env` - Add `DATABASE_URL` with MySQL connection string format
- Prisma Client - Regenerate with `npx prisma generate` after schema changes

**Backend API**:
- `src/server/index.js` - No code changes required, Prisma Client handles database abstraction
- `src/server/routes/todos.js` - No changes required, queries remain database-agnostic

**Frontend**:
- No changes required - API contract remains identical

## Implementation Details

### 1. MySQL Database Setup

Set up a local MySQL instance or cloud-based MySQL database. Configure connection credentials and create the database that will hold the todo application data.

**Key Points**:
- Install MySQL locally using Homebrew, Docker, or native installer
- Alternative: Use cloud MySQL service (PlanetScale, AWS RDS, Google Cloud SQL)
- Create database user with appropriate permissions
- Test connection before proceeding with migration
- Document connection parameters (host, port, database name, user)

### 2. Prisma Configuration Update

Update Prisma schema to use MySQL provider and configure the connection URL through environment variables. This changes the database target without affecting the data model.

**Key Points**:
- Change datasource provider from `sqlite` to `mysql`
- Update DATABASE_URL to use MySQL connection string format
- Ensure connection string includes all parameters (host, port, database, user, password)
- Add SSL parameters if using cloud database
- Create `.env.example` template for other developers

### 3. Schema Migration

Generate and apply new Prisma migrations for MySQL. The Todo model structure remains the same, but MySQL-specific column types and constraints will be applied.

**Key Points**:
- Reset migration history or create new migration baseline
- Run `prisma migrate dev` to create MySQL schema
- Verify schema in MySQL using Prisma Studio or MySQL client
- Test Prisma Client queries against new database
- Confirm all indexes and constraints are properly created

### 4. Data Transfer (Optional)

If existing SQLite data needs to be preserved, export from SQLite and import to MySQL. This is optional as development data can be recreated.

**Key Points**:
- Export existing todos from SQLite using Prisma Client script
- Transform data if needed for MySQL compatibility
- Import data using Prisma Client or direct MySQL insert
- Verify data integrity after transfer
- Consider skipping if development data is disposable

## Files to Create/Modify

### New Files (1)

1. `.env.example` - Template file showing required environment variables without sensitive values

### Modified Files (2)

1. `prisma/schema.prisma` - Change datasource provider to `mysql` and update connection URL reference
2. `.env` - Add MySQL DATABASE_URL connection string with credentials

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: MySQL Setup and Configuration

**Phase Complexity**: 16 points (avg 5.3/10)

- [ ] 1.1 [6/10] Install and configure MySQL database
  - Install MySQL locally (Homebrew: `brew install mysql`, Docker: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8`, or native installer)
  - Start MySQL service and verify it's running
  - Create database: `CREATE DATABASE todo_app;`
  - Create user with permissions: `CREATE USER 'todo_user'@'localhost' IDENTIFIED BY 'secure_password';` and `GRANT ALL PRIVILEGES ON todo_app.* TO 'todo_user'@'localhost';`
  - Test connection using MySQL client or GUI tool
  - Commands: `mysql -u root -p`, then run CREATE statements

- [ ] 1.2 [5/10] Install mysql2 package for Prisma MySQL support
  - Prisma requires mysql2 driver package for MySQL connections
  - File: `package.json`
  - Run: `npm install mysql2`

- [ ] 1.3 [5/10] Update .env file with MySQL connection string
  - Replace SQLite DATABASE_URL with MySQL format
  - Format: `DATABASE_URL="mysql://user:password@localhost:3306/database_name"`
  - Example: `DATABASE_URL="mysql://todo_user:secure_password@localhost:3306/todo_app"`
  - Create `.env.example` with template: `DATABASE_URL="mysql://user:password@host:3306/dbname"`
  - File: `.env`, `.env.example`
  - IMPORTANT: Keep credentials secure, never commit .env to version control

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 2: Schema Migration and Data Transfer

**Phase Complexity**: 18 points (avg 6.0/10)

- [ ] 2.1 [7/10] Update Prisma schema to use MySQL datasource
  - Change `provider = "sqlite"` to `provider = "mysql"`
  - Update datasource url to reference env variable: `url = env("DATABASE_URL")`
  - Keep Todo model definition unchanged (compatible with both databases)
  - MySQL will use INT for id, VARCHAR for text, BOOLEAN for completed, DATETIME for timestamps
  - File: `prisma/schema.prisma`
  - Run: `npx prisma format` to verify syntax

- [ ] 2.2 [7/10] Reset migrations and create fresh MySQL migration
  - Delete existing SQLite migrations folder: `rm -rf prisma/migrations`
  - Create new migration baseline for MySQL: `npx prisma migrate dev --name init`
  - This creates the Todo table in MySQL with proper schema
  - Verify migration succeeded and table exists
  - File: `prisma/migrations/`
  - Verify: `npx prisma studio` should connect to MySQL and show Todo table

- [ ] 2.3 [4/10] Optional: Transfer existing SQLite data to MySQL
  - If preserving development data, create a migration script
  - Read todos from SQLite using old connection
  - Insert into MySQL using new Prisma Client
  - Skip this step if development data is not needed
  - File: `scripts/migrate-data.js` (create if needed)
  - Run: `node scripts/migrate-data.js` (if implemented)

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

### Phase 3: Testing and Cleanup

**Phase Complexity**: 9 points (avg 3.0/10)

- [ ] 3.1 [4/10] Test all CRUD operations with MySQL backend
  - Start Express server: `node src/server/index.js`
  - Test POST /api/todos - create new todos
  - Test GET /api/todos - fetch all todos
  - Test PUT /api/todos/:id - update todo completion
  - Test DELETE /api/todos/:id - delete todo
  - Verify data persists in MySQL database
  - Commands: Use curl or Postman for API testing

- [ ] 3.2 [3/10] Run end-to-end application test
  - Start full application: `npm run dev` (or both servers)
  - Open browser to application URL
  - Add multiple todos, toggle completion, delete items
  - Refresh page and verify todos persist
  - Check browser console for errors
  - Verify MySQL database contains data using Prisma Studio or MySQL client

- [ ] 3.3 [2/10] Clean up old SQLite files and update documentation
  - Remove SQLite database file: `rm prisma/dev.db`
  - Add prisma/dev.db to .gitignore if not already present
  - Update README or documentation with MySQL setup instructions
  - Document environment variable requirements
  - File: `.gitignore`, `README.md` (if exists)

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

## Testing Strategy

### Unit Tests

No unit tests required for database migration. Existing API logic remains unchanged.

### Integration Tests

**Database Connection Testing**:
1. Verify Prisma Client connects successfully to MySQL
2. Test schema exists with correct table structure
3. Confirm all Prisma queries work with MySQL backend

**API Testing**:
1. Test all REST endpoints still function correctly
2. Verify response formats unchanged
3. Test error handling remains consistent

### E2E Tests

**Full Application Testing**:
1. Start both Express and Vite dev servers
2. Open browser to `http://localhost:5173`
3. Create new todos - verify they save to MySQL
4. Toggle todo completion - verify state persists
5. Delete todos - verify removal from MySQL
6. Refresh browser - verify todos still present
7. Check MySQL database directly - verify data matches UI
8. Test concurrent operations if multiple users/tabs

## Success Criteria

- [ ] MySQL database created and accessible with proper credentials
- [ ] Prisma schema updated with mysql provider
- [ ] mysql2 package installed as dependency
- [ ] Environment variables configured with MySQL connection string
- [ ] Fresh Prisma migrations created for MySQL schema
- [ ] All CRUD operations work correctly with MySQL backend
- [ ] Todos persist in MySQL database between sessions
- [ ] Application builds and runs without errors
- [ ] Frontend functionality unchanged from user perspective
- [ ] Old SQLite files removed or documented for cleanup
- [ ] No data loss or corruption during migration
- [ ] Connection handling works correctly (no timeout issues)

## Validation

Execute these commands to verify the migration works correctly:

**Automated Verification:**

```bash
# Verify mysql2 installed
npm list mysql2
# Expected: mysql2@[version] listed in dependencies

# Generate Prisma Client for MySQL
npx prisma generate
# Expected: Prisma Client generated successfully for MySQL provider

# Run MySQL migration
npx prisma migrate dev --name init
# Expected: Migration created and applied, Todo table exists in MySQL

# Verify schema in database
npx prisma db pull
# Expected: No changes detected (schema matches database)

# Build application
npm run build
# Expected: Vite build succeeds without errors
```

**Manual Verification:**

1. Start MySQL service: `brew services start mysql` (or Docker/native service)
2. Verify MySQL running: `mysql -u todo_user -p` and enter password
3. Check database exists: `SHOW DATABASES;` should list `todo_app`
4. Check table exists: `USE todo_app; SHOW TABLES;` should show `Todo`
5. Start Express server: `node src/server/index.js`
6. Start Vite dev server: `npm run dev`
7. Navigate to: `http://localhost:5173`
8. Create todos and verify they appear
9. Refresh page - todos should persist
10. Check MySQL directly: `SELECT * FROM Todo;` shows created todos

**Feature-Specific Checks:**

- Open Prisma Studio (`npx prisma studio`) - should connect to MySQL and show todos
- Test API with curl: `curl http://localhost:3001/api/todos` returns JSON array
- Verify MySQL connection string format is correct in .env
- Check MySQL logs for successful Prisma connections
- Test concurrent access (multiple browser tabs) works without issues
- Verify timestamps (createdAt, updatedAt) are stored correctly in MySQL DATETIME format

## Implementation Notes

### 1. MySQL Connection String Format

MySQL connection strings follow this pattern:
```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Optional parameters for cloud deployments:
```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?sslaccept=strict&sslcert=/path/to/cert.pem"
```

### 2. MySQL vs SQLite Differences

While Prisma abstracts most differences, be aware:
- MySQL uses INT AUTO_INCREMENT (SQLite uses INTEGER AUTOINCREMENT)
- MySQL has VARCHAR(191) length limits for indexed strings
- MySQL DATETIME doesn't include timezone (use TIMESTAMP if timezone needed)
- MySQL requires explicit database creation before migrations
- Connection pooling behaves differently (MySQL supports true pooling)

### 3. Cloud MySQL Options

Consider these managed MySQL services for production:
- **PlanetScale**: MySQL-compatible, serverless, free tier available
- **AWS RDS**: Fully managed MySQL with backups and scaling
- **Google Cloud SQL**: MySQL hosting with automatic replication
- **DigitalOcean Managed MySQL**: Simple setup with good pricing

### 4. Environment Variables Best Practices

- Never commit `.env` files to version control
- Add `.env` to `.gitignore`
- Create `.env.example` with placeholder values for team members
- Use different DATABASE_URL values for dev/staging/production
- Consider using secrets management for production (AWS Secrets Manager, etc.)

### 5. Rollback Strategy

If migration issues occur:
1. Revert `prisma/schema.prisma` to sqlite provider
2. Restore old DATABASE_URL in `.env`
3. Keep old SQLite file as backup during migration
4. Test rollback before deleting SQLite database

## Dependencies

- `mysql2` (^3.6.0) - MySQL client for Node.js, required by Prisma for MySQL connections
- MySQL Server (8.0+) - Database server (local installation or cloud service)

Existing dependencies remain:
- `@prisma/client` - Already installed, supports MySQL provider
- `prisma` - Already installed as dev dependency
- `express`, `cors`, `dotenv` - No changes needed

## References

- [Prisma MySQL Connector](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [MySQL Installation Guide](https://dev.mysql.com/doc/refman/8.0/en/installing.html)
- [Prisma Migrate with MySQL](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate/enable-native-database-types)
- [MySQL Connection String Format](https://www.prisma.io/docs/reference/database-reference/connection-urls#mysql)
- [PlanetScale with Prisma](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-planetscale)

## Next Steps

1. Install MySQL locally or set up cloud MySQL instance
2. Create database and user with appropriate permissions
3. Install mysql2 package via npm
4. Update .env with MySQL connection string
5. Update Prisma schema datasource to mysql provider
6. Delete old SQLite migrations and create fresh MySQL migrations
7. Test all CRUD operations through API
8. Run full end-to-end test in browser
9. Verify data persists in MySQL database
10. Clean up old SQLite files and update documentation
