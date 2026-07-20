const COLORS = [
  { id: "default", label: "Default" },
  { id: "coral", label: "Coral" },
  { id: "sand", label: "Sand" },
  { id: "mint", label: "Mint" },
  { id: "sage", label: "Sage" },
  { id: "storm", label: "Storm" },
  { id: "dusk", label: "Dusk" },
  { id: "blossom", label: "Blossom" },
  { id: "clay", label: "Clay" },
];

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
