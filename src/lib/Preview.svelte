<script lang="ts">
  import { marked } from 'marked';

  export let content: string = '';

  marked.setOptions({ breaks: true, gfm: true });

  $: html = content.trim()
    ? (marked.parse(content) as string)
    : '<p style="color:#d1d5db; font-style: italic;">Preview will appear here…</p>';
</script>

<div
  class="prose prose-gray max-w-none"
  style="font-family: 'Inconsolata Nerd Font', 'Inconsolata', monospace; font-size: 16px; line-height: 1.9;"
>
  {@html html}
</div>

<style>
  :global(.prose pre) {
    background: #f9fafb;
    border: 1px solid #f3f4f6;
    border-radius: 6px;
  }
  :global(.prose code) {
    font-family: 'Inconsolata Nerd Font', 'Inconsolata', monospace;
    font-size: 0.9em;
    background: #f3f4f6;
    border-radius: 3px;
    padding: 0.1em 0.3em;
  }
  :global(.prose pre code) {
    background: transparent;
    padding: 0;
  }
  :global(.prose blockquote) {
    border-left: 3px solid #e5e7eb;
    color: #6b7280;
    font-style: italic;
  }
</style>
