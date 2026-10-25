import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getWeather, searchLocation } from "../services/weatherApi";
import type { Location, WeatherResponse } from "../types/weather";

const DEFAULT_LOCATION: Location = {
  name: "Kyiv",
  latitude: 50.4501,
  longitude: 30.5234,
  country: "Ukraine",
  country_code: "UA",
  admin1: "Kyiv City",
};

export type GeolocationStatus =
  | "success"
  | "denied"
  | "unavailable"
  | "dismissed";

export function useWeather() {
  const { i18n } = useTranslation();

  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [geolocationStatus, setGeolocationStatus] =
    useState<GeolocationStatus>("dismissed");

  const loadWeather = useCallback(async (selectedLocation: Location) => {
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
      setError("Не вдалося отримати дані про погоду.");
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setLocations([]);
        return;
      }

      setSearchLoading(true);
      setError(null);

      try {
        const results = await searchLocation(query, i18n.language);
        setLocations(results);
      } catch {
        setError("Не вдалося знайти це місто.");
      } finally {
        setSearchLoading(false);
      }
    },
    [i18n.language],
  );

  const selectLocation = useCallback(
    async (selectedLocation: Location) => {
      setLocations([]);
      setGeolocationStatus("dismissed");
      await loadWeather(selectedLocation);
    },
    [loadWeather],
  );

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeolocationStatus("unavailable");
      void loadWeather(DEFAULT_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        let detectedLocation: Location = {
          name: "My location",
          latitude,
          longitude,
          country: "Unknown",
          country_code: "",
        };

        // Reverse geocoding: try to get a readable place name.
        try {
          const params = new URLSearchParams({
            lat: String(latitude),
            lon: String(longitude),
            format: "jsonv2",
            "accept-language": i18n.language || "en",
          });

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?${params}`,
          );

          if (response.ok) {
            const data = await response.json();
            const address = data.address ?? {};

            detectedLocation = {
              name:
                address.city ||
                address.town ||
                address.village ||
                address.municipality ||
                address.county ||
                "My location",
              latitude,
              longitude,
              country: address.country || "Unknown",
              country_code: (address.country_code || "").toUpperCase(),
              admin1:
                address.state ||
                address.region ||
                address.province ||
                undefined,
            };
          }
        } catch {
          // Reverse geocoding is optional; coordinates still work.
        }

        setGeolocationStatus("success");
        await loadWeather(detectedLocation);
      },
      (geoError) => {
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setGeolocationStatus("denied");
        } else {
          setGeolocationStatus("unavailable");
        }

        void loadWeather(DEFAULT_LOCATION);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }, [i18n.language, loadWeather]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const dismissGeolocationNotice = useCallback(() => {
    setGeolocationStatus("dismissed");
  }, []);

  const reload = useCallback(() => {
    void loadWeather(location);
  }, [loadWeather, location]);

  return {
    location,
    weather,
    locations,
    loading,
    searchLoading,
    error,
    search,
    selectLocation,
    reload,
    geolocationStatus,
    requestLocation,
    dismissGeolocationNotice,
  };
}
