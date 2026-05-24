<script lang="ts">
  import '../app.css';
  import Editor from '$lib/Editor.svelte';
  import Preview from '$lib/Preview.svelte';
  import CommandPalette from '$lib/CommandPalette.svelte';
  import FontSettings from '$lib/FontSettings.svelte';
  import FontLoader from '$lib/FontLoader.svelte';
  import Splash from '$lib/Splash.svelte';
  import { loadFile, saveFile, openFileDialog, saveFileDialog } from '$lib/commands';

  let content = '';
  let currentPath: string | null = null;
  let paletteOpen = false;
  let fontSettingsOpen = false;
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
    if (e.ctrlKey && e.key === ',') {
      e.preventDefault();
      fontSettingsOpen = !fontSettingsOpen;
      return;
    }
    if (e.ctrlKey && !e.shiftKey && e.key === 's') {
      e.preventDefault();
      if (debounceTimer) { clearTimeout(debounceTimer); debounceTimer = null; }
      doSave();
      return;
    }
    if (e.ctrlKey && !e.shiftKey && e.key === 'o') {
      e.preventDefault();
      openFile();
      return;
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      saveAs();
      return;
    }
    if (e.ctrlKey && !e.shiftKey && e.key === 'n') {
      e.preventDefault();
      handleNewFile();
    }
  }

  async function openFile() {
    const path = await openFileDialog();
    if (!path) return;
    try {
      content = await loadFile(path);
      currentPath = path;
    } catch (err) {
      console.error('Load failed:', err);
    }
  }

  async function saveAs() {
    const path = await saveFileDialog();
    if (!path) return;
    currentPath = path;
    await doSave();
  }

  function handleNewFile() {
    content = '';
    currentPath = null;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<FontLoader />
<Splash />

<main class="min-h-screen bg-white" style="padding: 4rem 1.5rem;">
  {#if previewMode}
    <div style="max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1px 1fr; gap: 0;">
      <div style="padding-right: 2.5rem;">
        <Editor {content} on:change={handleChange} />
      </div>
      <div style="background: #f3f4f6; width: 1px; min-height: 80vh;" />
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

<!-- Bottom-left buttons -->
<div style="position: fixed; bottom: 1.5rem; left: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; align-items: center;">
  <!-- Font settings button -->
  <button
    class="rounded-full transition-all duration-200 flex items-center justify-center"
    style="width: 28px; height: 28px; background: {fontSettingsOpen ? '#3b82f6' : '#e5e7eb'}; color: {fontSettingsOpen ? '#fff' : '#9ca3af'}; border: none; cursor: pointer; font-size: 14px;"
    title="Font & size (Ctrl+,)"
    on:click={() => (fontSettingsOpen = !fontSettingsOpen)}
  >A</button>

  <!-- Preview toggle button -->
  <button
    class="rounded-full transition-all duration-200 flex items-center justify-center"
    style="width: 28px; height: 28px; background: {previewMode ? '#3b82f6' : '#e5e7eb'}; color: {previewMode ? '#fff' : '#9ca3af'}; border: none; cursor: pointer; font-size: 13px;"
    title="Toggle preview (Ctrl+Shift+V)"
    on:click={() => (previewMode = !previewMode)}
  >⬓</button>
</div>

<!-- Saved indicator -->
<div
  class="fixed rounded-full bg-green-400 transition-opacity duration-700"
  style="bottom: 1.5rem; right: 1.5rem; width: 8px; height: 8px; opacity: {savedIndicator ? 1 : 0};"
/>

<FontSettings
  open={fontSettingsOpen}
  on:close={() => (fontSettingsOpen = false)}
/>

<CommandPalette
  open={paletteOpen}
  {previewMode}
  on:close={() => (paletteOpen = false)}
  on:openFile={openFile}
  on:saveAs={saveAs}
  on:newFile={handleNewFile}
  on:togglePreview={() => (previewMode = !previewMode)}
  on:openFontSettings={() => (fontSettingsOpen = true)}
/>
