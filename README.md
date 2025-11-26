# Example Todo App

A simple todo application built with Svelte and Vite.

## Prerequisites

### Local Development
- Node.js 20+
- pnpm

### Docker Development
- Docker Engine 20.10+
- Docker Compose 2.0+

## Getting Started

### Option 1: Local Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open your browser to [http://localhost:5173](http://localhost:5173)

### Option 2: Docker Development

1. Build the Docker image:
   ```bash
   pnpm docker:build
   # or: docker-compose build
   ```

2. Start the application:
   ```bash
   pnpm docker:dev
   # or: docker-compose up
   ```

3. Open your browser to [http://localhost:5173](http://localhost:5173)

4. Stop the application:
   ```bash
   # Press Ctrl+C in the terminal, then:
   pnpm docker:down
   # or: docker-compose down
   ```

### Docker Development Features

- **Hot Reload**: Changes to source files are automatically reflected in the browser
- **Volume Mounting**: Source code and config files are mounted from the host
- **Consistent Environment**: Same Node.js version across all development machines
- **Isolated Dependencies**: node_modules managed within the container

## Building for Production

```bash
pnpm build
```

The built files will be in the `dist/` directory.

## Preview Production Build

```bash
pnpm preview
```

## Project Structure

```
.
├── src/           # Application source code
├── public/        # Static assets
├── index.html     # Entry HTML file
├── vite.config.js # Vite configuration
└── package.json   # Dependencies and scripts
```

## Docker Configuration

- `Dockerfile` - Multi-stage build with development target
- `docker-compose.yml` - Service orchestration
- `.dockerignore` - Excludes unnecessary files from Docker context

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, you can change it in `docker-compose.yml`:

```yaml
ports:
  - "3000:5173"  # Maps host port 3000 to container port 5173
```

### Hot Reload Not Working

If hot reload isn't working in Docker:
1. Ensure `usePolling: true` is set in `vite.config.js`
2. Check that volume mounts are correct in `docker-compose.yml`
3. Restart the containers: `pnpm docker:down && pnpm docker:dev`

### Docker Build Errors

If you encounter build errors:
1. Clear Docker cache: `docker-compose build --no-cache`
2. Remove old images: `docker system prune -a`
3. Rebuild: `pnpm docker:build`
