import { useState } from "react";

// Converts a ms timestamp into the string a <input type="datetime-local">
// expects (local time, no timezone suffix).
function toDateTimeLocalValue(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

export default function ReminderPicker({ reminderAt, onSet, onClear }) {
  const [value, setValue] = useState(toDateTimeLocalValue(reminderAt));

  function applyPreset(offsetMs) {
    const next = Date.now() + offsetMs;
    setValue(toDateTimeLocalValue(next));
    onSet(next);
  }

  function handleSave() {
    if (!value) return;
    const ts = new Date(value).getTime();
    if (!Number.isNaN(ts)) onSet(ts);
  }

  return (
    <div className="reminder-popover" role="menu" aria-label="Set reminder">
      <p className="label-popover__title">Remind me</p>

      <div className="reminder-popover__presets">
        <button type="button" className="btn btn--text" onClick={() => applyPreset(3 * 60 * 60 * 1000)}>
          Later today
        </button>
        <button type="button" className="btn btn--text" onClick={() => applyPreset(24 * 60 * 60 * 1000)}>
          Tomorrow
        </button>
        <button
          type="button"
          className="btn btn--text"
          onClick={() => applyPreset(7 * 24 * 60 * 60 * 1000)}
        >
          Next week
        </button>
      </div>

      <input
        type="datetime-local"
        className="reminder-popover__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <div className="reminder-popover__actions">
        {reminderAt && (
          <button type="button" className="btn btn--text" onClick={onClear}>
            Remove
          </button>
        )}
        <button type="button" className="btn btn--text" disabled={!value} onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
