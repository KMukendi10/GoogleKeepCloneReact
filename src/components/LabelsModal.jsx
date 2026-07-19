import { useState } from "react";
import labelIcon from "../assets/label.svg";
import deleteIcon from "../assets/delete.svg";

export default function LabelsModal({ labels, onAdd, onRemove, onClose }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal labels-modal" role="dialog" aria-modal="true">
        <h2 className="labels-modal__title">Edit labels</h2>
        <form className="labels-modal__form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Create new label"
            autoComplete="off"
            maxLength={40}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="submit" className="icon-btn" data-tooltip="Add label" aria-label="Add label">
            <img src={labelIcon} alt="Add label" />
          </button>
        </form>
        <ul className="labels-modal__list" aria-label="Your labels">
          {labels.length === 0 && <li className="labels-modal__empty">No labels yet.</li>}
          {labels.map((label) => (
            <li key={label} className="labels-modal__item">
              <span>{label}</span>
              <button
                className="icon-btn"
                data-tooltip="Delete label"
                aria-label={`Delete label ${label}`}
                onClick={() => onRemove(label)}
              >
                <img src={deleteIcon} alt="Delete" />
              </button>
            </li>
          ))}
        </ul>
        <div className="modal__footer" style={{ borderTop: "none" }}>
          <button className="btn btn--text" style={{ marginLeft: "auto" }} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
