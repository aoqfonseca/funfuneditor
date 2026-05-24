<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { settings, FONTS, FONT_SIZES } from './stores/settings';

  export let open = false;

  const dispatch = createEventDispatcher<{ close: void }>();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') dispatch('close');
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-40"
    role="presentation"
    on:click={() => dispatch('close')}
    on:keydown={handleKeydown}
  />

  <!-- Panel -->
  <div
    class="fixed z-50 bg-white rounded-2xl shadow-2xl"
    style="bottom: 4rem; left: 1.5rem; width: 260px; padding: 1.25rem;"
    role="dialog"
    aria-label="Font settings"
  >
    <!-- Font family -->
    <p style="font-size: 11px; font-family: -apple-system, sans-serif; color: #9ca3af; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 0.6rem;">
      Font
    </p>
    <div style="display: flex; flex-direction: column; gap: 2px; margin-bottom: 1.25rem;">
      {#each FONTS as font}
        <button
          class="text-left rounded-lg transition-colors"
          style="padding: 0.45rem 0.75rem; font-family: '{font.name}', monospace; font-size: 14px;
                 background: {$settings.font === font.name ? '#f3f4f6' : 'transparent'};
                 color: {$settings.font === font.name ? '#111827' : '#6b7280'};
                 border: none; cursor: pointer; font-weight: {$settings.font === font.name ? 500 : 400};"
          on:click={() => settings.setFont(font.name)}
        >
          {font.name === 'monospace' ? 'System monospace' : font.name}
        </button>
      {/each}
    </div>

    <!-- Font size -->
    <p style="font-size: 11px; font-family: -apple-system, sans-serif; color: #9ca3af; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 0.6rem;">
      Size
    </p>
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <button
        class="rounded-lg transition-colors"
        style="width: 32px; height: 32px; background: #f3f4f6; border: none; cursor: pointer;
               font-size: 18px; color: #374151; display: flex; align-items: center; justify-content: center;"
        on:click={settings.decrement}
        disabled={$settings.fontSize <= FONT_SIZES[0]}
        aria-label="Decrease font size"
      >−</button>

      <span style="flex: 1; text-align: center; font-family: -apple-system, sans-serif; font-size: 15px; color: #111827;">
        {$settings.fontSize}px
      </span>

      <button
        class="rounded-lg transition-colors"
        style="width: 32px; height: 32px; background: #f3f4f6; border: none; cursor: pointer;
               font-size: 18px; color: #374151; display: flex; align-items: center; justify-content: center;"
        on:click={settings.increment}
        disabled={$settings.fontSize >= FONT_SIZES[FONT_SIZES.length - 1]}
        aria-label="Increase font size"
      >+</button>
    </div>
  </div>
{/if}
