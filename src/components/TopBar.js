import { useState } from "react";
import logo from "../assets/Logo.png";
import menuIcon from "../assets/menu.svg";
import searchIcon from "../assets/search.svg";
import refreshIcon from "../assets/refresh.svg";
import listviewIcon from "../assets/listview.svg";
import settingsIcon from "../assets/settings.svg";
import appsIcon from "../assets/googleapps.svg";
import profileImg from "../assets/Profile.png";

export default function TopBar({
  searchQuery,
  onSearchChange,
  onMenuToggle,
  onRefresh,
  layoutMode,
  onToggleLayout,
  theme,
  onToggleTheme,
}) {
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  return (
    <header className={`topbar${mobileSearchActive ? " search-is-active" : ""}`}>
      <div className="topbar__left">
        <button
          className="icon-btn"
          data-tooltip="Main menu"
          aria-label="Toggle sidebar"
          onClick={onMenuToggle}
        >
          <img src={menuIcon} alt="Menu" />
        </button>
        <span className="topbar__logo" aria-hidden="true">
          <img src={logo} alt="Logo" />
        </span>
        <h1 className="topbar__title">Keep</h1>
      </div>

      <div className="topbar__search">
        <button
          type="button"
          className="icon-btn search-back-btn"
          aria-label="Exit search"
          onClick={() => {
            setMobileSearchActive(false);
            onSearchChange("");
          }}
        >
          <span style={{ fontSize: 20 }}>←</span>
        </button>
        <img src={searchIcon} alt="Search" className="search-lens-icon" />
        <label htmlFor="searchInput" className="visually-hidden">
          Search
        </label>
        <input
          type="search"
          id="searchInput"
          placeholder="Search"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="topbar__right">
        <button
          type="button"
          className="icon-btn mobile-search-btn"
          data-tooltip="Search"
          aria-label="Search"
          onClick={() => setMobileSearchActive(true)}
        >
          <img src={searchIcon} alt="Search" />
        </button>
        <button className="icon-btn" data-tooltip="Refresh" aria-label="Refresh notes" onClick={onRefresh}>
          <img src={refreshIcon} alt="Refresh" />
        </button>
        <button
          className="icon-btn"
          data-tooltip={layoutMode === "grid" ? "List view" : "Grid view"}
          aria-label="Toggle list/grid view"
          onClick={onToggleLayout}
        >
          <img src={listviewIcon} alt="List View" />
        </button>
        <button
          className="icon-btn"
          data-tooltip={theme === "dark" ? "Turn off dark mode" : "Turn on dark mode"}
          aria-label="Toggle dark mode"
          aria-pressed={theme === "dark"}
          onClick={onToggleTheme}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <button className="icon-btn" data-tooltip="Settings" aria-label="Settings (placeholder)">
          <img src={settingsIcon} alt="Settings" />
        </button>
        <button className="icon-btn" data-tooltip="Google apps" aria-label="Apps (placeholder)">
          <img src={appsIcon} alt="" />
        </button>
        <span
          className="topbar__avatar"
          aria-label="Account"
          data-tooltip="Account"
          style={{ backgroundImage: `url(${profileImg})` }}
        />
      </div>
    </header>
  );
}
