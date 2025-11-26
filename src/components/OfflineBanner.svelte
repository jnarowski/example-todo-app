<script>
  import { isOffline } from '../lib/stores/syncStore.js';
  import { fade, slide } from 'svelte/transition';
</script>

{#if $isOffline}
  <div class="offline-banner" transition:slide={{ duration: 250 }}>
    <div class="banner-content">
      <span class="icon">⚠</span>
      <span class="message">You're offline. Changes will sync when reconnected.</span>
    </div>
  </div>
{/if}

<style>
  .offline-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: #fff3cd;
    border-bottom: 1px solid #ffc107;
    padding: 12px 16px;
  }

  .banner-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .icon {
    font-size: 18px;
    line-height: 1;
  }

  .message {
    font-size: 14px;
    color: #856404;
    font-weight: 500;
  }
</style>
