import { useState } from "react";
import NoteCard from "./NoteCard";
import emptyIllustration from "../assets/notes2.svg";

export default function NotesGrid({
  notes,
  layoutMode,
  currentView,
  searchQuery,
  onOpen,
  onArchiveToggle,
  onRestore,
  onDelete,
  onTogglePin,
  onReorder,
}) {
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  const canDrag = currentView === "notes" && !searchQuery.trim();

  function handleDragStart(e, id) {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  }
  function handleDragOver(e, id) {
    e.preventDefault();
    if (id !== dragId) setOverId(id);
  }
  function handleDrop(e, id) {
    e.preventDefault();
    if (dragId && dragId !== id) onReorder(dragId, id);
    setDragId(null);
    setOverId(null);
  }

  if (notes.length === 0) {
    let text = "Notes you add appear here";
    if (searchQuery.trim()) text = "No notes match your search.";
    else if (currentView === "archive") text = "Nothing archived yet.";
    else if (currentView === "trash") text = "No notes in Trash.";
    else if (currentView === "reminders") text = "No reminders yet.";
    else if (currentView.startsWith("label:")) text = "No notes with this label yet.";

    return (
      <div className="empty-state">
        <img src={emptyIllustration} alt="empty state illustration" />
        <p>{text}</p>
      </div>
    );
  }

  return (
    <section className={`notes-grid${layoutMode === "list" ? " is-list-view" : ""}`} aria-live="polite">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onOpen={onOpen}
          onArchiveToggle={onArchiveToggle}
          onRestore={onRestore}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
          draggable={canDrag}
          onDragStart={canDrag ? handleDragStart : undefined}
          onDragOver={canDrag ? handleDragOver : undefined}
          onDrop={canDrag ? handleDrop : undefined}
          isDragTarget={overId === note.id}
        />
      ))}
    </section>
  );
}
