import { Header } from "../../components/Header/Header";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { CurrentWeather } from "../../components/CurrentWeather/CurrentWeather";
import { WeatherDetails } from "../../components/WeatherDetails/WeatherDetails";
import { Forecast } from "../../components/Forecast/Forecast";
import { WeatherChart } from "../../components/WeatherChart/WeatherChart";
import { PremiumCard } from "../../components/PremiumCard/PremiumCard";
import { useWeather } from "../../hooks/useWeather";

import "./Home.css";

export function Home() {
  const {
    location,
    weather,
    locations,
    loading,
    searchLoading,
    search,
    selectLocation,
  } = useWeather();

  return (
    <div className="home">
      <Header />

      <main className="home__main">
        <section className="home__hero">
          <div className="home__hero-content">
            <span className="home__eyebrow">YOUR PERSONAL WEATHER</span>

            <h1 className="home__title">
              Погода без
              <br />
              <span>зайвих складнощів</span>
            </h1>

            <p className="home__description">
              Отримуйте точні дані про погоду, температуру, вітер, вологість та
              інші важливі параметри в одному місці.
            </p>

            <SearchBar
              locations={locations}
              loading={loading}
              searchLoading={searchLoading}
              onSearch={search}
              onSelectLocation={selectLocation}
            />
          </div>
        </section>

        <section className="home__weather">
          {weather ? (
            <>
              <CurrentWeather
                weather={weather}
                location={location}
                loading={loading}
              />

              <WeatherDetails weather={weather} />

              <Forecast weather={weather} />

              <WeatherChart weather={weather} />

              <PremiumCard />
            </>
          ) : (
            <div className="home__weather-placeholder">
              <span>☀️</span>

              <h2>Завантажуємо погоду...</h2>

              <p>
                Дані про поточну погоду з'являться тут через декілька секунд.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
