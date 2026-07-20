import { COLORS } from "../data/colors";

export default function ColorPicker({ selected, onSelect }) {
  return (
    <div className="composer__colors" role="radiogroup" aria-label="Note color">
      {COLORS.map((color) => (
        <button
          key={color.id}
          type="button"
          className={`color-swatch${color.id === selected ? " is-selected" : ""}`}
          style={{ background: `var(--paper-${color.id})` }}
          role="radio"
          aria-checked={color.id === selected}
          aria-label={color.label}
          data-tooltip={color.label}
          onClick={() => onSelect(color.id)}
        />
      ))}
    </div>
  );
}
