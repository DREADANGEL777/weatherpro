import { useEffect, useState } from "react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useTranslation } from "react-i18next";

import type { WeatherResponse } from "../../types/weather";
import { getWeatherDescription } from "../../utils/weatherCode";

import "./WeatherChart.css";

interface WeatherChartProps {
  weather: WeatherResponse;
}

interface ChartPoint {
  time: string;
  fullTime: string;
  temperature: number;
  feelsLike: number;
  precipitation: number;
  precipitationProbability: number;
  icon: string;
}

function formatHour(time: string, language: string) {
  return new Intl.DateTimeFormat(language, {
    hour: "2-digit",
  }).format(new Date(time));
}

function formatTooltipTime(time: string, language: string) {
  return new Intl.DateTimeFormat(language, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(time));
}

export function WeatherChart({ weather }: WeatherChartProps) {
  const { t, i18n } = useTranslation();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = document.querySelector(".weather-chart");

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const hourly = weather.hourly;

  const currentTime = new Date(weather.current.time).getTime();

  const startIndex = hourly.time.findIndex(
    (time) => new Date(time).getTime() >= currentTime,
  );

  const firstIndex = startIndex >= 0 ? startIndex : 0;

  const data: ChartPoint[] = hourly.time
    .slice(firstIndex, firstIndex + 24)
    .map((time, index) => {
      const actualIndex = firstIndex + index;

      const weatherDescription = getWeatherDescription(
        hourly.weather_code[actualIndex],
      );

      return {
        time: formatHour(time, i18n.language),
        fullTime: time,
        temperature: Math.round(hourly.temperature_2m[actualIndex]),
        feelsLike: Math.round(hourly.apparent_temperature[actualIndex]),
        precipitation: hourly.precipitation[actualIndex],
        precipitationProbability: hourly.precipitation_probability[actualIndex],
        icon: weatherDescription.icon,
      };
    });

  return (
    <section className="weather-chart">
      <div className="weather-chart__heading">
        <div>
          <h2 className="weather-chart__title">{t("weatherChart.title")}</h2>
        </div>

        <div className="weather-chart__legend">
          <span className="weather-chart__legend-item">
            <i className="weather-chart__legend-dot" />
            {t("weatherChart.temperature")}
          </span>

          <span className="weather-chart__legend-item">
            <i className="weather-chart__legend-dot weather-chart__legend-dot--secondary" />
            {t("weatherChart.feelsLike")}
          </span>
        </div>
      </div>

      <div className="weather-chart__card">
        <div className="weather-chart__top">
          <div>
            <strong>{t("weatherChart.next24Hours")}</strong>
            <span>{t("weatherChart.temperatureDescription")}</span>
          </div>

          <div className="weather-chart__current">
            <span>{t("weatherChart.now")}</span>
            <strong>{Math.round(weather.current.temperature_2m)}°</strong>
          </div>
        </div>

        <div className="weather-chart__graph">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#edf2f7"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#8996a9",
                  fontSize: 11,
                }}
                interval={2}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={38}
                tick={{
                  fill: "#8996a9",
                  fontSize: 11,
                }}
                tickFormatter={(value) => `${value}°`}
              />

              <Tooltip
                cursor={{
                  stroke: "#cbdced",
                  strokeDasharray: "4 4",
                }}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null;
                  }

                  const point = payload[0]?.payload as ChartPoint;

                  return (
                    <div className="weather-chart__tooltip">
                      <div className="weather-chart__tooltip-time">
                        {formatTooltipTime(point.fullTime, i18n.language)}{" "}
                        {point.icon}
                      </div>

                      <div className="weather-chart__tooltip-row">
                        <span>{t("weatherChart.temperature")}</span>

                        <strong>{point.temperature}°</strong>
                      </div>

                      <div className="weather-chart__tooltip-row">
                        <span>{t("weatherChart.feelsLike")}</span>

                        <strong>{point.feelsLike}°</strong>
                      </div>

                      <div className="weather-chart__tooltip-row">
                        <span>
                          {t("weatherChart.precipitationProbability")}
                        </span>

                        <strong>{point.precipitationProbability}%</strong>
                      </div>
                    </div>
                  );
                }}
              />

              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#3987ff"
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy } = props;

                  if (cx === undefined || cy === undefined) {
                    return null;
                  }

                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      className={`weather-chart__point ${
                        isVisible ? "weather-chart__point--visible" : ""
                      }`}
                    />
                  );
                }}
                activeDot={{
                  r: 7,
                  fill: "#3987ff",
                  stroke: "#ffffff",
                  strokeWidth: 3,
                }}
                isAnimationActive={isVisible}
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              />

              <Line
                type="monotone"
                dataKey="feelsLike"
                stroke="#a9b9cb"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={(props) => {
                  const { cx, cy } = props;

                  if (cx === undefined || cy === undefined) {
                    return null;
                  }

                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={3}
                      className={`weather-chart__point weather-chart__point--secondary ${
                        isVisible ? "weather-chart__point--visible" : ""
                      }`}
                    />
                  );
                }}
                isAnimationActive={isVisible}
                animationBegin={150}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="weather-chart__precipitation">
          {data.map((point, index) => (
            <div
              className={`weather-chart__precipitation-item ${
                isVisible ? "weather-chart__precipitation-item--visible" : ""
              }`}
              style={
                {
                  "--delay": `${index * 40}ms`,
                } as React.CSSProperties
              }
              key={point.fullTime}
            >
              <span>{point.precipitationProbability > 0 ? "💧" : ""}</span>

              <strong>{point.precipitationProbability}%</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
