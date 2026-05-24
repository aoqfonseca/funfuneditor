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
    transition:fade={{ duration: 800 }}
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
  >
    <img
      src="/icons/icon.png"
      alt="FunfunZenWriter"
      style="width: 350px; height: 350px; object-fit: contain; margin-bottom: 1.5rem;"
    />
    <p style="font-family: Georgia, serif; font-size: 16px; color: #9ca3af; letter-spacing: 0.15em; text-transform: uppercase;">
      FunfunZenWriter
    </p>
  </div>
{/if}
