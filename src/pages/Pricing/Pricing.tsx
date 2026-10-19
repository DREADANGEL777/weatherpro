import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SEO from "../../components/SEO";
import { Header } from "../../components/Header/Header";
import { useAuth } from "../../hooks/useAuth";
import { useSubscription } from "../../hooks/useSubscription";

import "./Pricing.css";

const features = [
  { key: "currentWeather", free: true, pro: true, proPlus: true },
  { key: "citySearch", free: true, pro: true, proPlus: true },
  { key: "detailedWeather", free: true, pro: true, proPlus: true },
  { key: "sevenDayForecast", free: false, pro: true, proPlus: true },
  { key: "dailyPrecipitation", free: false, pro: true, proPlus: true },
  { key: "advancedWind", free: false, pro: true, proPlus: true },
  { key: "hourlyChart", free: false, pro: false, proPlus: true },
  { key: "hourlyPrecipitation", free: false, pro: false, proPlus: true },
];

const plans = [
  {
    id: "pro",
    tier: "pro",
    packageId: "premium",
    fallbackPrice: 99,
    popular: false,
    includes: "includedFree",
    features: ["sevenDayForecast", "dailyPrecipitation", "advancedWind"],
  },
  {
    id: "proPlus",
    tier: "pro_plus",
    packageId: "premium_plus",
    fallbackPrice: 199,
    popular: true,
    includes: "includedPro",
    features: ["hourlyChart", "hourlyPrecipitation"],
  },
] as const;

const tierRank = { free: 0, pro: 1, pro_plus: 2 } as const;

const faqs = [
  {
    key: "premium",
  },
  {
    key: "cancel",
  },
  {
    key: "difference",
  },
  {
    key: "hiddenFees",
  },
];

export function Pricing() {
  const { t, i18n } = useTranslation();

  const { user, signInWithGoogle } = useAuth();
  const { tier, loading, purchasing, error, packages, purchasePackage } =
    useSubscription();

  const handleSubscribe = async (packageId: string) => {
    if (!user) {
      await signInWithGoogle();

      return;
    }

    const selectedPackage = packages.find(
      (item) => item.identifier === packageId,
    );

    if (selectedPackage) {
      await purchasePackage(selectedPackage);
    }
  };

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
    <>
      <SEO
        title="WeatherPro Pricing — Free, Pro & Pro+ Plans"
        description="Compare WeatherPro Free, Pro, and Pro+ plans. Explore weather forecasts, detailed weather data, and premium features."
        lang={i18n.resolvedLanguage || i18n.language || "en"}
        canonical="https://weatherpro.site/pricing"
      />

      <div className="pricing">
        <Header />

        <main className="pricing__main">
          <section
            ref={heroRef}
            className={`pricing__hero ${visibleSections.hero ? "pricing__section--visible" : ""}`}
          >
            <span className="pricing__eyebrow">
              {t("pricing.hero.eyebrow")}
            </span>

            <h1 className="pricing__title">
              {t("pricing.hero.titleFirst")}
              <br />
              <span>{t("pricing.hero.titleSecond")}</span>
            </h1>

            <p className="pricing__description">
              {t("pricing.hero.description")}
            </p>
          </section>

          <section
            ref={plansRef}
            className={`pricing__plans ${visibleSections.plans ? "pricing__section--visible" : ""}`}
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

                <p className="pricing-card__period">
                  {t("pricing.free.period")}
                </p>
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

            {plans.map((plan) => {
              const selectedPackage = packages.find(
                (item) => item.identifier === plan.packageId,
              );

              const price = selectedPackage?.webBillingProduct.currentPrice;

              const owned = tierRank[tier] >= tierRank[plan.tier];

              const label =
                tier === plan.tier
                  ? t("pricing.plans.current")
                  : owned
                    ? t("pricing.plans.included")
                    : purchasing
                      ? t("pricing.premium.processing")
                      : !user
                        ? t("pricing.premium.signIn")
                        : t(`pricing.plans.${plan.id}.button`);

              const disabled =
                owned ||
                purchasing ||
                (Boolean(user) && (loading || !selectedPackage));

              return (
                <article
                  key={plan.id}
                  className={`pricing-card ${
                    plan.popular ? "pricing-card--premium" : "pricing-card--pro"
                  }`}
                >
                  {plan.popular && (
                    <div className="pricing-card__popular">
                      <span>✦</span>
                      {t("pricing.premium.popular")}
                    </div>
                  )}

                  <div className="pricing-card__top">
                    <div className="pricing-card__icon">✦</div>

                    <span className="pricing-card__label">
                      {t(`pricing.plans.${plan.id}.name`).toUpperCase()}
                    </span>

                    <h2 className="pricing-card__name">
                      WeatherPro {t(`pricing.plans.${plan.id}.name`)}
                    </h2>

                    <p className="pricing-card__description">
                      {t(`pricing.plans.${plan.id}.description`)}
                    </p>

                    <div className="pricing-card__price">
                      {price ? (
                        <strong>{price.formattedPrice}</strong>
                      ) : (
                        <>
                          <strong>{plan.fallbackPrice}</strong>
                          <span>{t("pricing.currency")}</span>
                        </>
                      )}
                    </div>

                    <p className="pricing-card__period">
                      {t("pricing.plans.perMonth")}
                    </p>
                  </div>

                  <ul className="pricing-card__features">
                    <li>
                      <span>✓</span>
                      {t(`pricing.plans.${plan.includes}`)}
                    </li>

                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <span>✓</span>
                        {t(`pricing.features.${feature}`)}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={`pricing-card__button ${
                      plan.popular
                        ? "pricing-card__button--premium"
                        : "pricing-card__button--secondary"
                    }`}
                    disabled={disabled}
                    onClick={() => void handleSubscribe(plan.packageId)}
                  >
                    {label}
                    <span>→</span>
                  </button>

                  {error && plan.popular && (
                    <p className="pricing-card__error" role="alert">
                      {t(`pricing.premium.error.${error}`)}
                    </p>
                  )}

                  <p className="pricing-card__note">
                    {t("pricing.premium.note")}
                  </p>
                </article>
              );
            })}
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

                <span>Premium+</span>
              </div>

              {features.map((feature) => (
                <div className="comparison-table__row" key={feature.key}>
                  <span>{t(`pricing.features.${feature.key}`)}</span>

                  <span>{feature.free ? "✓" : "—"}</span>

                  <span>{feature.pro ? "✓" : "—"}</span>

                  <span>{feature.proPlus ? "✓" : "—"}</span>
                </div>
              ))}
            </div>
          </section>

          <section
            ref={faqRef}
            className={`pricing__faq ${visibleSections.faq ? "pricing__section--visible" : ""}`}
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
    </>
  );
}
