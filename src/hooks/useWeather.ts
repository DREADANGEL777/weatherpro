import { useCallback, useEffect, useState } from "react";

import {
  getWeather,
  searchLocation,
} from "../services/weatherApi";

import type {
  Location,
  WeatherResponse,
} from "../types/weather";

const DEFAULT_LOCATION: Location = {
  name: "Ternopil",
  latitude: 49.5535,
  longitude: 25.5948,
  country: "Ukraine",
  country_code: "UA",
  admin1: "Ternopil Oblast",
};

export function useWeather() {
  const [location, setLocation] =
    useState<Location>(DEFAULT_LOCATION);

  const [weather, setWeather] =
    useState<WeatherResponse | null>(null);

  const [locations, setLocations] =
    useState<Location[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadWeather = useCallback(
    async (selectedLocation: Location) => {
      setLoading(true);
      setError(null);

      try {
        const data = await getWeather(
          selectedLocation.latitude,
          selectedLocation.longitude,
        );

        setWeather(data);
        setLocation(selectedLocation);
      } catch {
        setError(
          "Не вдалося отримати дані про погоду.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setLocations([]);
        return;
      }

      setSearchLoading(true);
      setError(null);

      try {
        const results = await searchLocation(query);

        setLocations(results);
      } catch {
        setError(
          "Не вдалося знайти це місто.",
        );
      } finally {
        setSearchLoading(false);
      }
    },
    [],
  );

  const selectLocation = useCallback(
    async (selectedLocation: Location) => {
      setLocations([]);
      await loadWeather(selectedLocation);
    },
    [loadWeather],
  );

  useEffect(() => {
    loadWeather(DEFAULT_LOCATION);
  }, [loadWeather]);

  return {
    location,
    weather,
    locations,
    loading,
    searchLoading,
    error,
    search,
    selectLocation,
    reload: () => loadWeather(location),
  };
}