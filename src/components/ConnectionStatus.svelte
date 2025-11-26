<script>
  import { isOnline, syncStatus, lastSyncTime } from '../lib/sync.js';

  $: statusText = $isOnline ? 'Online' : 'Offline';
  $: statusClass = $isOnline ? 'online' : 'offline';
  $: syncText = getSyncText($syncStatus, $lastSyncTime);
  $: isPulsing = $syncStatus === 'syncing';

  function getSyncText(status, lastSync) {
    if (!$isOnline) {
      return 'Working offline';
    }

    switch (status) {
      case 'syncing':
        return 'Syncing...';
      case 'synced':
        return lastSync ? `Synced ${formatTime(lastSync)}` : 'Synced';
      case 'error':
        return 'Sync failed';
      default:
        return 'Ready';
    }
  }

  function formatTime(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 10) {
      return 'just now';
    } else if (diff < 60) {
      return `${diff}s ago`;
    } else if (diff < 3600) {
      const mins = Math.floor(diff / 60);
      return `${mins}m ago`;
    } else {
      return date.toLocaleTimeString();
    }
  }
</script>

<div class="connection-status">
  <div class="status-indicator {statusClass}" class:pulse={isPulsing}>
    <span class="status-dot"></span>
    <span class="status-text">{statusText}</span>
  </div>
  <div class="sync-text">{syncText}</div>
</div>

<style>
  .connection-status {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 12px 16px;
    font-size: 14px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }

  .status-indicator.online .status-dot {
    background-color: #27ae60;
  }

  .status-indicator.offline .status-dot {
    background-color: #95a5a6;
  }

  .status-text {
    font-weight: 600;
    color: #333;
  }

  .sync-text {
    font-size: 12px;
    color: #666;
    margin-left: 18px;
  }

  /* Pulse animation for syncing state */
  .pulse .status-dot {
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
  }

  /* Mobile responsive */
  @media (max-width: 600px) {
    .connection-status {
      bottom: 10px;
      right: 10px;
      padding: 10px 14px;
      font-size: 13px;
    }

    .sync-text {
      font-size: 11px;
    }
  }
</style>
