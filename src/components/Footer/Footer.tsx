import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./Footer.css";

export function Footer() {
  const { i18n } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <Link
          to="/"
          className="site-footer__brand"
          aria-label="WeatherPro home"
        >
          <span className="site-footer__brand-icon" aria-hidden="true">
            ☀
          </span>
          <span>WeatherPro</span>
        </Link>

        <p className="site-footer__copyright">
          © {year} WeatherPro. All rights reserved.
        </p>

        <nav className="site-footer__links" aria-label="Legal links">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <a href="mailto:lasercuttingadmin4225@gmail.com">
            lasercuttingadmin4225@gmail.com
          </a>
        </nav>
      </div>
    </footer>
  );
}
