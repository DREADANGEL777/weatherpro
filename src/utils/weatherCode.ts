export interface WeatherDescription {
  key: string;
  icon: string;
}

export function getWeatherDescription(
  code: number,
): WeatherDescription {
  switch (code) {
    case 0:
      return {
        key: "clear",
        icon: "☀️",
      };

    case 1:
      return {
        key: "mainlyClear",
        icon: "🌤️",
      };

    case 2:
      return {
        key: "partlyCloudy",
        icon: "⛅",
      };

    case 3:
      return {
        key: "overcast",
        icon: "☁️",
      };

    case 45:
    case 48:
      return {
        key: "fog",
        icon: "🌫️",
      };

    case 51:
    case 53:
    case 55:
      return {
        key: "drizzle",
        icon: "🌦️",
      };

    case 56:
    case 57:
      return {
        key: "freezingDrizzle",
        icon: "🌧️",
      };

    case 61:
    case 63:
    case 65:
      return {
        key: "rain",
        icon: "🌧️",
      };

    case 66:
    case 67:
      return {
        key: "freezingRain",
        icon: "🌧️",
      };

    case 71:
    case 73:
    case 75:
      return {
        key: "snow",
        icon: "🌨️",
      };

    case 77:
      return {
        key: "snowGrains",
        icon: "🌨️",
      };

    case 80:
    case 81:
    case 82:
      return {
        key: "rainShowers",
        icon: "🌦️",
      };

    case 85:
    case 86:
      return {
        key: "snowShowers",
        icon: "🌨️",
      };

    case 95:
      return {
        key: "thunderstorm",
        icon: "⛈️",
      };

    case 96:
    case 99:
      return {
        key: "thunderstormHail",
        icon: "⛈️",
      };

    default:
      return {
        key: "unknown",
        icon: "🌡️",
      };
  }
}