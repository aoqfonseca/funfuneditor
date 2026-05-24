<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { openFileDialog, saveFileDialog } from './commands';

  export let open: boolean = false;

  const dispatch = createEventDispatcher<{
    close: void;
    openFile: string;
    saveAs: string;
    newFile: void;
  }>();

  const commands = [
    { id: 'open', label: 'Open file...' },
    { id: 'save-as', label: 'Save as...' },
    { id: 'new', label: 'New file' },
  ];

  let filter = '';
  let inputEl: HTMLInputElement;

  $: filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(filter.toLowerCase())
  );

  $: if (open && inputEl) {
    setTimeout(() => inputEl?.focus(), 0);
  }

  async function execute(id: string) {
    dispatch('close');
    filter = '';
    if (id === 'open') {
      const path = await openFileDialog();
      if (path) dispatch('openFile', path);
    } else if (id === 'save-as') {
      const path = await saveFileDialog();
      if (path) dispatch('saveAs', path);
    } else if (id === 'new') {
      dispatch('newFile');
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
              class="w-full text-left px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              style="font-family: -apple-system, sans-serif; font-size: 15px;"
              on:click={() => execute(cmd.id)}
            >
              {cmd.label}
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
