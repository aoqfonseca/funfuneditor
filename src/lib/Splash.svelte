<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let visible = true;

  onMount(() => {
    setTimeout(() => {
      visible = false;
    }, 1600);
  });
</script>

{#if visible}
  <div
    transition:fade={{ duration: 600 }}
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
  >
    <img
      src="/icons/logo.jpeg"
      alt="FunfunZenWriter"
      style="width: 600px; height: 600px; object-fit: contain; margin-bottom: 1.5rem;"
    />
    <p style="font-family: Georgia, serif; font-size: 16px; color: #9ca3af; letter-spacing: 0.15em; text-transform: uppercase; text-align: center;">
      FunfunZenWriter
      <span style="display: block; font-size: 12px; text-transform: none; margin-top: 0.5rem;">
        Zen Open Source Markdown editor made by Andre Fonseca
        <br> aoqfonseca@gmail.com
        <br> <a href="https://medium.com/feed/@aoqfonseca">Blog Medium</a>
      </span>
    </p>
  </div>
{/if}
