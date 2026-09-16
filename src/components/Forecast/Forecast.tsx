import { useTranslation } from "react-i18next";

import type { WeatherResponse } from "../../types/weather";
import { getWeatherDescription } from "../../utils/weatherCode";

import "./Forecast.css";

interface ForecastProps {
  weather: WeatherResponse;
}

function formatDay(
  date: string,
  index: number,
  language: string,
  todayLabel: string,
  tomorrowLabel: string,
) {
  if (index === 0) {
    return todayLabel;
  }

  if (index === 1) {
    return tomorrowLabel;
  }

  return new Intl.DateTimeFormat(language, {
    weekday: "short",
  })
    .format(new Date(`${date}T12:00:00`))
    .replace(".", "");
}

function formatDate(date: string, language: string) {
  return new Intl.DateTimeFormat(language, {
    day: "numeric",
    month: "short",
  })
    .format(new Date(`${date}T12:00:00`))
    .replace(".", "");
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

export function Forecast({ weather }: ForecastProps) {
  const { t, i18n } = useTranslation();

  const daily = weather.daily;

  return (
    <section className="forecast">
      <div className="forecast__heading">
        <div>
          <span className="forecast__eyebrow">{t("forecast.eyebrow")}</span>

          <h2 className="forecast__title">{t("forecast.title")}</h2>
        </div>

        <p className="forecast__subtitle">{t("forecast.subtitle")}</p>
      </div>

      <div className="forecast__list">
        {daily.time.map((date, index) => {
          const weatherDescription = getWeatherDescription(
            daily.weather_code[index],
          );

          return (
            <article
              className={`forecast__day ${
                index === 0 ? "forecast__day--today" : ""
              }`}
              key={date}
            >
              <div className="forecast__date">
                <strong>
                  {formatDay(
                    date,
                    index,
                    i18n.language,
                    t("forecast.today"),
                    t("forecast.tomorrow"),
                  )}
                </strong>

                <span>{formatDate(date, i18n.language)}</span>
              </div>

              <div className="forecast__weather">
                <span className="forecast__icon">
                  {weatherDescription.icon}
                </span>

                <span className="forecast__condition">
                  {t(`weather.conditions.${weatherDescription.key}`)}
                </span>
              </div>

              <div className="forecast__temperature">
                <strong>{Math.round(daily.temperature_2m_max[index])}°</strong>

                <span>{Math.round(daily.temperature_2m_min[index])}°</span>
              </div>

              <div className="forecast__precipitation">
                <span>💧</span>

                <strong>{daily.precipitation_probability_max[index]}%</strong>

                <small>{t("forecast.precipitation")}</small>
              </div>

              <div className="forecast__wind">
                <span>💨</span>

                <div>
                  <strong>
                    {Math.round(daily.wind_speed_10m_max[index])}{" "}
                    {t("weather.units.wind")}
                  </strong>

                  <small>
                    {getWindDirection(
                      daily.wind_direction_10m_dominant[index],
                      t,
                    )}
                  </small>
                </div>
              </div>

              <div className="forecast__arrow">→</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
