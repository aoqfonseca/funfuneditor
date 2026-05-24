<script lang="ts">
  import '../app.css';
  import Editor from '$lib/Editor.svelte';
  import Preview from '$lib/Preview.svelte';
  import CommandPalette from '$lib/CommandPalette.svelte';
  import Splash from '$lib/Splash.svelte';
  import { loadFile, saveFile } from '$lib/commands';

  let content = '';
  let currentPath: string | null = null;
  let paletteOpen = false;
  let savedIndicator = false;
  let previewMode = false;

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function flashSaved() {
    savedIndicator = true;
    setTimeout(() => { savedIndicator = false; }, 1500);
  }

  async function doSave() {
    if (!currentPath) return;
    try {
      await saveFile(currentPath, content);
      flashSaved();
    } catch (err) {
      console.error('Save failed:', err);
    }
  }

  function handleChange(e: CustomEvent<string>) {
    content = e.detail;
    if (debounceTimer) clearTimeout(debounceTimer);
    if (currentPath) {
      debounceTimer = setTimeout(() => doSave(), 1000);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      e.preventDefault();
      paletteOpen = !paletteOpen;
      return;
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'V') {
      e.preventDefault();
      previewMode = !previewMode;
      return;
    }
    if (e.ctrlKey && !e.shiftKey && e.key === 's') {
      e.preventDefault();
      if (debounceTimer) { clearTimeout(debounceTimer); debounceTimer = null; }
      doSave();
    }
  }

  async function handleOpenFile(e: CustomEvent<string>) {
    try {
      content = await loadFile(e.detail);
      currentPath = e.detail;
    } catch (err) {
      console.error('Load failed:', err);
    }
  }

  async function handleSaveAs(e: CustomEvent<string>) {
    currentPath = e.detail;
    await doSave();
  }

  function handleNewFile() {
    content = '';
    currentPath = null;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<Splash />

<main class="min-h-screen bg-white" style="padding: 4rem 1.5rem;">
  {#if previewMode}
    <!-- Split view: editor left, preview right -->
    <div style="max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1px 1fr; gap: 0;">
      <div style="padding-right: 2.5rem;">
        <Editor {content} on:change={handleChange} />
      </div>
      <!-- Divider -->
      <div style="background: #f3f4f6; width: 1px; min-height: 80vh;" />
      <!-- Preview pane -->
      <div style="padding-left: 2.5rem; overflow-y: auto;">
        <Preview {content} />
      </div>
    </div>
  {:else}
    <div style="max-width: 800px; margin: 0 auto;">
      <Editor {content} on:change={handleChange} />
    </div>
  {/if}
</main>

<!-- Preview toggle button — bottom-left, very subtle -->
<button
  class="fixed rounded-full transition-all duration-200 flex items-center justify-center"
  style="bottom: 1.5rem; left: 1.5rem; width: 28px; height: 28px; background: {previewMode ? '#3b82f6' : '#e5e7eb'}; color: {previewMode ? '#fff' : '#9ca3af'}; border: none; cursor: pointer; font-size: 13px;"
  title="Toggle preview (Ctrl+Shift+V)"
  on:click={() => (previewMode = !previewMode)}
>
  {previewMode ? '✕' : '⬓'}
</button>

<!-- Saved indicator: subtle green dot, bottom-right -->
<div
  class="fixed rounded-full bg-green-400 transition-opacity duration-700"
  style="bottom: 1.5rem; right: 1.5rem; width: 8px; height: 8px; opacity: {savedIndicator ? 1 : 0};"
/>

<CommandPalette
  open={paletteOpen}
  {previewMode}
  on:close={() => (paletteOpen = false)}
  on:openFile={handleOpenFile}
  on:saveAs={handleSaveAs}
  on:newFile={handleNewFile}
  on:togglePreview={() => (previewMode = !previewMode)}
/>
