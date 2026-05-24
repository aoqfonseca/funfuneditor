<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { settings } from './stores/settings';

  export let content: string = '';

  const dispatch = createEventDispatcher<{ change: string }>();

  function autoResize(node: HTMLTextAreaElement) {
    const resize = () => {
      node.style.height = 'auto';
      node.style.height = node.scrollHeight + 'px';
    };
    node.addEventListener('input', resize);
    resize();
    return { destroy: () => node.removeEventListener('input', resize) };
  }

  function handleInput(e: Event) {
    dispatch('change', (e.target as HTMLTextAreaElement).value);
  }
</script>

<textarea
  use:autoResize
  class="w-full bg-white resize-none outline-none border-none text-gray-900 placeholder-gray-300 caret-gray-500"
  style="font-family: '{$settings.font}', 'Inconsolata Nerd Font', monospace; font-size: {$settings.fontSize}px; line-height: 1.9; min-height: 80vh;"
  placeholder="Start writing..."
  value={content}
  on:input={handleInput}
/>
