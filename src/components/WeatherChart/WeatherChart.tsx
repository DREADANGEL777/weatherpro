import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

function formatHour(time: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    hour: "2-digit",
  }).format(new Date(time));
}

function formatTooltipTime(time: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(time));
}

export function WeatherChart({ weather }: WeatherChartProps) {
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
        time: formatHour(time),
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
          <span className="weather-chart__eyebrow">HOURLY FORECAST</span>

          <h2 className="weather-chart__title">Погода по годинах</h2>
        </div>

        <div className="weather-chart__legend">
          <span className="weather-chart__legend-item">
            <i className="weather-chart__legend-dot" />
            Температура
          </span>

          <span className="weather-chart__legend-item">
            <i className="weather-chart__legend-dot weather-chart__legend-dot--secondary" />
            Відчувається
          </span>
        </div>
      </div>

      <div className="weather-chart__card">
        <div className="weather-chart__top">
          <div>
            <strong>Найближчі 24 години</strong>

            <span>Температура та відчуття на вулиці</span>
          </div>

          <div className="weather-chart__current">
            <span>Зараз</span>

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
                        {formatTooltipTime(point.fullTime)} {point.icon}
                      </div>

                      <div className="weather-chart__tooltip-row">
                        <span>Температура</span>

                        <strong>{point.temperature}°</strong>
                      </div>

                      <div className="weather-chart__tooltip-row">
                        <span>Відчувається</span>

                        <strong>{point.feelsLike}°</strong>
                      </div>

                      <div className="weather-chart__tooltip-row">
                        <span>Ймовірність опадів</span>

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
                dot={{
                  r: 3,
                  fill: "#ffffff",
                  stroke: "#3987ff",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#3987ff",
                  stroke: "#ffffff",
                  strokeWidth: 3,
                }}
                animationDuration={700}
              />

              <Line
                type="monotone"
                dataKey="feelsLike"
                stroke="#a9b9cb"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                animationDuration={700}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="weather-chart__precipitation">
          {data.map((point) => (
            <div
              className="weather-chart__precipitation-item"
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
