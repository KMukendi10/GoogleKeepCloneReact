# Google Keep Clone — React

A React recreation of the Google Keep homepage, built for the "First Day as a JR Intern at Google" assignment.

## Getting started

```bash
npm install
npm run dev       # start a local dev server
npm run build      # production build -> dist/
npm run preview    # preview the production build locally
```

Everything is stored in the browser's `localStorage` — there's no backend to run or configure.

## What's here

### Base clone

- Top nav bar: logo, search, refresh, grid/list view toggle, menu toggle
- "Take a note…" composer that expands into a full editor: title, body, pin, color, reminder, archive
- Masonry-style notes grid (with a list-view toggle)
- Click any note to open it in a full editor modal
- Archive notes, move them to Trash (auto-purged after 7 days, with an "Undo" toast), or delete permanently
- Fully responsive — collapses into a slide-in sidebar and a full-width mobile search bar on small screens

### Manual feature — labels / category tags

Create labels from the sidebar's "Edit labels" screen, or right from the label icon in the composer/note editor. Attach one or more labels to any note, then click a label in the sidebar to filter down to just those notes.

### AI-assisted feature — dark mode

The 🌙/☀️ toggle in the top bar switches every color in the app (backgrounds, borders, note paper colors, icons) via a `data-theme` attribute and CSS custom properties. The choice is remembered between visits.

### AI-assisted feature — drag-and-drop reordering

On the main Notes view, drag any note card onto another to reorder them. The order is saved per-note; pinned notes still always stay at the top.

### Reminders

Click the bell icon on a note to open a reminder picker (with "Later today / Tomorrow / Next week" presets, or a manual date & time). A note with a reminder shows a chip on its card (turns red if it's overdue) and appears under **Reminders** in the sidebar, sorted by soonest due date.

## Deployment (Netlify)

1. Push this project to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project**, and pick the repo.
3. Build command: `npm run build`, publish directory: `dist` — already configured in `netlify.toml`, which also adds an SPA redirect so refreshing a page doesn't 404.
4. Deploy.

## Project structure

```
src/
  App.js / App.css       # app shell + all styling
  useKeepStore.js        # notes/labels/theme state, all localStorage persistence
  main.js                # entry point
  components/
    TopBar.js             # nav bar: logo, search, refresh, view/theme toggles
    Sidebar.js             # Notes / Reminders / Archive / Trash / labels
    Composer.js             # create-note form
    NotesGrid.js             # renders the grid + drag-and-drop reordering
    NoteCard.js               # a single note in the grid
    NoteModal.js               # full note editor
    LabelsModal.js               # create/delete labels
    ColorPicker.js                 # note color swatches
    LabelPicker.js                  # assign labels to a note
    ReminderPicker.js                 # set/clear a note's reminder
    Toast.js                           # undo/notification toast
  assets/                 # icons and images
```

Every component is a plain `.js` file (JSX included) rather than `.jsx` — Vite is configured in `vite.config.js` to treat `.js` files under `src/` as JSX.