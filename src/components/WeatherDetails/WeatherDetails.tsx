import type { WeatherResponse } from "../../types/weather";

import "./WeatherDetails.css";

interface WeatherDetailsProps {
  weather: WeatherResponse;
}

interface DetailItem {
  icon: string;
  label: string;
  value: string;
}

export function WeatherDetails({
  weather,
}: WeatherDetailsProps) {
  const current = weather.current;

  const details: DetailItem[] = [
    {
      icon: "🌡️",
      label: "Тиск",
      value: `${Math.round(current.pressure_msl)} гПа`,
    },
    {
      icon: "💨",
      label: "Пориви вітру",
      value: `${Math.round(current.wind_gusts_10m)} км/год`,
    },
    {
      icon: "🌧️",
      label: "Опади",
      value: `${current.precipitation.toFixed(1)} мм`,
    },
    {
      icon: "☔",
      label: "Дощ",
      value: `${current.rain.toFixed(1)} мм`,
    },
    {
      icon: "🌨️",
      label: "Сніг",
      value: `${current.snowfall.toFixed(1)} см`,
    },
    {
      icon: "🌦️",
      label: "Зливи",
      value: `${current.showers.toFixed(1)} мм`,
    },
    {
      icon: "🏔️",
      label: "Висота",
      value: `${Math.round(weather.elevation)} м`,
    },
    {
      icon: "🧭",
      label: "Напрямок вітру",
      value: `${Math.round(current.wind_direction_10m)}°`,
    },
  ];

  return (
    <section className="weather-details">
      <div className="weather-details__heading">
        <div>
          <span className="weather-details__eyebrow">
            WEATHER DATA
          </span>

          <h2 className="weather-details__title">
            Деталі погоди
          </h2>
        </div>

        <p className="weather-details__subtitle">
          Розширена інформація про поточні погодні
          умови
        </p>
      </div>

      <div className="weather-details__grid">
        {details.map((detail) => (
          <div
            className="weather-details__card"
            key={detail.label}
          >
            <div className="weather-details__icon">
              {detail.icon}
            </div>

            <div className="weather-details__content">
              <span>{detail.label}</span>

              <strong>{detail.value}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}