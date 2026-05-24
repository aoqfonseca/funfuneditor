<script lang="ts">
  import { settings, FONTS } from './stores/settings';

  $: fontEntry = FONTS.find(f => f.name === $settings.font);
  $: googleParam = fontEntry?.googleParam ?? null;
  $: href = googleParam
    ? `https://fonts.googleapis.com/css2?family=${googleParam}&display=swap`
    : null;
</script>

<svelte:head>
  {#if href}
    <link rel="stylesheet" {href} />
  {/if}
</svelte:head>
