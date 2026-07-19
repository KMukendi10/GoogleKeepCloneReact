import { useState } from "react";
import { useKeepStore } from "./hooks/useKeepStore";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import Composer from "./components/Composer";
import NotesGrid from "./components/NotesGrid";
import NoteModal from "./components/NoteModal";
import LabelsModal from "./components/LabelsModal";
import Toast from "./components/Toast";
import "./App.css";

export default function App() {
  const store = useKeepStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [labelsModalOpen, setLabelsModalOpen] = useState(false);

  const activeNote = activeNoteId ? store.notes.find((n) => n.id === activeNoteId) : null;

  function handleMenuToggle() {
    if (window.matchMedia("(max-width: 900px)").matches) {
      setSidebarOpen((v) => !v);
    } else {
      setSidebarExpanded((v) => !v);
    }
  }

  function handleSelectView(view) {
    store.setCurrentView(view);
    setSidebarOpen(false);
  }

  function handleRefresh() {
    store.showToast("Refreshed.", null);
  }

  return (
    <>
      <TopBar
        searchQuery={store.searchQuery}
        onSearchChange={store.setSearchQuery}
        onMenuToggle={handleMenuToggle}
        onRefresh={handleRefresh}
        layoutMode={store.layoutMode}
        onToggleLayout={() => store.setLayoutMode((m) => (m === "grid" ? "list" : "grid"))}
        theme={store.theme}
        onToggleTheme={store.toggleTheme}
      />

      <div className="layout">
        <Sidebar
          isOpen={sidebarOpen}
          isExpanded={sidebarExpanded}
          currentView={store.currentView}
          onSelectView={handleSelectView}
          labels={store.labels}
          onOpenLabelsModal={() => setLabelsModalOpen(true)}
        />

        <main className="board">
          {store.currentView === "notes" && (
            <Composer labels={store.labels} onAddNote={store.addNote} onCreateLabel={store.addLabel} />
          )}

          <NotesGrid
            notes={store.visibleNotes}
            layoutMode={store.layoutMode}
            currentView={store.currentView}
            searchQuery={store.searchQuery}
            onOpen={setActiveNoteId}
            onArchiveToggle={(id) => {
              const note = store.notes.find((n) => n.id === id);
              store.setArchived(id, !note.archived);
            }}
            onDelete={(id) => {
              const note = store.notes.find((n) => n.id === id);
              if (note.trashed) store.permanentlyDeleteNote(id);
              else store.deleteNote(id);
            }}
            onTogglePin={(id) => {
              const note = store.notes.find((n) => n.id === id);
              store.updateNote(id, { pinned: !note.pinned });
            }}
            onReorder={store.reorderNotes}
          />
        </main>
      </div>

      {activeNote && (
        <NoteModal
          note={activeNote}
          labels={store.labels}
          onClose={() => setActiveNoteId(null)}
          onSave={store.updateNote}
          onArchiveToggle={(id) => {
            const note = store.notes.find((n) => n.id === id);
            store.setArchived(id, !note.archived);
          }}
          onRestore={store.restoreFromTrash}
          onDelete={(id) => {
            const note = store.notes.find((n) => n.id === id);
            if (note.trashed) store.permanentlyDeleteNote(id);
            else store.deleteNote(id);
          }}
          onToggleReminder={(id) => {
            const note = store.notes.find((n) => n.id === id);
            store.updateNote(id, { hasReminder: !note.hasReminder });
          }}
          onCreateLabel={store.addLabel}
          onToggleLabel={store.toggleNoteLabel}
        />
      )}

      {labelsModalOpen && (
        <LabelsModal
          labels={store.labels}
          onAdd={store.addLabel}
          onRemove={store.removeLabel}
          onClose={() => setLabelsModalOpen(false)}
        />
      )}

      <Toast toast={store.toast} />
    </>
  );
}
