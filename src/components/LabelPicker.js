import { useState } from "react";

export default function LabelPicker({ labels, noteLabels, onToggle, onCreateLabel }) {
  const [newLabel, setNewLabel] = useState("");

  function handleCreate(e) {
    e.preventDefault();
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    onCreateLabel(trimmed);
    onToggle(trimmed);
    setNewLabel("");
  }

  return (
    <div className="label-popover" role="menu" aria-label="Assign labels">
      <p className="label-popover__title">Label note</p>
      <form className="label-popover__form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Create new label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          maxLength={40}
        />
        <button type="submit" className="btn btn--text" disabled={!newLabel.trim()}>
          Add
        </button>
      </form>
      <ul className="label-popover__list">
        {labels.length === 0 && <li className="label-popover__empty">No labels yet.</li>}
        {labels.map((label) => (
          <li key={label}>
            <label className="label-popover__item">
              <input
                type="checkbox"
                checked={noteLabels.includes(label)}
                onChange={() => onToggle(label)}
              />
              <span>{label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
