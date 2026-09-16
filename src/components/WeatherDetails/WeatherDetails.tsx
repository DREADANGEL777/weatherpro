import { useTranslation } from "react-i18next";

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

export function WeatherDetails({ weather }: WeatherDetailsProps) {
  const { t } = useTranslation();

  const current = weather.current;

  const details: DetailItem[] = [
    {
      icon: "🌡️",
      label: t("weather.details.pressure"),
      value: `${Math.round(current.pressure_msl)} ${t("weather.units.hpa")}`,
    },
    {
      icon: "💨",
      label: t("weather.details.gusts"),
      value: `${Math.round(current.wind_gusts_10m)} ${t("weather.units.wind")}`,
    },
    {
      icon: "🌧️",
      label: t("weather.details.precipitation"),
      value: `${current.precipitation.toFixed(1)} ${t("weather.units.mm")}`,
    },
    {
      icon: "☔",
      label: t("weather.details.rain"),
      value: `${current.rain.toFixed(1)} ${t("weather.units.mm")}`,
    },
    {
      icon: "🌨️",
      label: t("weather.details.snow"),
      value: `${current.snowfall.toFixed(1)} ${t("weather.units.cm")}`,
    },
    {
      icon: "🌦️",
      label: t("weather.details.showers"),
      value: `${current.showers.toFixed(1)} ${t("weather.units.mm")}`,
    },
    {
      icon: "🏔️",
      label: t("weather.details.elevation"),
      value: `${Math.round(weather.elevation)} ${t("weather.units.m")}`,
    },
    {
      icon: "🧭",
      label: t("weather.details.windDirection"),
      value: `${Math.round(current.wind_direction_10m)}°`,
    },
  ];

  return (
    <section className="weather-details">
      <div className="weather-details__heading">
        <div>
          <span className="weather-details__eyebrow">
            {t("weather.details.eyebrow")}
          </span>

          <h2 className="weather-details__title">
            {t("weather.details.title")}
          </h2>
        </div>

        <p className="weather-details__subtitle">
          {t("weather.details.subtitle")}
        </p>
      </div>

      <div className="weather-details__grid">
        {details.map((detail) => (
          <div className="weather-details__card" key={detail.label}>
            <div className="weather-details__icon">{detail.icon}</div>

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
