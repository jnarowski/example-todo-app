import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  server: {
    host: '0.0.0.0', // Allow external connections (required for Docker)
    port: 5173,
    watch: {
      usePolling: true, // Better file watching in Docker environments
    },
    hmr: {
      host: 'localhost', // Hot module reload host
    },
  },
})
