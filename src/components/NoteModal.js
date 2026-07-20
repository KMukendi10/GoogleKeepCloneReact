import { useEffect, useRef, useState } from "react";
import ColorPicker from "./ColorPicker";
import LabelPicker from "./LabelPicker";
import ReminderPicker from "./ReminderPicker";
import archiveIcon from "../assets/archive.svg";
import restoreIcon from "../assets/restore.svg";
import deleteIcon from "../assets/delete.svg";
import remindIcon from "../assets/remindMe.svg";
import bgIcon from "../assets/backgroundOptions.svg";
import labelIconSvg from "../assets/label.svg";

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

export default function NoteModal({
  note,
  labels,
  onClose,
  onSave,
  onArchiveToggle,
  onRestore,
  onDelete,
  onSetReminder,
  onClearReminder,
  onCreateLabel,
  onToggleLabel,
}) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [color, setColor] = useState(note.color);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [labelPopoverOpen, setLabelPopoverOpen] = useState(false);
  const [reminderPopoverOpen, setReminderPopoverOpen] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    onSave(note.id, { title: title.trim(), body: body.trim(), color });
    onClose();
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" data-color={color}>
        <input
          ref={titleRef}
          type="text"
          className="modal__title"
          placeholder="Title"
          aria-label="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="modal__body"
          placeholder="Take a note…"
          aria-label="Note content"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        {note.reminderAt && (
          <span className={`reminder-chip${isOverdue(note.reminderAt) ? " is-overdue" : ""}`}>
            <img src={remindIcon} alt="" />
            {formatReminder(note.reminderAt)}
          </span>
        )}

        {note.labels?.length > 0 && (
          <div className="note-card__labels" style={{ marginBottom: 8 }}>
            {note.labels.map((label) => (
              <span key={label} className="label-chip">
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="modal__toolbar">
          <div className="modal__meta">Edited {formatDate(note.updatedAt)}</div>
        </div>

        <div className="modal__footer">
          {!note.trashed && (
            <button
              className="icon-btn"
              data-tooltip={note.archived ? "Restore" : "Archive"}
              aria-label="Archive note"
              onClick={() => {
                onArchiveToggle(note.id);
                onClose();
              }}
            >
              <img src={note.archived ? restoreIcon : archiveIcon} alt="Archive" />
            </button>
          )}
          {note.trashed && (
            <button
              className="icon-btn"
              data-tooltip="Restore"
              aria-label="Restore note"
              onClick={() => {
                onRestore(note.id);
                onClose();
              }}
            >
              <img src={restoreIcon} alt="Restore" />
            </button>
          )}
          <button
            className="icon-btn"
            data-tooltip="Remind me"
            aria-label="Set reminder"
            aria-haspopup="true"
            aria-expanded={reminderPopoverOpen}
            aria-pressed={Boolean(note.reminderAt)}
            onClick={() => {
              setReminderPopoverOpen((v) => !v);
              setColorPopoverOpen(false);
              setLabelPopoverOpen(false);
            }}
          >
            <img src={remindIcon} alt="Remind me" />
          </button>
          <button
            className="icon-btn"
            data-tooltip="Background options"
            aria-label="Choose note color"
            aria-haspopup="true"
            aria-expanded={colorPopoverOpen}
            onClick={() => {
              setColorPopoverOpen((v) => !v);
              setLabelPopoverOpen(false);
              setReminderPopoverOpen(false);
            }}
          >
            <img src={bgIcon} alt="Background options" />
          </button>
          <button
            className="icon-btn"
            data-tooltip="Add label"
            aria-label="Assign labels"
            aria-haspopup="true"
            aria-expanded={labelPopoverOpen}
            onClick={() => {
              setLabelPopoverOpen((v) => !v);
              setColorPopoverOpen(false);
              setReminderPopoverOpen(false);
            }}
          >
            <img src={labelIconSvg} alt="Add label" />
          </button>
          <button
            className="icon-btn"
            data-tooltip={note.trashed ? "Delete forever" : "Delete"}
            aria-label="Delete note"
            onClick={() => {
              onDelete(note.id);
              onClose();
            }}
          >
            <img src={deleteIcon} alt="Delete" />
          </button>

          {reminderPopoverOpen && (
            <div className="color-popover color-popover--modal reminder-popover-anchor">
              <ReminderPicker
                reminderAt={note.reminderAt}
                onSet={(ts) => {
                  onSetReminder(note.id, ts);
                  setReminderPopoverOpen(false);
                }}
                onClear={() => {
                  onClearReminder(note.id);
                  setReminderPopoverOpen(false);
                }}
              />
            </div>
          )}
          {colorPopoverOpen && (
            <div className="color-popover color-popover--modal">
              <ColorPicker selected={color} onSelect={setColor} />
            </div>
          )}
          {labelPopoverOpen && (
            <div className="color-popover color-popover--modal label-popover-anchor">
              <LabelPicker
                labels={labels}
                noteLabels={note.labels ?? []}
                onCreateLabel={onCreateLabel}
                onToggle={(label) => onToggleLabel(note.id, label)}
              />
            </div>
          )}

          <button className="btn btn--text" style={{ marginLeft: "auto" }} onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
