FROM node:22-alpine
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Copy app files
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Default command (can be overridden by compose)
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
