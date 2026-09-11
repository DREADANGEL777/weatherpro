import { Link } from "react-router-dom";

import "./PremiumCard.css";

const features = [
  {
    icon: "📅",
    title: "Прогноз на 7 днів",
    description: "Детальний прогноз на весь тиждень",
  },
  {
    icon: "📈",
    title: "Погодинні графіки",
    description: "Температура та погодні зміни по годинах",
  },
  {
    icon: "🌧️",
    title: "Ймовірність опадів",
    description: "Точна інформація про можливі опади",
  },
  {
    icon: "💨",
    title: "Розширені дані",
    description: "Пориви вітру, тиск та додаткові показники",
  },
];

export function PremiumCard() {
  return (
    <section className="premium-card">
      <div className="premium-card__glow premium-card__glow--one" />
      <div className="premium-card__glow premium-card__glow--two" />

      <div className="premium-card__content">
        <div className="premium-card__badge">
          <span>✦</span>
          WEATHERPRO PREMIUM
        </div>

        <h2 className="premium-card__title">
          Більше можливостей.
          <br />
          <span>Більше контролю.</span>
        </h2>

        <p className="premium-card__description">
          Отримуйте максимум інформації про погоду
          завдяки розширеним прогнозам, графікам та
          додатковим погодним показникам.
        </p>

        <Link
          to="/pricing"
          className="premium-card__button"
        >
          Переглянути Premium
          <span>→</span>
        </Link>

        <p className="premium-card__note">
          Без прихованих платежів · Скасувати можна
          будь-коли
        </p>
      </div>

      <div className="premium-card__features">
        {features.map((feature) => (
          <div
            className="premium-card__feature"
            key={feature.title}
          >
            <div className="premium-card__feature-icon">
              {feature.icon}
            </div>

            <div className="premium-card__feature-content">
              <strong>{feature.title}</strong>

              <span>{feature.description}</span>
            </div>

            <span className="premium-card__check">
              ✓
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}