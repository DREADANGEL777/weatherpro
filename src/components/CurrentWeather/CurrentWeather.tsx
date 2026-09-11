import type { Location, WeatherResponse } from "../../types/weather";
import { getWeatherDescription } from "../../utils/weatherCode";

import "./CurrentWeather.css";

interface CurrentWeatherProps {
  weather: WeatherResponse;
  location: Location;
  loading: boolean;
}

function formatTime(time: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(time));
}

function getWindDirection(degrees: number) {
  const directions = [
    "Пн",
    "Пн-Сх",
    "Сх",
    "Пд-Сх",
    "Пд",
    "Пд-Зх",
    "Зх",
    "Пн-Зх",
  ];

  const index = Math.round(degrees / 45) % 8;

  return directions[index];
}

export function CurrentWeather({
  weather,
  location,
  loading,
}: CurrentWeatherProps) {
  const current = weather.current;

  const weatherDescription = getWeatherDescription(
    current.weather_code,
  );

  return (
    <section className="current-weather">
      <div className="current-weather__header">
        <div>
          <div className="current-weather__location">
            <span>📍</span>

            <strong>{location.name}</strong>

            <span className="current-weather__country">
              {location.country}
            </span>
          </div>

          <p className="current-weather__updated">
            Оновлено о {formatTime(current.time)}
          </p>
        </div>

        <div className="current-weather__status">
          {loading ? "Оновлення..." : "● Дані актуальні"}
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
              {weatherDescription.label}
            </div>
          </div>
        </div>

        <div className="current-weather__feels">
          <span>Відчувається як</span>

          <strong>
            {Math.round(current.apparent_temperature)}°
          </strong>
        </div>
      </div>

      <div className="current-weather__stats">
        <div className="current-weather__stat">
          <div className="current-weather__stat-icon">
            💧
          </div>

          <div>
            <span>Вологість</span>
            <strong>
              {Math.round(current.relative_humidity_2m)}%
            </strong>
          </div>
        </div>

        <div className="current-weather__stat">
          <div className="current-weather__stat-icon">
            💨
          </div>

          <div>
            <span>Вітер</span>
            <strong>
              {Math.round(current.wind_speed_10m)} км/год
            </strong>
          </div>
        </div>

        <div className="current-weather__stat">
          <div className="current-weather__stat-icon">
            🧭
          </div>

          <div>
            <span>Напрямок</span>
            <strong>
              {getWindDirection(
                current.wind_direction_10m,
              )}
            </strong>
          </div>
        </div>

        <div className="current-weather__stat">
          <div className="current-weather__stat-icon">
            ☁️
          </div>

          <div>
            <span>Хмарність</span>
            <strong>
              {Math.round(current.cloud_cover)}%
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}