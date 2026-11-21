import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SEO from "../../components/SEO";
import { Header } from "../../components/Header/Header";
import { useAuth } from "../../hooks/useAuth";
import { useSubscription } from "../../hooks/useSubscription";
import { createCreemCheckout, type CreemPlan } from "../../services/creem";
import { Footer } from "../../components/Footer/Footer";

import "./Pricing.css";

const plans = [
  {
    id: "pro",
    tier: "pro",
    checkoutPlan: "pro" as const,
    fallbackPrice: 3.99,
    popular: false,
    includes: "includedFree",
    features: ["sevenDayForecast", "dailyPrecipitation", "advancedWind"],
  },
  {
    id: "proPlus",
    tier: "pro_plus",
    checkoutPlan: "proPlus" as const,
    fallbackPrice: 5.99,
    popular: true,
    includes: "includedPro",
    features: ["hourlyChart", "hourlyPrecipitation"],
  },
] as const;

const tierRank = { free: 0, pro: 1, pro_plus: 2 } as const;

export function Pricing() {
  const { t, i18n } = useTranslation();
  const { user, signInWithGoogle } = useAuth();
  const { tier, loading } = useSubscription();
  const [purchasing, setPurchasing] = useState<CreemPlan | null>(null);

  const handleSubscribe = async (plan: CreemPlan) => {
    if (!user) {
      await signInWithGoogle();
      return;
    }

    try {
      setPurchasing(plan);
      const checkoutUrl = await createCreemCheckout(plan, user);
      window.location.assign(checkoutUrl);
    } catch (err) {
      console.error("Creem checkout error:", err);
      alert(err instanceof Error ? err.message : "Unable to start checkout.");
    } finally {
      setPurchasing(null);
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
      { element: heroRef.current, key: "hero" as const },
      { element: plansRef.current, key: "plans" as const },
      { element: comparisonRef.current, key: "comparison" as const },
      { element: faqRef.current, key: "faq" as const },
      { element: ctaRef.current, key: "cta" as const },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const key = elements.find(
            (item) => item.element === entry.target,
          )?.key;
          if (!key) return;
          setVisibleSections((prev) => ({ ...prev, [key]: true }));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach(({ element }) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SEO
        title="WeatherPro Pricing — Free, Pro & Pro+ Plans"
        description="Compare WeatherPro Free, Pro, and Pro+ plans."
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
              const owned = tierRank[tier] >= tierRank[plan.tier];

              const label =
                tier === plan.tier
                  ? t("pricing.plans.current")
                  : owned
                    ? t("pricing.plans.included")
                    : purchasing === plan.checkoutPlan
                      ? t("pricing.premium.processing")
                      : !user
                        ? t("pricing.premium.signIn")
                        : t(`pricing.plans.${plan.id}.button`);

              const disabled =
                owned || purchasing !== null || (Boolean(user) && loading);

              return (
                <article
                  key={plan.id}
                  className={`pricing-card ${plan.popular ? "pricing-card--premium" : "pricing-card--pro"}`}
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
                      <strong>{plan.fallbackPrice}</strong>
                      <span>usd</span>
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
                    className={`pricing-card__button ${plan.popular ? "pricing-card__button--premium" : "pricing-card__button--secondary"}`}
                    disabled={disabled}
                    onClick={() => void handleSubscribe(plan.checkoutPlan)}
                  >
                    {label}
                    <span>→</span>
                  </button>

                  <p className="pricing-card__note">
                    {t("pricing.premium.note")}
                  </p>
                </article>
              );
            })}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
