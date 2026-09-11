import { Link, NavLink } from "react-router-dom";

import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">☁️</span>

          <span className="header__logo-text">
            Weather<span>Pro</span>
          </span>
        </Link>

        <nav className="header__nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `header__link ${isActive ? "header__link--active" : ""}`
            }
          >
            Погода
          </NavLink>

          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              `header__link ${isActive ? "header__link--active" : ""}`
            }
          >
            Premium
          </NavLink>
        </nav>

        <Link to="/pricing" className="header__premium-button">
          <span>✦</span>
          Premium
        </Link>
      </div>
    </header>
  );
}