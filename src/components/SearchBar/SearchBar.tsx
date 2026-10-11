import { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import type { Location } from "../../types/weather";

import "./SearchBar.css";

interface SearchBarProps {
  locations: Location[];
  loading: boolean;
  searchLoading: boolean;
  onSearch: (query: string) => void;
  onSelectLocation: (location: Location) => void;
}

export function SearchBar({
  locations,
  loading,
  searchLoading,
  onSearch,
  onSelectLocation,
}: SearchBarProps) {
  const { t } = useTranslation();

  const [query, setQuery] = useState("");

  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    onSearch(query);
    setIsFocused(true);
  };

  const handleSelect = (location: Location) => {
    onSelectLocation(location);
    setQuery(location.name);
    setIsFocused(false);
  };

  const showDropdown = isFocused && query.trim().length > 0 && !loading;

  return (
    <div className="search-bar" ref={containerRef}>
      <form className="search-bar__form" onSubmit={handleSubmit}>
        <div className="search-bar__input-wrapper">
          <span className="search-bar__icon">🔍</span>

          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsFocused(true);
            }}
            onFocus={() => setIsFocused(true)}
            placeholder={t("search.placeholder")}
            className="search-bar__input"
            autoComplete="off"
          />

          {searchLoading && <span className="search-bar__loader">⏳</span>}
        </div>

        <button
          type="submit"
          className="search-bar__button"
          disabled={searchLoading || !query.trim()}
        >
          {searchLoading ? t("search.searching") : t("search.button")}
        </button>
      </form>

      {showDropdown && (
        <div className="search-bar__dropdown">
          {locations.length > 0
            ? locations.map((location) => (
                <button
                  type="button"
                  key={`${location.latitude}-${location.longitude}-${location.name}`}
                  className="search-bar__result"
                  onClick={() => handleSelect(location)}
                >
                  <span className="search-bar__result-icon">📍</span>

                  <span className="search-bar__result-content">
                    <strong>{location.name}</strong>

                    <small>
                      {location.admin1 ? `${location.admin1}, ` : ""}
                      {location.country}
                    </small>
                  </span>
                </button>
              ))
            : !searchLoading && (
                <div className="search-bar__empty">{t("search.noResults")}</div>
              )}
        </div>
      )}
    </div>
  );
}
