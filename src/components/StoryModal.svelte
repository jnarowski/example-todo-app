<script>
  import { onMount, onDestroy } from 'svelte';

  export let story = null;
  export let onClose = () => {};

  let modalElement;

  // Handle escape key to close modal
  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      onClose();
    }
  }

  // Handle overlay click (click outside modal card)
  function handleOverlayClick(event) {
    // Only close if clicking the overlay itself, not the modal card
    if (event.target === modalElement) {
      onClose();
    }
  }

  // Add escape key listener when component mounts
  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  // Clean up event listener when component unmounts
  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
</script>

{#if story}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    class="modal-overlay"
    on:click={handleOverlayClick}
    bind:this={modalElement}
    role="dialog"
    aria-modal="true"
  >
    <div class="modal-card">
      <button class="close-button" on:click={onClose} aria-label="Close story">
        ×
      </button>

      <h2 class="story-title">{story.title}</h2>

      <div class="story-content">
        {#each story.content.split('\n\n') as paragraph}
          <p>{paragraph}</p>
        {/each}
      </div>

      <div class="story-author">— {story.author}</div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    padding: 32px;
    position: relative;
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .close-button {
    position: absolute;
    top: 16px;
    right: 16px;
    background: #f0f0f0;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 28px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    transition: background 0.2s, color 0.2s;
  }

  .close-button:hover {
    background: #e0e0e0;
    color: #333;
  }

  .story-title {
    font-size: 28px;
    color: #333;
    margin-bottom: 20px;
    padding-right: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .story-content {
    font-size: 16px;
    line-height: 1.8;
    color: #444;
    margin-bottom: 24px;
  }

  .story-content p {
    margin-bottom: 16px;
  }

  .story-content p:last-child {
    margin-bottom: 0;
  }

  .story-author {
    font-size: 14px;
    color: #888;
    font-style: italic;
    text-align: right;
    margin-top: 20px;
  }

  /* Mobile responsive */
  @media (max-width: 640px) {
    .modal-overlay {
      padding: 12px;
    }

    .modal-card {
      padding: 24px;
      max-height: 85vh;
    }

    .story-title {
      font-size: 24px;
      margin-bottom: 16px;
    }

    .story-content {
      font-size: 15px;
    }
  }
</style>
