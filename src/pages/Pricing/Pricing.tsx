import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Header } from "../../components/Header/Header";

import "./Pricing.css";

type BillingPeriod = "monthly" | "yearly";

const features = [
  {
    key: "currentWeather",
    free: true,
    premium: true,
  },
  {
    key: "citySearch",
    free: true,
    premium: true,
  },
  {
    key: "detailedWeather",
    free: true,
    premium: true,
  },
  {
    key: "sevenDayForecast",
    free: false,
    premium: true,
  },
  {
    key: "hourlyChart",
    free: false,
    premium: true,
  },
  {
    key: "precipitationProbability",
    free: false,
    premium: true,
  },
  {
    key: "advancedWind",
    free: false,
    premium: true,
  },
];

const faqs = [
  {
    key: "premium",
  },
  {
    key: "cancel",
  },
  {
    key: "yearly",
  },
  {
    key: "hiddenFees",
  },
];

export function Pricing() {
  const { t } = useTranslation();

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  const isYearly = billingPeriod === "yearly";

  const price = isYearly ? 799 : 99;

  const heroRef = useRef<HTMLElement | null>(null);
  const plansRef = useRef<HTMLElement | null>(null);
  const comparisonRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLElement | null>(null);

  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    plans: false,
    comparison: false,
    faq: false,
    cta: false,
  });

  useEffect(() => {
    const elements = [
      {
        element: heroRef.current,
        key: "hero" as const,
      },
      {
        element: plansRef.current,
        key: "plans" as const,
      },
      {
        element: comparisonRef.current,
        key: "comparison" as const,
      },
      {
        element: faqRef.current,
        key: "faq" as const,
      },
      {
        element: ctaRef.current,
        key: "cta" as const,
      },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const key = elements.find(
            (item) => item.element === entry.target,
          )?.key;

          if (!key) return;

          setVisibleSections((prev) => ({
            ...prev,
            [key]: true,
          }));

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
      },
    );

    elements.forEach(({ element }) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="pricing">
      <Header />

      <main className="pricing__main">
        <section
          ref={heroRef}
          className={`pricing__hero ${
            visibleSections.hero ? "pricing__section--visible" : ""
          }`}
        >
          <span className="pricing__eyebrow">{t("pricing.hero.eyebrow")}</span>

          <h1 className="pricing__title">
            {t("pricing.hero.titleFirst")}
            <br />
            <span>{t("pricing.hero.titleSecond")}</span>
          </h1>

          <p className="pricing__description">
            {t("pricing.hero.description")}
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
              {t("pricing.billing.monthly")}
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
              {t("pricing.billing.yearly")}
              <span>{t("pricing.billing.discount")}</span>
            </button>
          </div>
        </section>

        <section
          ref={plansRef}
          className={`pricing__plans ${
            visibleSections.plans ? "pricing__section--visible" : ""
          }`}
        >
          <article className="pricing-card pricing-card--free">
            <div className="pricing-card__top">
              <div className="pricing-card__icon">☁️</div>

              <span className="pricing-card__label">FREE</span>

              <h2 className="pricing-card__name">{t("pricing.free.name")}</h2>

              <p className="pricing-card__description">
                {t("pricing.free.description")}
              </p>

              <div className="pricing-card__price">
                <strong>0</strong>
                <span>{t("pricing.currency")}</span>
              </div>

              <p className="pricing-card__period">{t("pricing.free.period")}</p>
            </div>

            <ul className="pricing-card__features">
              <li>
                <span>✓</span>
                {t("pricing.features.currentWeather")}
              </li>

              <li>
                <span>✓</span>
                {t("pricing.features.citySearch")}
              </li>

              <li>
                <span>✓</span>
                {t("pricing.features.basicWeather")}
              </li>

              <li className="pricing-card__feature--disabled">
                <span>×</span>
                {t("pricing.features.sevenDayForecast")}
              </li>

              <li className="pricing-card__feature--disabled">
                <span>×</span>
                {t("pricing.features.hourlyChart")}
              </li>
            </ul>

            <Link
              to="/"
              className="pricing-card__button pricing-card__button--secondary"
            >
              {t("pricing.free.button")}
            </Link>
          </article>

          <article className="pricing-card pricing-card--premium">
            <div className="pricing-card__popular">
              <span>✦</span>
              {t("pricing.premium.popular")}
            </div>

            <div className="pricing-card__top">
              <div className="pricing-card__icon">✦</div>

              <span className="pricing-card__label">PREMIUM</span>

              <h2 className="pricing-card__name">WeatherPro Premium</h2>

              <p className="pricing-card__description">
                {t("pricing.premium.description")}
              </p>

              <div className="pricing-card__price">
                <strong>{price}</strong>
                <span>{t("pricing.currency")}</span>
              </div>

              <p className="pricing-card__period">
                {t("pricing.premium.per", {
                  period: isYearly
                    ? t("pricing.period.year")
                    : t("pricing.period.month"),
                })}

                {isYearly && (
                  <span className="pricing-card__saving">
                    ·{" "}
                    {t("pricing.premium.saving", {
                      amount: 389,
                    })}
                  </span>
                )}
              </p>
            </div>

            <ul className="pricing-card__features">
              <li>
                <span>✓</span>
                {t("pricing.premium.allFree")}
              </li>

              <li>
                <span>✓</span>
                {t("pricing.features.sevenDayForecast")}
              </li>

              <li>
                <span>✓</span>
                {t("pricing.features.hourlyChart")}
              </li>

              <li>
                <span>✓</span>
                {t("pricing.features.precipitationProbability")}
              </li>

              <li>
                <span>✓</span>
                {t("pricing.features.advancedWind")}
              </li>
            </ul>

            <button
              type="button"
              className="pricing-card__button pricing-card__button--premium"
              onClick={() => {
                alert(t("pricing.premium.alert"));
              }}
            >
              {t("pricing.premium.button")}
              <span>→</span>
            </button>

            <p className="pricing-card__note">{t("pricing.premium.note")}</p>
          </article>
        </section>

        <section
          ref={comparisonRef}
          className={`pricing__comparison ${
            visibleSections.comparison ? "pricing__section--visible" : ""
          }`}
        >
          <div className="pricing__section-heading">
            <span>{t("pricing.comparison.eyebrow")}</span>

            <h2>
              {t("pricing.comparison.titleFirst")}
              <br />
              {t("pricing.comparison.titleSecond")}
            </h2>
          </div>

          <div className="comparison-table">
            <div className="comparison-table__header">
              <span>{t("pricing.comparison.feature")}</span>

              <span>Free</span>

              <span>Premium</span>
            </div>

            {features.map((feature) => (
              <div className="comparison-table__row" key={feature.key}>
                <span>{t(`pricing.features.${feature.key}`)}</span>

                <span>{feature.free ? "✓" : "—"}</span>

                <span>{feature.premium ? "✓" : "—"}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          ref={faqRef}
          className={`pricing__faq ${
            visibleSections.faq ? "pricing__section--visible" : ""
          }`}
        >
          <div className="pricing__section-heading">
            <span>{t("pricing.faq.eyebrow")}</span>

            <h2>{t("pricing.faq.title")}</h2>
          </div>

          <div className="pricing__faq-list">
            {faqs.map((faq) => (
              <details className="pricing__faq-item" key={faq.key}>
                <summary>
                  <span>{t(`pricing.faq.items.${faq.key}.question`)}</span>

                  <span className="pricing__faq-plus">+</span>
                </summary>

                <p>{t(`pricing.faq.items.${faq.key}.answer`)}</p>
              </details>
            ))}
          </div>
        </section>

        <section
          ref={ctaRef}
          className={`pricing__bottom-cta ${
            visibleSections.cta ? "pricing__section--visible" : ""
          }`}
        >
          <div>
            <span className="pricing__bottom-badge">
              ✦ {t("pricing.bottom.badge")}
            </span>

            <h2>
              {t("pricing.bottom.titleFirst")}
              <br />
              <span>{t("pricing.bottom.titleSecond")}</span>
            </h2>

            <p>{t("pricing.bottom.description")}</p>
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
            {t("pricing.bottom.button")}
            <span>→</span>
          </button>
        </section>
      </main>
    </div>
  );
}
