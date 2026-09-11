import { useState } from "react";
import { Link } from "react-router-dom";

import { Header } from "../../components/Header/Header";

import "./Pricing.css";

type BillingPeriod = "monthly" | "yearly";

const features = [
  {
    name: "Поточна погода",
    free: true,
    premium: true,
  },
  {
    name: "Пошук міст",
    free: true,
    premium: true,
  },
  {
    name: "Детальні погодні показники",
    free: true,
    premium: true,
  },
  {
    name: "Прогноз на 7 днів",
    free: false,
    premium: true,
  },
  {
    name: "Погодинний графік",
    free: false,
    premium: true,
  },
  {
    name: "Ймовірність опадів",
    free: false,
    premium: true,
  },
  {
    name: "Розширені показники вітру",
    free: false,
    premium: true,
  },
];

const faqs = [
  {
    question: "Що входить у WeatherPro Premium?",
    answer:
      "Premium відкриває розширений прогноз на 7 днів, погодинні графіки, ймовірність опадів та додаткові погодні показники.",
  },
  {
    question: "Чи можна скасувати підписку?",
    answer:
      "Так. Після підключення підписку можна скасувати в будь-який момент. Доступ залишиться активним до завершення оплаченого періоду.",
  },
  {
    question: "Чим відрізняється річний план?",
    answer:
      "Річний план оплачується один раз на рік і має нижчу середню вартість на місяць порівняно з місячною підпискою.",
  },
  {
    question: "Чи є приховані платежі?",
    answer: "Ні. Перед оплатою ви побачите повну вартість вибраного плану.",
  },
];

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  const isYearly = billingPeriod === "yearly";

  const price = isYearly ? 799 : 99;
  const period = isYearly ? "рік" : "місяць";

  return (
    <div className="pricing">
      <Header />

      <main className="pricing__main">
        <section className="pricing__hero">
          <span className="pricing__eyebrow">WEATHERPRO PREMIUM</span>

          <h1 className="pricing__title">
            Обери свій
            <br />
            <span>рівень погоди</span>
          </h1>

          <p className="pricing__description">
            Отримуй більше даних, більше прогнозів та більше контролю над
            погодою.
          </p>

          <div className="pricing__toggle">
            <button
              type="button"
              className={
                !isYearly
                  ? "pricing__toggle-button pricing__toggle-button--active"
                  : "pricing__toggle-button"
              }
              onClick={() => setBillingPeriod("monthly")}
            >
              Щомісяця
            </button>

            <button
              type="button"
              className={
                isYearly
                  ? "pricing__toggle-button pricing__toggle-button--active"
                  : "pricing__toggle-button"
              }
              onClick={() => setBillingPeriod("yearly")}
            >
              Щороку
              <span>−33%</span>
            </button>
          </div>
        </section>

        <section className="pricing__plans">
          <article className="pricing-card pricing-card--free">
            <div className="pricing-card__top">
              <div className="pricing-card__icon">☁️</div>

              <span className="pricing-card__label">FREE</span>

              <h2 className="pricing-card__name">Безкоштовний</h2>

              <p className="pricing-card__description">
                Основна інформація про погоду без щомісячної оплати.
              </p>

              <div className="pricing-card__price">
                <strong>0</strong>
                <span>грн</span>
              </div>

              <p className="pricing-card__period">назавжди</p>
            </div>

            <ul className="pricing-card__features">
              <li>
                <span>✓</span>
                Поточна погода
              </li>

              <li>
                <span>✓</span>
                Пошук міст
              </li>

              <li>
                <span>✓</span>
                Основні погодні показники
              </li>

              <li className="pricing-card__feature--disabled">
                <span>×</span>
                Прогноз на 7 днів
              </li>

              <li className="pricing-card__feature--disabled">
                <span>×</span>
                Погодинний графік
              </li>
            </ul>

            <Link
              to="/"
              className="pricing-card__button pricing-card__button--secondary"
            >
              Почати безкоштовно
            </Link>
          </article>

          <article className="pricing-card pricing-card--premium">
            <div className="pricing-card__popular">
              <span>✦</span>
              НАЙПОПУЛЯРНІШИЙ
            </div>

            <div className="pricing-card__top">
              <div className="pricing-card__icon">✦</div>

              <span className="pricing-card__label">PREMIUM</span>

              <h2 className="pricing-card__name">WeatherPro Premium</h2>

              <p className="pricing-card__description">
                Повний доступ до розширених даних та прогнозів.
              </p>

              <div className="pricing-card__price">
                <strong>{price}</strong>
                <span>грн</span>
              </div>

              <p className="pricing-card__period">
                за {period}
                {isYearly && (
                  <span className="pricing-card__saving">
                    · економія 389 грн
                  </span>
                )}
              </p>
            </div>

            <ul className="pricing-card__features">
              <li>
                <span>✓</span>
                Усе з безкоштовного плану
              </li>

              <li>
                <span>✓</span>
                Прогноз на 7 днів
              </li>

              <li>
                <span>✓</span>
                Погодинний графік
              </li>

              <li>
                <span>✓</span>
                Ймовірність опадів
              </li>

              <li>
                <span>✓</span>
                Розширені показники вітру
              </li>
            </ul>

            <button
              type="button"
              className="pricing-card__button pricing-card__button--premium"
              onClick={() => {
                alert(
                  "Підключення RevenueCat буде додано на наступному етапі.",
                );
              }}
            >
              Отримати Premium
              <span>→</span>
            </button>

            <p className="pricing-card__note">
              Без прихованих платежів · Скасування будь-коли
            </p>
          </article>
        </section>

        <section className="pricing__comparison">
          <div className="pricing__section-heading">
            <span>ПОРІВНЯННЯ</span>

            <h2>
              Що ти отримуєш
              <br />з Premium?
            </h2>
          </div>

          <div className="comparison-table">
            <div className="comparison-table__header">
              <span>Можливість</span>
              <span>Free</span>
              <span>Premium</span>
            </div>

            {features.map((feature) => (
              <div className="comparison-table__row" key={feature.name}>
                <span>{feature.name}</span>

                <span>{feature.free ? "✓" : "—"}</span>

                <span>{feature.premium ? "✓" : "—"}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="pricing__faq">
          <div className="pricing__section-heading">
            <span>FAQ</span>

            <h2>Часті запитання</h2>
          </div>

          <div className="pricing__faq-list">
            {faqs.map((faq) => (
              <details className="pricing__faq-item" key={faq.question}>
                <summary>
                  <span>{faq.question}</span>
                  <span className="pricing__faq-plus">+</span>
                </summary>

                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="pricing__bottom-cta">
          <div>
            <span className="pricing__bottom-badge">✦ WEATHERPRO PREMIUM</span>

            <h2>
              Погода стає
              <br />
              <span>набагато цікавішою.</span>
            </h2>

            <p>Спробуй Premium та отримуй максимум інформації про погоду.</p>
          </div>

          <button
            type="button"
            className="pricing__bottom-button"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Обрати Premium
            <span>→</span>
          </button>
        </section>
      </main>
    </div>
  );
}
