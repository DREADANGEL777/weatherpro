import { useState } from "react";

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
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSearch(query);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    setQuery(value);

    if (!value.trim()) {
      onSearch("");
    }
  };

  return (
    <div className="search">
      <form
        className="search__form"
        onSubmit={handleSubmit}
      >
        <span className="search__icon">⌕</span>

        <input
          className="search__input"
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Пошук міста..."
          autoComplete="off"
        />

        {searchLoading && (
          <span className="search__loading">
            ...
          </span>
        )}

        <button
          className="search__button"
          type="submit"
          disabled={loading || !query.trim()}
        >
          Знайти
        </button>
      </form>

      {locations.length > 0 && (
        <div className="search__results">
          {locations.map((location) => (
            <button
              key={`${location.latitude}-${location.longitude}-${location.name}`}
              type="button"
              className="search__result"
              onClick={() => {
                onSelectLocation(location);
                setQuery("");
              }}
            >
              <span className="search__result-icon">
                📍
              </span>

              <span className="search__result-content">
                <strong>{location.name}</strong>

                <small>
                  {location.admin1
                    ? `${location.admin1}, `
                    : ""}
                  {location.country}
                </small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}