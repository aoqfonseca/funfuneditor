# FunfunZenWriter — Claude Context

## What this is

A distraction-free Markdown desktop editor. Tauri 2.0 (Rust backend) + SvelteKit SPA (frontend). The UI is pure white, centered, no toolbars, no chrome. Zen is the guiding principle — **when in doubt, do less**.

## Philosophy: keep it simple

- Every new feature must earn its place. If it adds visual noise, it doesn't ship.
- No toolbars. No sidebars. No modals beyond the command palette and font picker.
- The editor is the UI. Everything else is secondary.
- Prefer one small primitive over a clever abstraction.

---

## Architecture

```
funfuneditor/
├── src/                        # SvelteKit frontend (SPA)
│   ├── app.css                 # Tailwind directives only
│   ├── routes/+page.svelte     # Single page: all state lives here
│   └── lib/
│       ├── Editor.svelte       # Textarea, auto-resize, reads settings store
│       ├── Preview.svelte      # marked → HTML, reads settings store
│       ├── CommandPalette.svelte
│       ├── FontSettings.svelte
│       ├── FontLoader.svelte   # Dynamic Google Font injection via <svelte:head>
│       ├── Splash.svelte       # Logo fade-in, one-shot on load
│       ├── commands.ts         # Typed Tauri IPC wrappers
│       ├── ai_service.ts       # AI stub (passthrough for now)
│       └── stores/
│           └── settings.ts     # Font + size store, persisted to localStorage
├── src-tauri/                  # Rust / Tauri
│   ├── src/
│   │   ├── main.rs             # Entry: calls funfuneditor::run()
│   │   ├── lib.rs              # Tauri builder, plugin registration
│   │   └── file_manager.rs     # load_file, save_file, process_text_with_ai (stub)
│   ├── Cargo.toml
│   ├── tauri.conf.json         # Tauri 2.0 config (v2 key names!)
│   └── capabilities/
│       └── default.json        # Tauri 2.0 permissions (replaces v1 allowlist)
├── VERSION                     # Single source of truth for the version
└── CLAUDE.md                   # This file
```

**State ownership:** `+page.svelte` owns everything — `content`, `currentPath`, `paletteOpen`, `fontSettingsOpen`, `previewMode`, `savedIndicator`. Child components receive props and dispatch events upward. No shared writable stores for UI state.

---

## Dependencies

### Frontend (npm)
| Package | Purpose |
|---------|---------|
| `@sveltejs/kit ^2` | SvelteKit framework |
| `@sveltejs/adapter-static ^3` | SPA output to `build/` |
| `svelte ^4` | Component framework |
| `vite ^5` | Dev server + bundler |
| `tailwindcss ^3` + `postcss` + `autoprefixer` | Utility CSS |
| `@tailwindcss/typography ^0.5` | `.prose` styles for Preview |
| `@tauri-apps/api ^2` | Tauri JS bindings (`invoke` from `@tauri-apps/api/core`) |
| `@tauri-apps/plugin-dialog ^2` | File open/save dialogs |
| `marked ^18` | Markdown → HTML |
| `typescript ^5` | Type checking |

### Rust (`src-tauri/Cargo.toml`)
| Crate | Purpose |
|-------|---------|
| `tauri = "2"` | Desktop WebView runtime |
| `tauri-plugin-dialog = "2"` | Native file dialogs |
| `ropey = "1"` | UTF-8 rope for efficient file I/O |
| `serde + serde_json = "1"` | JSON serialization for IPC |
| `tauri-build = "2"` | Build script |

### System libs (Linux, required at compile time)
```
libwebkit2gtk-4.1-dev  libgtk-3-dev  libayatana-appindicator3-dev  librsvg2-dev  patchelf
```

---

## Running locally

```bash
# Node via mise (system npm is absent)
export PATH="$HOME/.local/share/mise/installs/node/20/bin:$HOME/.cargo/bin:$PATH"

# Dev mode (hot reload)
cargo tauri dev

# Production build
cargo tauri build
# Outputs: src-tauri/target/release/bundle/{deb,rpm,appimage}/
```

---

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Open command palette |
| `Ctrl+S` | Save (immediate) |
| `Ctrl+O` | Open file |
| `Ctrl+Shift+S` | Save as |
| `Ctrl+N` | New file |
| `Ctrl+Shift+V` | Toggle markdown preview |
| `Ctrl+,` | Font & size picker |

---

## Critical Tauri v2 gotchas

| Wrong (v1) | Right (v2) |
|------------|------------|
| `@tauri-apps/api/tauri` | `@tauri-apps/api/core` |
| `"tauri"` key in conf | `"app"` key |
| `"distDir"` | `"frontendDist"` |
| `"devPath"` | `"devUrl"` |
| `allowlist` in conf | `capabilities/default.json` |
| `Result<T, std::io::Error>` from commands | `Result<T, String>` |
| Cargo `edition = "2024"` | `edition = "2021"` |

SvelteKit output goes to `build/` (adapter-static default). `tauri.conf.json` uses `"frontendDist": "../build"`.

---

## Code style

- **No comments** unless the WHY is non-obvious. Never explain what the code does.
- **No abstractions for hypothetical futures.** Wire the thing that's needed now.
- **No error handling for impossible cases.** Validate at boundaries (user input, IPC), trust internal code.
- **Svelte**: inline styles for one-offs, Tailwind classes for layout/spacing. No CSS modules.
- **Rust**: `map_err(|e| e.to_string())` on every IO `Result` — Tauri commands must return `Result<T, String>`.
- **TypeScript**: typed event dispatchers (`createEventDispatcher<{event: Type}>()`), typed IPC wrappers in `commands.ts`.
- **No trailing summary comments** in responses — code should be self-evident.

---

## Branching & versioning workflow

- **Never commit directly to `master`.** All work goes on a feature branch, then a PR.
- Branch naming: `feat/short-description`, `fix/short-description`, `chore/short-description`.
- On every merge to `master`, bump the version. Version lives in three places — keep them in sync:
  1. `VERSION` (plain text, single source of truth)
  2. `package.json` → `"version"`
  3. `src-tauri/Cargo.toml` → `version`
  4. `src-tauri/tauri.conf.json` → `"version"`
- Bump rules:
  - **patch** (`0.1.0 → 0.1.1`): bug fixes, typos, style tweaks — nothing the user notices as a new capability.
  - **minor** (`0.1.0 → 0.2.0`): new user-visible feature, added shortcut, new command palette entry.
  - **major** (`0.1.0 → 1.0.0`): breaking change or significant redesign. Rare.
- The CI release workflow reads `VERSION` and tags the GitHub release automatically.

### Bump script (run before merging or as part of the PR)
```bash
# Usage: ./bump.sh patch | minor | major
./bump.sh minor
```
See `bump.sh` in the repo root.

---

## Feature checklist before opening a PR

- [ ] Does it make the app more zen, or does it add noise?
- [ ] Is the keyboard shortcut registered in `+page.svelte` and listed in the command palette?
- [ ] Does it work in both plain editor mode and split-preview mode?
- [ ] Version bumped in all four places (`VERSION`, `package.json`, `Cargo.toml`, `tauri.conf.json`)?
- [ ] Branch is `feat/*` or `fix/*`, PR targets `master`?
