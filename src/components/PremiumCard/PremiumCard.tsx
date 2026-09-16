import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./PremiumCard.css";

const features = [
  {
    icon: "📅",
    titleKey: "premiumCard.features.forecast.title",
    descriptionKey: "premiumCard.features.forecast.description",
  },
  {
    icon: "📈",
    titleKey: "premiumCard.features.hourly.title",
    descriptionKey: "premiumCard.features.hourly.description",
  },
  {
    icon: "🌧️",
    titleKey: "premiumCard.features.precipitation.title",
    descriptionKey: "premiumCard.features.precipitation.description",
  },
  {
    icon: "💨",
    titleKey: "premiumCard.features.advanced.title",
    descriptionKey: "premiumCard.features.advanced.description",
  },
];

export function PremiumCard() {
  const { t } = useTranslation();

  return (
    <section className="premium-card">
      <div className="premium-card__glow premium-card__glow--one" />
      <div className="premium-card__glow premium-card__glow--two" />

      <div className="premium-card__content">
        <div className="premium-card__badge">
          <span>✦</span>
          {t("premiumCard.badge")}
        </div>

        <h2 className="premium-card__title">
          {t("premiumCard.titleFirst")}
          <br />
          <span>{t("premiumCard.titleSecond")}</span>
        </h2>

        <p className="premium-card__description">
          {t("premiumCard.description")}
        </p>

        <Link to="/pricing" className="premium-card__button">
          {t("premiumCard.button")}
          <span>→</span>
        </Link>

        <p className="premium-card__note">{t("premiumCard.note")}</p>
      </div>

      <div className="premium-card__features">
        {features.map((feature) => (
          <div className="premium-card__feature" key={feature.titleKey}>
            <div className="premium-card__feature-icon">{feature.icon}</div>

            <div className="premium-card__feature-content">
              <strong>{t(feature.titleKey)}</strong>

              <span>{t(feature.descriptionKey)}</span>
            </div>

            <span className="premium-card__check">✓</span>
          </div>
        ))}
      </div>
    </section>
  );
}
