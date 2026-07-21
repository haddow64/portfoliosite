import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMoon,
  faSun,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { navigationItems } from "data/navigation";
import { Theme } from "../../constants/theme";
import "./nav.css";

const Nav = ({ theme, onToggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="nav-wrapper">
      <nav id="navbar" className="nav-container" aria-label="Primary navigation">
        <a className="logo" href="#home" onClick={() => setMenuOpen(false)}>
          Graeme Haddow
        </a>

        <div
          id="primary-navigation-links"
          className={`nav-links ${menuOpen ? "active" : ""}`}
        >
          {navigationItems.map(({ label, href }) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <button
            className="icon-button"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === Theme.DARK ? Theme.LIGHT : Theme.DARK} mode`}
            title={`Switch to ${theme === Theme.DARK ? Theme.LIGHT : Theme.DARK} mode`}
          >
            <FontAwesomeIcon
              icon={theme === Theme.DARK ? faSun : faMoon}
              aria-hidden="true"
            />
          </button>
          <button
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation-links"
            aria-label={`${menuOpen ? "Close" : "Open"} navigation`}
            title={`${menuOpen ? "Close" : "Open"} navigation`}
          >
            <FontAwesomeIcon
              icon={menuOpen ? faXmark : faBars}
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
