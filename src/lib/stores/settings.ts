import { writable } from 'svelte/store';

export interface EditorSettings {
  font: string;
  fontSize: number;
}

export const FONTS = [
  { name: 'Inconsolata',      googleParam: 'Inconsolata:wght@400;500' },
  { name: 'JetBrains Mono',   googleParam: 'JetBrains+Mono:wght@400;500' },
  { name: 'Fira Code',        googleParam: 'Fira+Code:wght@400;500' },
  { name: 'Source Code Pro',  googleParam: 'Source+Code+Pro:wght@400;500' },
  { name: 'IBM Plex Mono',    googleParam: 'IBM+Plex+Mono:wght@400;500' },
  { name: 'monospace',        googleParam: null },
] as const;

export const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20, 22, 24];

const STORAGE_KEY = 'funfun-editor-settings';
const DEFAULTS: EditorSettings = { font: 'Inconsolata', fontSize: 16 };

function load(): EditorSettings {
  if (typeof localStorage === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function persist(value: EditorSettings) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }
}

function createSettings() {
  const store = writable<EditorSettings>(load());
  return {
    subscribe: store.subscribe,
    setFont(font: string) {
      store.update(s => { const next = { ...s, font }; persist(next); return next; });
    },
    setFontSize(fontSize: number) {
      store.update(s => { const next = { ...s, fontSize }; persist(next); return next; });
    },
    increment() {
      store.update(s => {
        const idx = FONT_SIZES.indexOf(s.fontSize);
        const next = { ...s, fontSize: FONT_SIZES[Math.min(idx + 1, FONT_SIZES.length - 1)] };
        persist(next);
        return next;
      });
    },
    decrement() {
      store.update(s => {
        const idx = FONT_SIZES.indexOf(s.fontSize);
        const next = { ...s, fontSize: FONT_SIZES[Math.max(idx - 1, 0)] };
        persist(next);
        return next;
      });
    },
  };
}

export const settings = createSettings();
