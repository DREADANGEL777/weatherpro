import { useTranslation } from "react-i18next";

import type { Location, WeatherResponse } from "../../types/weather";

import { getWeatherDescription } from "../../utils/weatherCode";
import { translateCountry } from "../../utils/countryTranslation";

import "./CurrentWeather.css";

interface CurrentWeatherProps {
  weather: WeatherResponse;
  location: Location;
  loading: boolean;
}

function formatTime(time: string, language: string) {
  return new Intl.DateTimeFormat(language, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(time));
}

function getWindDirection(degrees: number, t: (key: string) => string) {
  const directions = [
    "weather.directions.north",
    "weather.directions.northEast",
    "weather.directions.east",
    "weather.directions.southEast",
    "weather.directions.south",
    "weather.directions.southWest",
    "weather.directions.west",
    "weather.directions.northWest",
  ];

  const index = Math.round(degrees / 45) % 8;

  return t(directions[index]);
}

export function CurrentWeather({
  weather,
  location,
  loading,
}: CurrentWeatherProps) {
  const { t, i18n } = useTranslation();

  const current = weather.current;

  const weatherDescription = getWeatherDescription(current.weather_code);

  return (
    <section className="current-weather">
      <div className="current-weather__header">
        <div>
          <div className="current-weather__location">
            <span>📍</span>
            <strong>{location.name}</strong>
            <span className="current-weather__country">
              {translateCountry(location.country_code, i18n.language)}
            </span>
          </div>

          <p className="current-weather__updated">
            {t("weather.updatedAt")} {formatTime(current.time, i18n.language)}
          </p>
        </div>

        <div className="current-weather__status">
          {loading ? t("weather.updating") : `● ${t("weather.currentData")}`}
        </div>
      </div>

      <div className="current-weather__main">
        <div className="current-weather__temperature">
          <span className="current-weather__icon">
            {weatherDescription.icon}
          </span>

          <div>
            <div className="current-weather__value">
              {Math.round(current.temperature_2m)}
              <span>°</span>
            </div>

            <div className="current-weather__condition">
              {t(`weather.conditions.${weatherDescription.key}`)}
            </div>
          </div>
        </div>

        <div className="current-weather__feels">
          <span>{t("weather.feelsLike")}</span>

          <strong>{Math.round(current.apparent_temperature)}°</strong>
        </div>
      </div>

      <div className="current-weather__stats">
        <div className="current-weather__stat">
          <div className="current-weather__stat-icon">💧</div>

          <div>
            <span>{t("weather.humidity")}</span>

            <strong>{Math.round(current.relative_humidity_2m)}%</strong>
          </div>
        </div>

        <div className="current-weather__stat">
          <div className="current-weather__stat-icon">💨</div>

          <div>
            <span>{t("weather.wind")}</span>

            <strong>
              {Math.round(current.wind_speed_10m)} {t("weather.windUnit")}
            </strong>
          </div>
        </div>

        <div className="current-weather__stat">
          <div className="current-weather__stat-icon">🧭</div>

          <div>
            <span>{t("weather.direction")}</span>

            <strong>{getWindDirection(current.wind_direction_10m, t)}</strong>
          </div>
        </div>

        <div className="current-weather__stat">
          <div className="current-weather__stat-icon">☁️</div>

          <div>
            <span>{t("weather.cloudiness")}</span>

            <strong>{Math.round(current.cloud_cover)}%</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
