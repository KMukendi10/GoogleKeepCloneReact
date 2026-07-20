import { useRef, useState } from "react";
import ColorPicker from "./ColorPicker";
import LabelPicker from "./LabelPicker";
import ReminderPicker from "./ReminderPicker";
import { formatReminder, isOverdue } from "../utils/date";
import pinIcon from "../assets/pinNote.svg";
import newlistIcon from "../assets/newlist.svg";
import drawingIcon from "../assets/newnotedrawing.svg";
import imageIcon from "../assets/newnoteimage.svg";
import formattingIcon from "../assets/formatting.svg";
import bgIcon from "../assets/backgroundOptions.svg";
import remindIcon from "../assets/remindMe.svg";
import collaboratorIcon from "../assets/collaborator.svg";
import addImageIcon from "../assets/addImage.svg";
import archiveIcon from "../assets/archive.svg";
import moreIcon from "../assets/more.svg";
import undoIcon from "../assets/undo.svg";
import labelIconSvg from "../assets/label.svg";

const EMPTY = { title: "", body: "", color: "default", labels: [], pinned: false, reminderAt: null };

export default function Composer({ labels, onAddNote, onCreateLabel }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [labelPopoverOpen, setLabelPopoverOpen] = useState(false);
  const [reminderPopoverOpen, setReminderPopoverOpen] = useState(false);
  const bodyRef = useRef(null);
  const wrapRef = useRef(null);

  function resizeBody() {
    if (!bodyRef.current) return;
    bodyRef.current.style.height = "auto";
    bodyRef.current.style.height = `${bodyRef.current.scrollHeight}px`;
  }

  function commit(extra = {}) {
    const title = draft.title.trim();
    const body = draft.body.trim();
    const finalDraft = { ...draft, ...extra };
    if (title || body) {
      onAddNote({ ...finalDraft, title, body });
      if (extra.archived) {
        // toast handled by caller via addNote flow if desired
      }
    }
    setDraft(EMPTY);
    setOpen(false);
    setColorPopoverOpen(false);
    setLabelPopoverOpen(false);
    setReminderPopoverOpen(false);
    if (bodyRef.current) bodyRef.current.style.height = "auto";
  }

  return (
    <section className="composer" aria-label="Create a new note">
      <div
        ref={wrapRef}
        className={`composer__form${open ? " is-open" : ""}`}
        data-color={draft.color}
        onBlur={(e) => {
          // Close (and save) once focus leaves the whole composer
          if (wrapRef.current && !wrapRef.current.contains(e.relatedTarget)) {
            commit();
          }
        }}
      >
        <button
          type="button"
          className="icon-btn composer__pin-btn"
          data-tooltip="Pin note"
          aria-pressed={draft.pinned}
          aria-label="Pin note"
          onClick={() => setDraft((d) => ({ ...d, pinned: !d.pinned }))}
        >
          <img src={pinIcon} alt="Pin note" />
        </button>

        <input
          type="text"
          className="composer__title"
          placeholder="Title"
          autoComplete="off"
          value={draft.title}
          onFocus={() => setOpen(true)}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
        />

        {open && draft.reminderAt && (
          <span className={`reminder-chip${isOverdue(draft.reminderAt) ? " is-overdue" : ""}`}>
            <img src={remindIcon} alt="" />
            {formatReminder(draft.reminderAt)}
          </span>
        )}

        <div className="composer__row">
          <textarea
            ref={bodyRef}
            className="composer__body"
            placeholder="Take a note…"
            rows={1}
            value={draft.body}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setDraft((d) => ({ ...d, body: e.target.value }));
              resizeBody();
            }}
          />
          {!open && (
            <div className="composer__quick-icons">
              <button type="button" className="icon-btn" data-tooltip="New list" aria-label="New checklist">
                <img src={newlistIcon} alt="New list" />
              </button>
              <button
                type="button"
                className="icon-btn"
                data-tooltip="New note with drawing"
                aria-label="Note with a drawing"
              >
                <img src={drawingIcon} alt="New Note With Drawing" />
              </button>
              <button
                type="button"
                className="icon-btn"
                data-tooltip="New note with image"
                aria-label="Note with image"
              >
                <img src={imageIcon} alt="New Note With Image" />
              </button>
            </div>
          )}
        </div>

        {open && (
          <div className="composer__toolbar">
            <div className="composer__quick-actions">
              <button type="button" className="icon-btn" data-tooltip="Text formatting" aria-label="Text formatting">
                <img src={formattingIcon} alt="Text formatting" />
              </button>
              <button
                type="button"
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
                type="button"
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
                type="button"
                className="icon-btn"
                data-tooltip="Remind me"
                aria-label="Set reminder"
                aria-haspopup="true"
                aria-expanded={reminderPopoverOpen}
                aria-pressed={Boolean(draft.reminderAt)}
                onClick={() => {
                  setReminderPopoverOpen((v) => !v);
                  setColorPopoverOpen(false);
                  setLabelPopoverOpen(false);
                }}
              >
                <img src={remindIcon} alt="Remind me" />
              </button>
              <button type="button" className="icon-btn" data-tooltip="Collaborator" aria-label="Add collaborator">
                <img src={collaboratorIcon} alt="Collaborator" />
              </button>
              <button type="button" className="icon-btn" data-tooltip="Add image" aria-label="Add image">
                <img src={addImageIcon} alt="Add image" />
              </button>
              <button
                type="button"
                className="icon-btn"
                data-tooltip="Archive"
                aria-label="Archive this note"
                onClick={() => commit({ archived: true })}
              >
                <img src={archiveIcon} alt="Archive" />
              </button>
              <button type="button" className="icon-btn" data-tooltip="More options" aria-label="More options">
                <img src={moreIcon} alt="More options" />
              </button>
              <button type="button" className="icon-btn" data-tooltip="Undo" aria-label="Undo" disabled>
                <img src={undoIcon} alt="Undo" />
              </button>

              {colorPopoverOpen && (
                <div className="color-popover">
                  <ColorPicker
                    selected={draft.color}
                    onSelect={(color) => setDraft((d) => ({ ...d, color }))}
                  />
                </div>
              )}
              {labelPopoverOpen && (
                <div className="color-popover label-popover-anchor">
                  <LabelPicker
                    labels={labels}
                    noteLabels={draft.labels}
                    onCreateLabel={onCreateLabel}
                    onToggle={(label) =>
                      setDraft((d) => ({
                        ...d,
                        labels: d.labels.includes(label)
                          ? d.labels.filter((l) => l !== label)
                          : [...d.labels, label],
                      }))
                    }
                  />
                </div>
              )}
              {reminderPopoverOpen && (
                <div className="color-popover reminder-popover-anchor">
                  <ReminderPicker
                    reminderAt={draft.reminderAt}
                    onSet={(ts) => {
                      setDraft((d) => ({ ...d, reminderAt: ts }));
                      setReminderPopoverOpen(false);
                    }}
                    onClear={() => {
                      setDraft((d) => ({ ...d, reminderAt: null }));
                      setReminderPopoverOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
            <div className="composer__actions">
              <button type="button" className="btn btn--text" onClick={() => commit()}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
