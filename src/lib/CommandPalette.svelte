<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let open: boolean = false;
  export let previewMode: boolean = false;

  const dispatch = createEventDispatcher<{
    close: void;
    openFile: void;
    saveAs: void;
    newFile: void;
    togglePreview: void;
    openFontSettings: void;
  }>();

  $: commands = [
    { id: 'open',           label: 'Open file...',    shortcut: 'Ctrl+O' },
    { id: 'save-as',        label: 'Save as...',      shortcut: 'Ctrl+Shift+S' },
    { id: 'new',            label: 'New file',        shortcut: 'Ctrl+N' },
    { id: 'toggle-preview', label: previewMode ? 'Hide preview' : 'Show preview', shortcut: 'Ctrl+Shift+V' },
    { id: 'font-settings',  label: 'Font & size…',                        shortcut: 'Ctrl+,' },
  ];

  let filter = '';
  let inputEl: HTMLInputElement;

  $: filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(filter.toLowerCase())
  );

  $: if (open && inputEl) {
    setTimeout(() => inputEl?.focus(), 0);
  }

  function execute(id: string) {
    dispatch('close');
    filter = '';
    if (id === 'open') {
      dispatch('openFile');
    } else if (id === 'save-as') {
      dispatch('saveAs');
    } else if (id === 'new') {
      dispatch('newFile');
    } else if (id === 'toggle-preview') {
      dispatch('togglePreview');
    } else if (id === 'font-settings') {
      dispatch('openFontSettings');
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      dispatch('close');
      filter = '';
    }
  }
</script>

{#if open}
  <div
    class="fixed inset-0 flex items-start justify-center pt-32 z-50"
    style="background: rgba(0,0,0,0.15);"
    role="presentation"
    on:click|self={() => { dispatch('close'); filter = ''; }}
    on:keydown={handleKeydown}
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full overflow-hidden" style="max-width: 480px;">
      <input
        bind:this={inputEl}
        class="w-full px-5 py-4 text-base outline-none border-b border-gray-100"
        style="font-family: -apple-system, sans-serif;"
        placeholder="Type a command..."
        bind:value={filter}
        on:keydown={handleKeydown}
      />
      <ul class="py-2">
        {#each filtered as cmd (cmd.id)}
          <li>
            <button
              class="w-full text-left px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
              style="font-family: -apple-system, sans-serif; font-size: 15px;"
              on:click={() => execute(cmd.id)}
            >
              <span>{cmd.label}</span>
              {#if cmd.shortcut}
                <span style="font-size: 11px; color: #9ca3af; background: #f3f4f6; border-radius: 5px; padding: 2px 7px; letter-spacing: 0.03em; flex-shrink: 0;">
                  {cmd.shortcut}
                </span>
              {/if}
            </button>
          </li>
        {/each}
        {#if filtered.length === 0}
          <li class="px-5 py-3 text-gray-400 text-sm">No commands found</li>
        {/if}
      </ul>
    </div>
  </div>
{/if}
