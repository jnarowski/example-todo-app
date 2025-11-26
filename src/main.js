import './app.css'
import App from './App.svelte'
import { init as initSyncService } from './lib/services/syncService.js'

// Initialize sync service
initSyncService()

const app = new App({
  target: document.getElementById('app'),
})

export default app
