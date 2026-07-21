import archiveIcon from "../assets/archive.svg";
import restoreIcon from "../assets/restore.svg";
import deleteIcon from "../assets/delete.svg";
import pinIcon from "../assets/pinNote.svg";
import remindIcon from "../assets/remindMe.svg";

function formatDate(timestamp) {
  const d = new Date(timestamp);
  const opts = { month: "short", day: "numeric" };
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = "numeric";
  return d.toLocaleDateString(undefined, opts);
}

function formatReminder(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  const now = new Date();
  const opts = { month: "short", day: "numeric" };
  if (d.getFullYear() !== now.getFullYear()) opts.year = "numeric";
  const datePart = d.toLocaleDateString(undefined, opts);
  const timePart = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${datePart}, ${timePart}`;
}

function isOverdue(timestamp) {
  return Boolean(timestamp) && timestamp < Date.now();
}

export default function NoteCard({
  note,
  onOpen,
  onArchiveToggle,
  onRestore,
  onDelete,
  onTogglePin,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  isDragTarget,
}) {
  const isTrashed = note.trashed;
  const isArchived = note.archived;

  return (
    <article
      className={`note-card${isDragTarget ? " is-drag-over" : ""}`}
      tabIndex={0}
      data-color={note.color}
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, note.id)}
      onDragOver={(e) => onDragOver?.(e, note.id)}
      onDrop={(e) => onDrop?.(e, note.id)}
      onClick={() => onOpen(note.id)}
    >
      {!isTrashed && (
        <button
          type="button"
          className="icon-btn note-card__pin"
          data-tooltip={note.pinned ? "Unpin note" : "Pin note"}
          aria-pressed={note.pinned}
          aria-label="Pin note"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note.id);
          }}
        >
          <img src={pinIcon} alt="" />
        </button>
      )}

      {note.title && <h3 className="note-card__title">{note.title}</h3>}
      <p className="note-card__body">{note.body}</p>

      {note.reminderAt && (
        <span className={`reminder-chip${isOverdue(note.reminderAt) ? " is-overdue" : ""}`}>
          <img src={remindIcon} alt="" />
          {formatReminder(note.reminderAt)}
        </span>
      )}

      {note.labels?.length > 0 && (
        <div className="note-card__labels">
          {note.labels.map((label) => (
            <span key={label} className="label-chip">
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="note-card__footer">
        <time className="note-card__date">{formatDate(note.updatedAt)}</time>
        <div className="note-card__actions">
          {!isTrashed && (
            <button
              className="icon-btn"
              data-tooltip={isArchived ? "Restore" : "Archive"}
              aria-label={isArchived ? "Restore note" : "Archive note"}
              onClick={(e) => {
                e.stopPropagation();
                onArchiveToggle(note.id);
              }}
            >
              <img src={isArchived ? restoreIcon : archiveIcon} alt="" />
            </button>
          )}
          {isTrashed && (
            <button
              className="icon-btn"
              data-tooltip="Restore"
              aria-label="Restore note"
              onClick={(e) => {
                e.stopPropagation();
                onRestore(note.id);
              }}
            >
              <img src={restoreIcon} alt="" />
            </button>
          )}
          <button
            className="icon-btn"
            data-tooltip={isTrashed ? "Delete forever" : "Delete"}
            aria-label="Delete note"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
          >
            <img src={deleteIcon} alt="" />
          </button>
        </div>
      </div>
    </article>
  );
}
