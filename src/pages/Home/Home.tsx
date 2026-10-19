import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import SEO from "../../components/SEO";
import { Header } from "../../components/Header/Header";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { CurrentWeather } from "../../components/CurrentWeather/CurrentWeather";
import { WeatherDetails } from "../../components/WeatherDetails/WeatherDetails";
import { Forecast } from "../../components/Forecast/Forecast";
import { WeatherChart } from "../../components/WeatherChart/WeatherChart";
import { PremiumCard } from "../../components/PremiumCard/PremiumCard";

import { useSubscription } from "../../hooks/useSubscription";
import { useWeather } from "../../hooks/useWeather";

import "./Home.css";

export function Home() {
  const { t, i18n } = useTranslation();

  const { hasPro, hasProPlus } = useSubscription();

  const lockKey = !hasPro ? "premiumLock" : !hasProPlus ? "proPlusLock" : null;

  const [showScrollTop, setShowScrollTop] = useState(false);

  const {
    location,
    weather,
    locations,
    loading,
    searchLoading,
    search,
    selectLocation,
  } = useWeather();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight <= 0) {
        setShowScrollTop(false);
        return;
      }

      const scrollProgress = scrollTop / scrollHeight;

      setShowScrollTop(scrollProgress >= 0.5);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <SEO
        title="WeatherPro — Current Weather & Forecasts"
        description="Check current weather conditions and forecasts with WeatherPro."
        lang={i18n.resolvedLanguage || i18n.language || "en"}
      />

      <div className="home">
        <Header />

        <main className="home__main">
          <section className="home__hero">
            <div className="home__hero-content">
              <h1 className="home__title">
                {t("home.titleFirst")}
                <br />
                <span>{t("home.titleSecond")}</span>
              </h1>

              <p className="home__description">{t("home.description")}</p>

              <SearchBar
                locations={locations}
                loading={loading}
                searchLoading={searchLoading}
                onSearch={search}
                onSelectLocation={selectLocation}
              />
            </div>
          </section>

          <section className="home__weather">
            {weather ? (
              <>
                <CurrentWeather
                  weather={weather}
                  location={location}
                  loading={loading}
                />

                <WeatherDetails weather={weather} />

                {hasPro && <Forecast weather={weather} />}

                {hasProPlus && <WeatherChart weather={weather} />}

                {lockKey && (
                  <section className="home__premium-lock">
                    <div className="home__premium-lock-icon">✦</div>

                    <div className="home__premium-lock-content">
                      <span className="home__premium-lock-label">
                        {t(`home.${lockKey}.label`)}
                      </span>

                      <h2>{t(`home.${lockKey}.title`)}</h2>

                      <p>{t(`home.${lockKey}.description`)}</p>
                    </div>

                    <a href="/pricing" className="home__premium-lock-button">
                      {t(`home.${lockKey}.button`)}
                      <span>→</span>
                    </a>
                  </section>
                )}

                <PremiumCard />
              </>
            ) : (
              <div className="home__weather-placeholder">
                <span>☀️</span>

                <h2>{t("home.loading.title")}</h2>

                <p>{t("home.loading.description")}</p>
              </div>
            )}
          </section>
        </main>

        {/* Scroll to top */}
        <button
          type="button"
          className={`home__scroll-top ${
            showScrollTop ? "home__scroll-top--visible" : ""
          }`}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <span className="home__scroll-top-arrow">↑</span>
        </button>
      </div>
    </>
  );
}
