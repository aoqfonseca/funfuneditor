import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';

export async function loadFile(path: string): Promise<string> {
  return await invoke<string>('load_file', { path });
}

export async function saveFile(path: string, content: string): Promise<void> {
  await invoke<void>('save_file', { path, content });
}

export async function processTextWithAi(text: string, prompt: string): Promise<string> {
  return await invoke<string>('process_text_with_ai', { text, prompt });
}

export async function openFileDialog(): Promise<string | null> {
  const result = await open({
    filters: [{ name: 'Markdown', extensions: ['md', 'txt'] }],
    multiple: false,
  });
  return typeof result === 'string' ? result : null;
}

export async function saveFileDialog(): Promise<string | null> {
  const result = await save({
    filters: [{ name: 'Markdown', extensions: ['md'] }],
    defaultPath: 'untitled.md',
  });
  return result ?? null;
}
