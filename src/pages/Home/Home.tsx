import { useTranslation } from "react-i18next";

import { Header } from "../../components/Header/Header";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { CurrentWeather } from "../../components/CurrentWeather/CurrentWeather";
import { WeatherDetails } from "../../components/WeatherDetails/WeatherDetails";
import { Forecast } from "../../components/Forecast/Forecast";
import { WeatherChart } from "../../components/WeatherChart/WeatherChart";
import { PremiumCard } from "../../components/PremiumCard/PremiumCard";

import { useWeather } from "../../hooks/useWeather";

import "./Home.css";

export function Home() {
  const { t } = useTranslation();

  const isPremium = true;

  const {
    location,
    weather,
    locations,
    loading,
    searchLoading,
    search,
    selectLocation,
  } = useWeather();

  return (
    <div className="home">
      <Header />

      <main className="home__main">
        <section className="home__hero">
          <div className="home__hero-content">
            <span className="home__eyebrow">{t("home.eyebrow")}</span>

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

              {isPremium && (
                <>
                  <Forecast weather={weather} />

                  <WeatherChart weather={weather} />
                </>
              )}

              {!isPremium && (
                <section className="home__premium-lock">
                  <div className="home__premium-lock-icon">✦</div>

                  <div className="home__premium-lock-content">
                    <span className="home__premium-lock-label">
                      {t("home.premiumLock.label")}
                    </span>

                    <h2>{t("home.premiumLock.title")}</h2>

                    <p>{t("home.premiumLock.description")}</p>
                  </div>

                  <a href="/pricing" className="home__premium-lock-button">
                    {t("home.premiumLock.button")}
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
    </div>
  );
}
