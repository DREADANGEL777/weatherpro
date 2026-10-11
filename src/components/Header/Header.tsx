import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../hooks/useAuth";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

import "./Header.css";

export function Header() {
  const { t } = useTranslation();
  const { user, loading, signInWithGoogle, signOut } = useAuth();

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
            {t("header.weather")}
          </NavLink>
        </nav>

        <LanguageSwitcher />

        {!loading && (
          <button
            type="button"
            className="header__auth-button"
            onClick={() => void (user ? signOut() : signInWithGoogle())}
          >
            {user ? t("header.signOut") : t("header.signIn")}
          </button>
        )}

        <Link to="/pricing" className="header__premium-button">
          <span>✦</span>

          {t("header.premiumButton")}
        </Link>
      </div>
    </header>
  );
}
