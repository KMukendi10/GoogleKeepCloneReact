import notesIcon from "../assets/notes.svg";
import remindersIcon from "../assets/reminders.svg";
import editIcon from "../assets/edit.svg";
import archiveIcon from "../assets/archive.svg";
import deleteIcon from "../assets/delete.svg";
import labelIcon from "../assets/label.svg";

export default function Sidebar({
  isOpen,
  isExpanded,
  currentView,
  onSelectView,
  labels,
  onOpenLabelsModal,
}) {
  const items = [
    { view: "notes", label: "Notes", icon: notesIcon },
    { view: "reminders", label: "Reminders", icon: remindersIcon },
  ];

  return (
    <nav
      className={`sidebar${isExpanded ? " is-expanded" : ""}${isOpen ? " is-open" : ""}`}
      aria-label="Board sections"
    >
      {items.map((item) => (
        <button
          key={item.view}
          className={`sidebar__item${currentView === item.view ? " is-active" : ""}`}
          data-tooltip={item.label}
          onClick={() => onSelectView(item.view)}
        >
          <img src={item.icon} alt="" />
          <span className="sidebar__label">{item.label}</span>
        </button>
      ))}

      {labels.map((label) => (
        <button
          key={label}
          className={`sidebar__item${currentView === `label:${label}` ? " is-active" : ""}`}
          data-tooltip={label}
          onClick={() => onSelectView(`label:${label}`)}
        >
          <img src={labelIcon} alt="" />
          <span className="sidebar__label">{label}</span>
        </button>
      ))}

      <button className="sidebar__item" data-tooltip="Edit labels" onClick={onOpenLabelsModal}>
        <img src={editIcon} alt="Edit labels" />
        <span className="sidebar__label">Edit labels</span>
      </button>

      <button
        className={`sidebar__item${currentView === "archive" ? " is-active" : ""}`}
        data-tooltip="Archive"
        onClick={() => onSelectView("archive")}
      >
        <img src={archiveIcon} alt="" />
        <span className="sidebar__label">Archive</span>
      </button>

      <button
        className={`sidebar__item${currentView === "trash" ? " is-active" : ""}`}
        data-tooltip="Trash"
        onClick={() => onSelectView("trash")}
      >
        <img src={deleteIcon} alt="Trash" />
        <span className="sidebar__label">Trash</span>
      </button>
    </nav>
  );
}
