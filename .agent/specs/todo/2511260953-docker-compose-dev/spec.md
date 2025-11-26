# Add Docker Compose to Development Environment

**Status**: review
**Type**: issue
**Created**: 2025-11-26
**Package**: example-todo-app
**Total Complexity**: 18 points
**Tasks**: 5
**Avg Complexity**: 3.6/10

## Complexity Summary

| Metric          | Value    |
| --------------- | -------- |
| Total Tasks     | 5        |
| Total Points    | 18       |
| Avg Complexity  | 3.6/10   |
| Max Task        | 4/10     |

## Overview

Add Docker and Docker Compose configuration to streamline development environment setup. This will provide containerized development environment with hot-reload support for the Svelte + Vite application, making onboarding and cross-platform development easier.

## User Story

As a developer
I want to run the application in Docker
So that I can have a consistent development environment across different machines without worrying about local dependencies

## Technical Approach

Create a multi-stage Dockerfile optimized for development with hot-reload support. Add docker-compose.yml to orchestrate the development environment with volume mounting for live code changes. Include proper configuration for Vite's development server to work within Docker containers.

**Key Points**:
- Use Node.js Alpine image for minimal footprint
- Mount source code as volume for hot-reload
- Configure Vite to listen on 0.0.0.0 for Docker networking
- Add .dockerignore to exclude unnecessary files
- Document Docker commands in development workflow

## Files to Create/Modify

### New Files (3)

1. `Dockerfile` - Multi-stage build with development target
2. `docker-compose.yml` - Development environment orchestration
3. `.dockerignore` - Exclude node_modules, build artifacts

### Modified Files (2)

1. `vite.config.js` - Add host configuration for Docker
2. `package.json` - Add docker-related scripts

## Tasks

**IMPORTANT: Execute every task in order, top to bottom**

- [x] [task-1] [3/10] Create Dockerfile with development stage
  - Use node:20-alpine as base image
  - Set working directory to /app
  - Copy package files and install dependencies
  - Expose port 5173 (Vite default)
  - Set CMD to run dev server
  - File: `Dockerfile`

- [x] [task-2] [2/10] Create .dockerignore file
  - Exclude node_modules, dist, .git
  - Exclude .agent, .claude, .worktrees
  - Exclude pnpm-lock.yaml (will be generated in container)
  - File: `.dockerignore`

- [x] [task-3] [4/10] Create docker-compose.yml for development
  - Define app service using Dockerfile
  - Mount src/, public/, and config files as volumes
  - Map port 5173:5173
  - Set environment variables if needed
  - Configure dependency on potential future services (db, etc.)
  - File: `docker-compose.yml`

- [x] [task-4] [3/10] Update Vite config for Docker networking
  - Add server.host: '0.0.0.0' to allow external connections
  - Add server.port: 5173 explicitly
  - Add server.watch.usePolling for better file watching in Docker
  - Add server.hmr.host: 'localhost' for hot module reload
  - File: `vite.config.js`

- [x] [task-5] [6/10] Add Docker scripts and update documentation
  - Add "docker:dev" script: "docker-compose up"
  - Add "docker:build" script: "docker-compose build"
  - Add "docker:down" script: "docker-compose down"
  - Create or update README.md with Docker setup instructions
  - Document prerequisites (Docker, Docker Compose)
  - Document how to start, stop, and rebuild
  - Files: `package.json`, `README.md`

#### Completion Notes

- Successfully created Docker development environment with hot-reload support
- Fixed initial .dockerignore configuration to include pnpm-lock.yaml for reproducible builds
- Removed obsolete `version` field from docker-compose.yml (Docker Compose v2+ doesn't require it)
- All files created: Dockerfile (27 lines), .dockerignore (43 lines), docker-compose.yml (20 lines), README.md (117 lines)
- Modified files: vite.config.js (added Docker-compatible server config), package.json (added 3 Docker scripts)
- Validation successful: Docker image builds without errors, container starts and runs Vite dev server on port 5173
- Container logs show clean startup with no errors

## Testing Strategy

### Manual Testing

**Local Docker Build**:
- Build Docker image successfully
- Start container and verify app accessible at localhost:5173
- Make code change and verify hot-reload works
- Check container logs for errors

### Integration Tests (if applicable)

Not applicable - Docker configuration doesn't require automated tests

## Success Criteria

- [ ] Dockerfile builds without errors
- [ ] docker-compose up starts application successfully
- [ ] Application accessible at http://localhost:5173
- [ ] Hot-reload works when editing src files
- [ ] No console errors in browser or container logs
- [ ] Documentation clearly explains Docker workflow

## Validation

**Automated:**

```bash
# Build Docker image
docker-compose build
# Expected: Build completes successfully

# Start services
docker-compose up -d
# Expected: Container starts and runs
```

**Manual:**

1. Start app: `docker-compose up` or `pnpm docker:dev`
2. Navigate to: http://localhost:5173
3. Verify: Application loads correctly
4. Test: Edit src/App.svelte and verify hot-reload updates browser
5. Check: `docker-compose logs` shows no errors
6. Stop: `docker-compose down` or Ctrl+C

## Implementation Notes

### Volume Mounting

Volume mounts are critical for hot-reload. Must mount entire src/ directory and all config files that may change during development.

### Vite Configuration

Vite's dev server must bind to 0.0.0.0 (not localhost) to be accessible outside the container. The usePolling option may be needed for file watching to work reliably in Docker environments.

### Port Conflicts

Ensure port 5173 is not already in use on the host machine. If needed, can be remapped in docker-compose.yml port mapping.

## Dependencies

- Docker Engine (20.10+)
- Docker Compose (2.0+)
- No new npm dependencies

## References

- [Vite Docker documentation](https://vitejs.dev/guide/troubleshooting.html#dev-server)
- [Docker Compose documentation](https://docs.docker.com/compose/)
