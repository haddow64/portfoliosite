import React from "react";
import "./menu.css";
// Router
import { NavLink } from "components/Nav/NavLink/NavLink";

export const Menu = ({ menuOpen, setMenuOpen }) => {
  return (
    <div className={"menu " + (menuOpen && "active")}>
      <ul>
        <NavLink text="Home" path="home" onClick={() => setMenuOpen(false)} />
        <NavLink
          text="Skills"
          path="skills"
          onClick={() => setMenuOpen(false)}
        />
        <NavLink
          text="Connect"
          path="connect"
          onClick={() => setMenuOpen(false)}
        />
      </ul>
    </div>
  );
};
