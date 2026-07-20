# Google Keep Clone — React

A React + Vite rewrite of the vanilla JS/HTML/CSS Google Keep clone, built for the "First Day as a JR Intern at Google" assignment.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

## Base features (Google Keep homepage clone)

- Top nav bar with logo, search, refresh, grid/list toggle, and menu toggle
- Expanding "Take a note…" composer: title, body, pin, color, reminder toggle, archive
- Masonry-style notes grid (CSS columns), with list-view toggle
- Open a note to edit title/body/color in a full modal
- Archive, Trash (with 7-day auto-purge + "Undo" toast), and permanent delete
- Fully responsive: collapses to a slide-in sidebar and full-width search on mobile

## Feature upgrades

**Manual feature — no AI tools (Category / label tags)**
Create labels from the sidebar's "Edit labels" modal, or straight from the note composer/editor's label icon. Assign one or more labels to any note, then click a label in the sidebar to filter down to just those notes. Labels persist in `localStorage`.

**AI-assisted feature #1 — Dark mode**
Toggle button in the top bar (🌙/☀️) flips a `data-theme` attribute on `<html>`, swapping every color token (backgrounds, borders, note paper colors, icon tint) via CSS custom properties. The choice is remembered in `localStorage`.

**AI-assisted feature #2 — Drag-and-drop reordering**
On the main "Notes" view (with no active search), drag any unpinned/pinned note card onto another to reorder them. Order is stored per-note and persisted, and pinned notes still always float to the top.

**Reminders**
Click the bell icon in the composer or the note editor to open a small date/time picker (with "Later today / Tomorrow / Next week" presets, or a manual date-time picker). Setting a reminder shows a chip on the note (red if overdue) and makes the note show up under **Reminders** in the sidebar, sorted by soonest due date. Clearing the reminder removes it from that view.

## Project convention: `.js`, not `.jsx`

Every component in this project is a plain `.js` file (no `.jsx` extension), even though they contain JSX. Two things make that work:

1. **Vite/esbuild**: by default Vite's esbuild transform only parses JSX syntax in `.jsx`/`.tsx` files. `vite.config.js` overrides that with `esbuild.loader: 'jsx'` scoped to `.js` files under `src/`, plus a matching `optimizeDeps.esbuildOptions.loader` entry so dependency pre-bundling agrees.
2. **Vite version**: this project intentionally pins `vite@^6` (the stable, esbuild-based release) rather than the newer experimental `vite@8` rolldown/oxc-based builds. In that experimental build, JSX-in-`.js` parsing is decided by a native Rust plugin that currently ignores the equivalent `lang: 'jsx'` override — a real limitation in that preview tooling, not something fixable from `vite.config.js` alone.

If you ever add TypeScript or want `.jsx` back, you can drop the `esbuild`/`optimizeDeps` block above — it's just there to keep `.js` files.

## Data persistence

Everything (notes, labels, theme, layout) is saved to `localStorage` — no backend required.

## Deployment (Netlify)

1. Push this repo to GitHub.
2. In Netlify: "Add new site" → "Import an existing project" → pick the repo.
3. Build command: `npm run build`, publish directory: `dist` (already configured in `netlify.toml`).
4. Deploy — the included `netlify.toml` also adds an SPA redirect so refreshing the page works.

## Project structure

```
src/
  components/   # TopBar, Sidebar, Composer, NoteCard, NotesGrid, NoteModal, LabelsModal, Toast, pickers
  hooks/
    useKeepStore.js  # all state + localStorage persistence
  data/colors.js
  App.jsx / App.css
```
