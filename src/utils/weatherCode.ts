export interface WeatherDescription {
  label: string;
  icon: string;
}

export function getWeatherDescription(
  code: number,
): WeatherDescription {
  switch (code) {
    case 0:
      return {
        label: "Ясно",
        icon: "☀️",
      };

    case 1:
      return {
        label: "Переважно ясно",
        icon: "🌤️",
      };

    case 2:
      return {
        label: "Мінлива хмарність",
        icon: "⛅",
      };

    case 3:
      return {
        label: "Похмуро",
        icon: "☁️",
      };

    case 45:
    case 48:
      return {
        label: "Туман",
        icon: "🌫️",
      };

    case 51:
    case 53:
    case 55:
      return {
        label: "Мряка",
        icon: "🌦️",
      };

    case 56:
    case 57:
      return {
        label: "Крижана мряка",
        icon: "🌧️",
      };

    case 61:
    case 63:
    case 65:
      return {
        label: "Дощ",
        icon: "🌧️",
      };

    case 66:
    case 67:
      return {
        label: "Крижаний дощ",
        icon: "🌧️",
      };

    case 71:
    case 73:
    case 75:
      return {
        label: "Сніг",
        icon: "🌨️",
      };

    case 77:
      return {
        label: "Снігові зерна",
        icon: "🌨️",
      };

    case 80:
    case 81:
    case 82:
      return {
        label: "Зливи",
        icon: "🌦️",
      };

    case 85:
    case 86:
      return {
        label: "Снігові зливи",
        icon: "🌨️",
      };

    case 95:
      return {
        label: "Гроза",
        icon: "⛈️",
      };

    case 96:
    case 99:
      return {
        label: "Гроза з градом",
        icon: "⛈️",
      };

    default:
      return {
        label: "Невідомо",
        icon: "🌡️",
      };
  }
}