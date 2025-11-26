<script>
  import { syncStore } from '../lib/stores/syncStore.js';
  import { triggerSync } from '../lib/services/syncService.js';

  let showTooltip = false;

  // Format last sync time as relative time
  function formatLastSync(lastSyncTime) {
    if (!lastSyncTime) return 'Never synced';

    const now = new Date();
    const syncTime = new Date(lastSyncTime);
    const diffMs = now - syncTime;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  }

  async function handleClick() {
    if ($syncStore.isOnline && !$syncStore.isSyncing) {
      await triggerSync();
    }
  }

  $: icon = $syncStore.isSyncing ? '↻' : ($syncStore.isOnline ? '✓' : '⚠');
  $: statusText = $syncStore.isSyncing ? 'Syncing...' :
                  ($syncStore.isOnline ? 'Synced' : 'Offline');
  $: lastSyncText = formatLastSync($syncStore.lastSyncTime);
  $: canClick = $syncStore.isOnline && !$syncStore.isSyncing;
</script>

<div
  class="sync-status"
  class:syncing={$syncStore.isSyncing}
  class:offline={!$syncStore.isOnline}
  class:clickable={canClick}
  on:click={handleClick}
  on:mouseenter={() => showTooltip = true}
  on:mouseleave={() => showTooltip = false}
  role="button"
  tabindex="0"
  title={`${statusText} - ${lastSyncText}`}
>
  <span class="icon">{icon}</span>
  {#if showTooltip}
    <div class="tooltip">
      <div class="tooltip-status">{statusText}</div>
      <div class="tooltip-time">{lastSyncText}</div>
    </div>
  {/if}
</div>

<style>
  .sync-status {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .sync-status.clickable {
    cursor: pointer;
  }

  .sync-status.clickable:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .sync-status.syncing {
    animation: pulse 1.5s ease-in-out infinite;
  }

  .sync-status.offline {
    background: #fff3cd;
  }

  .icon {
    font-size: 20px;
    line-height: 1;
  }

  .sync-status.syncing .icon {
    animation: spin 1s linear infinite;
  }

  .tooltip {
    position: absolute;
    top: 50px;
    right: 0;
    background: #333;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    white-space: nowrap;
    font-size: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .tooltip::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 10px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #333;
  }

  .tooltip-status {
    font-weight: 600;
    margin-bottom: 2px;
  }

  .tooltip-time {
    opacity: 0.8;
    font-size: 11px;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    50% {
      box-shadow: 0 2px 16px rgba(102, 126, 234, 0.4);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
