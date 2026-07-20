import { useCallback, useEffect, useMemo, useState } from "react";

const NOTES_KEY = "keep-clone.notes.v2";
const LABELS_KEY = "keep-clone.labels.v2";
const THEME_KEY = "keep-clone.theme.v1";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function seedNotes() {
  const now = Date.now();
  return [
    {
      id: uid(),
      title: "Welcome to Kazadi Google Keep(React)!",
      body: "This is my React rewrite of the Keep clone where you can pin a note, add a label, drag cards to reorder them, or flip on dark mode from the top bar.",
      color: "mint",
      labels: ["Getting started"],
      archived: false,
      pinned: true,
      trashed: false,
      deletedAt: null,
      reminderAt: null,
      order: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: "Reminders feature",
      body: "Click the bell icon on a note to set a reminder date & time. It'll show a chip on the card and show up under Reminders in the sidebar.",
      color: "storm",
      labels: [],
      archived: false,
      pinned: false,
      trashed: false,
      deletedAt: null,
      reminderAt: now + 24 * 60 * 60 * 1000,
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: "Manual feature",
      body: "Labels/category tags where you can create a label, attach it to any note from the composer or the note editor, then filter notes by clicking the label in the sidebar.",
      color: "sand",
      labels: ["Getting started"],
      archived: false,
      pinned: false,
      trashed: false,
      deletedAt: null,
      reminderAt: null,
      order: 2,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Could not read ${key} from storage`, err);
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Could not save ${key} to storage`, err);
  }
}

export function useKeepStore() {
  const [notes, setNotes] = useState(() => {
    const loaded = loadJSON(NOTES_KEY, null);
    return loaded ?? seedNotes();
  });
  const [labels, setLabels] = useState(() => loadJSON(LABELS_KEY, ["Getting started"]));
  const [theme, setTheme] = useState(() => loadJSON(THEME_KEY, "light"));
  const [currentView, setCurrentView] = useState("notes");
  const [searchQuery, setSearchQuery] = useState("");
  const [layoutMode, setLayoutMode] = useState("grid");
  const [toast, setToast] = useState(null);

  // persistence
  useEffect(() => saveJSON(NOTES_KEY, notes), [notes]);
  useEffect(() => saveJSON(LABELS_KEY, labels), [labels]);
  useEffect(() => saveJSON(THEME_KEY, theme), [theme]);

  // theme -> <html data-theme="...">
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // purge trash older than 7 days, once on mount
  useEffect(() => {
    const now = Date.now();
    setNotes((prev) => {
      const next = prev.filter(
        (n) => !(n.trashed && n.deletedAt && now - n.deletedAt > SEVEN_DAYS)
      );
      return next.length !== prev.length ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = useCallback((message, actionLabel, onAction) => {
    setToast({ message, actionLabel: actionLabel ?? null, onAction: onAction ?? null });
  }, []);
  const hideToast = useCallback(() => setToast(null), []);

  const addNote = useCallback((data) => {
    const now = Date.now();
    setNotes((prev) => {
      const maxOrder = prev.reduce((m, n) => Math.max(m, n.order ?? 0), 0);
      return [
        ...prev,
        {
          id: uid(),
          title: data.title ?? "",
          body: data.body ?? "",
          color: data.color ?? "default",
          labels: data.labels ?? [],
          pinned: Boolean(data.pinned),
          reminderAt: data.reminderAt ?? null,
          archived: Boolean(data.archived),
          trashed: false,
          deletedAt: null,
          order: maxOrder + 1,
          createdAt: now,
          updatedAt: now,
        },
      ];
    });
  }, []);

  const updateNote = useCallback((id, partial) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...partial, updatedAt: Date.now() } : n))
    );
  }, []);

  const setArchived = useCallback(
    (id, archived) => {
      updateNote(id, { archived });
      showToast(archived ? "Note archived." : "Note restored.", null);
    },
    [updateNote, showToast]
  );

  const deleteNote = useCallback(
    (id) => {
      updateNote(id, { trashed: true, deletedAt: Date.now() });
      showToast("Note moved to trash.", "Undo", () => {
        updateNote(id, { trashed: false, deletedAt: null });
        hideToast();
      });
    },
    [updateNote, showToast, hideToast]
  );

  const restoreFromTrash = useCallback(
    (id) => {
      updateNote(id, { trashed: false, deletedAt: null });
      showToast("Note restored.", null);
    },
    [updateNote, showToast]
  );

  const permanentlyDeleteNote = useCallback(
    (id) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      showToast("Note deleted forever.", null);
    },
    [showToast]
  );

  const addLabel = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLabels((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  }, []);

  const removeLabel = useCallback((name) => {
    setLabels((prev) => prev.filter((l) => l !== name));
    setNotes((prev) =>
      prev.map((n) =>
        n.labels?.includes(name) ? { ...n, labels: n.labels.filter((l) => l !== name) } : n
      )
    );
    setCurrentView((v) => (v === `label:${name}` ? "notes" : v));
  }, []);

  const toggleNoteLabel = useCallback((noteId, label) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== noteId) return n;
        const has = n.labels?.includes(label);
        const nextLabels = has ? n.labels.filter((l) => l !== label) : [...(n.labels ?? []), label];
        return { ...n, labels: nextLabels, updatedAt: Date.now() };
      })
    );
  }, []);

  // Drag-and-drop reordering (AI-assisted feature): reassigns `order` values
  const reorderNotes = useCallback((draggedId, targetId) => {
    if (draggedId === targetId) return;
    setNotes((prev) => {
      const ordered = [...prev].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const fromIndex = ordered.findIndex((n) => n.id === draggedId);
      const toIndex = ordered.findIndex((n) => n.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [moved] = ordered.splice(fromIndex, 1);
      ordered.splice(toIndex, 0, moved);
      const reNumbered = ordered.map((n, i) => ({ ...n, order: i }));
      // merge back with notes not part of the reordered subset (shouldn't happen, but safe)
      return prev.map((n) => reNumbered.find((r) => r.id === n.id) ?? n);
    });
  }, []);

  // Reminder feature: attach/detach a due date+time to a note; the sidebar's
  // "Reminders" view filters on `reminderAt` being set.
  const setReminder = useCallback(
    (id, timestamp) => {
      updateNote(id, { reminderAt: timestamp });
      showToast("Reminder set.", null);
    },
    [updateNote, showToast]
  );

  const clearReminder = useCallback(
    (id) => {
      updateNote(id, { reminderAt: null });
      showToast("Reminder removed.", null);
    },
    [updateNote, showToast]
  );

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const visibleNotes = useMemo(() => {
    let visible;
    if (currentView === "trash") {
      visible = notes.filter((n) => n.trashed);
    } else if (currentView === "archive") {
      visible = notes.filter((n) => n.archived && !n.trashed);
    } else if (currentView === "reminders") {
      visible = notes.filter((n) => n.reminderAt && !n.trashed && !n.archived);
    } else if (currentView.startsWith("label:")) {
      const label = currentView.slice("label:".length);
      visible = notes.filter((n) => !n.trashed && !n.archived && n.labels?.includes(label));
    } else {
      visible = notes.filter((n) => !n.archived && !n.trashed);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      visible = visible.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q) ||
          n.labels?.some((l) => l.toLowerCase().includes(q))
      );
    }

    if (currentView === "reminders") {
      return visible.slice().sort((a, b) => (a.reminderAt ?? 0) - (b.reminderAt ?? 0));
    }

    return visible.slice().sort((a, b) => {
      const pinDiff = (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      if (pinDiff !== 0) return pinDiff;
      const orderDiff = (a.order ?? 0) - (b.order ?? 0);
      if (orderDiff !== 0) return orderDiff;
      return b.updatedAt - a.updatedAt;
    });
  }, [notes, currentView, searchQuery]);

  return {
    notes,
    labels,
    theme,
    currentView,
    searchQuery,
    layoutMode,
    toast,
    visibleNotes,
    setCurrentView,
    setSearchQuery,
    setLayoutMode,
    addNote,
    updateNote,
    setArchived,
    deleteNote,
    restoreFromTrash,
    permanentlyDeleteNote,
    addLabel,
    removeLabel,
    toggleNoteLabel,
    reorderNotes,
    setReminder,
    clearReminder,
    toggleTheme,
    showToast,
    hideToast,
  };
}
