# Development stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy application files
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server
CMD ["pnpm", "dev"]
