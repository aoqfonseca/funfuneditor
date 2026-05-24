<script lang="ts">
  import { onMount } from 'svelte';
  import { invoke } from '@tauri-apps/api/core';

  let ready = false;

  onMount(() => {
    requestAnimationFrame(() => { ready = true; });
    setTimeout(() => invoke('close_splash').catch(() => {}), 2200);
  });
</script>

<div
  class="splash"
  style="opacity: {ready ? 1 : 0}; transition: opacity 0.4s ease;"
>
  <img
    src="/icons/logo.jpeg"
    alt="FunfunZenWriter"
    class="logo"
  />
  <p class="name">FunfunZenWriter</p>
</div>

<style>
  :global(body) {
    margin: 0;
    background: #ffffff;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
  }

  .splash {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    gap: 2rem;
  }

  .logo {
    width: 72%;
    max-width: 580px;
    height: auto;
    object-fit: contain;
    border-radius: 6px;
  }

  .name {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 13px;
    color: #9ca3af;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin: 0;
  }
</style>
