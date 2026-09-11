import type { WeatherResponse } from "../../types/weather";
import { getWeatherDescription } from "../../utils/weatherCode";

import "./Forecast.css";

interface ForecastProps {
  weather: WeatherResponse;
}

function formatDay(date: string, index: number) {
  if (index === 0) {
    return "Сьогодні";
  }

  if (index === 1) {
    return "Завтра";
  }

  return new Intl.DateTimeFormat("uk-UA", {
    weekday: "short",
  })
    .format(new Date(`${date}T12:00:00`))
    .replace(".", "");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "short",
  })
    .format(new Date(`${date}T12:00:00`))
    .replace(".", "");
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

export function Forecast({
  weather,
}: ForecastProps) {
  const daily = weather.daily;

  return (
    <section className="forecast">
      <div className="forecast__heading">
        <div>
          <span className="forecast__eyebrow">
            7 DAY FORECAST
          </span>

          <h2 className="forecast__title">
            Прогноз на 7 днів
          </h2>
        </div>

        <p className="forecast__subtitle">
          Детальний прогноз погоди на найближчий тиждень
        </p>
      </div>

      <div className="forecast__list">
        {daily.time.map((date, index) => {
          const weatherDescription =
            getWeatherDescription(
              daily.weather_code[index],
            );

          return (
            <article
              className={`forecast__day ${
                index === 0
                  ? "forecast__day--today"
                  : ""
              }`}
              key={date}
            >
              <div className="forecast__date">
                <strong>
                  {formatDay(date, index)}
                </strong>

                <span>
                  {formatDate(date)}
                </span>
              </div>

              <div className="forecast__weather">
                <span className="forecast__icon">
                  {weatherDescription.icon}
                </span>

                <span className="forecast__condition">
                  {weatherDescription.label}
                </span>
              </div>

              <div className="forecast__temperature">
                <strong>
                  {Math.round(
                    daily.temperature_2m_max[index],
                  )}
                  °
                </strong>

                <span>
                  {Math.round(
                    daily.temperature_2m_min[index],
                  )}
                  °
                </span>
              </div>

              <div className="forecast__precipitation">
                <span>💧</span>

                <strong>
                  {
                    daily
                      .precipitation_probability_max[
                      index
                    ]
                  }
                  %
                </strong>

                <small>опадів</small>
              </div>

              <div className="forecast__wind">
                <span>💨</span>

                <div>
                  <strong>
                    {Math.round(
                      daily.wind_speed_10m_max[index],
                    )}{" "}
                    км/год
                  </strong>

                  <small>
                    {getWindDirection(
                      daily
                        .wind_direction_10m_dominant[
                        index
                      ],
                    )}
                  </small>
                </div>
              </div>

              <div className="forecast__arrow">
                →
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}