import React, { useState, useEffect, useRef } from 'react';
import { CityResult, UnitSystem } from '../types';
import { searchCities, DEFAULT_CITIES } from '../services/openMeteo';
import { WeatherIcon } from './WeatherIcon';

interface HeaderProps {
  currentCity: CityResult;
  onSelectCity: (city: CityResult) => void;
  units: UnitSystem;
  onToggleUnits: (units: UnitSystem) => void;
  recentCities: CityResult[];
  onClearRecent: () => void;
  isLoading: boolean;
  onGeolocation: () => void;
  geoLoading: boolean;
  geoError?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  units,
  onToggleUnits,
  recentCities,
  isLoading,
  onGeolocation,
  geoLoading,
  geoError,
}) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced geocoding search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const results = await searchCities(query);
        setSearchResults(results);
        setShowDropdown(true);
        if (results.length === 0) {
          setSearchError(`No city matching "${query}" found. Check spelling or country.`);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setSearchError(err.message);
        } else {
          setSearchError('Search failed');
        }
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityResult) => {
    onSelectCity(city);
    setQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  const getCityLocationString = (city: CityResult) => {
    const parts = [city.name];
    if (city.admin1 && city.admin1 !== city.name) parts.push(city.admin1);
    if (city.country) parts.push(city.country);
    return parts.join(', ');
  };

  return (
    <header className="relative z-30 w-full mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl">
        
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <WeatherIcon name="Sun" className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              OpenMeteo Sky
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-medium">
                Live Forecast
              </span>
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              <WeatherIcon name="MapPin" className="w-3.5 h-3.5 text-sky-400" />
              <span>{getCityLocationString(currentCity)}</span>
            </p>
          </div>
        </div>

        {/* Search Bar & Actions */}
        <div className="flex-1 max-w-xl relative" ref={searchContainerRef}>
          <div className="relative flex items-center">
            <WeatherIcon name="Search" className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search city, e.g. London, Tokyo, New York..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-inner"
            />

            {/* In-input indicator / Location button */}
            <div className="absolute right-2 flex items-center gap-1">
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mr-2" />
              ) : query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors text-xs"
                  title="Clear input"
                >
                  ✕
                </button>
              ) : null}

              <button
                type="button"
                onClick={onGeolocation}
                disabled={geoLoading}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 text-xs font-medium transition-all active:scale-95 disabled:opacity-50"
                title="Use my location"
              >
                {geoLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-sky-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <WeatherIcon name="Navigation" className="w-3.5 h-3.5 text-sky-400" />
                )}
                <span className="hidden sm:inline">GPS</span>
              </button>
            </div>
          </div>

          {/* Geo error banner if any */}
          {geoError && (
            <p className="text-xs text-rose-300 mt-1 pl-2 flex items-center gap-1">
              <WeatherIcon name="AlertTriangle" className="w-3.5 h-3.5" />
              {geoError}
            </p>
          )}

          {/* Search Dropdown Results */}
          {showDropdown && (query.trim().length >= 2 || recentCities.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50 divide-y divide-slate-800">
              
              {/* Dynamic Search Results */}
              {query.trim().length >= 2 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    City Search Results
                  </div>
                  {searchResults.length > 0 ? (
                    searchResults.map((city) => (
                      <button
                        key={`${city.id}-${city.latitude}-${city.longitude}`}
                        type="button"
                        onClick={() => handleSelect(city)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-500/20 hover:text-white text-slate-200 transition-colors flex items-center justify-between group text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <WeatherIcon name="MapPin" className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                          <span className="font-medium text-white">{city.name}</span>
                          <span className="text-xs text-slate-400">
                            {[city.admin1, city.country].filter(Boolean).join(', ')}
                          </span>
                        </div>
                        {city.country_code && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {city.country_code}
                          </span>
                        )}
                      </button>
                    ))
                  ) : !isSearching ? (
                    <div className="px-3 py-3 text-xs text-slate-400 text-center">
                      {searchError || 'No cities found. Try another city name.'}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Recent Searches */}
              {recentCities.length > 0 && !query.trim() && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Recent Searches</span>
                  </div>
                  {recentCities.map((city) => (
                    <button
                      key={`recent-${city.id}-${city.latitude}`}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 transition-colors flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <WeatherIcon name="Clock" className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-200">{city.name}</span>
                        <span className="text-xs text-slate-400">{city.country}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Unit Toggle (°C / °F) */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => onToggleUnits('metric')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                units === 'metric'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °C, km/h
            </button>
            <button
              type="button"
              onClick={() => onToggleUnits('imperial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                units === 'imperial'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °F, mph
            </button>
          </div>
        </div>
      </div>

      {/* Popular City Quick-Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar">
        <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <WeatherIcon name="Sparkles" className="w-3 h-3 text-sky-400" />
          Popular:
        </span>
        {DEFAULT_CITIES.map((city) => {
          const isSelected = currentCity.name === city.name;
          return (
            <button
              key={`popular-${city.name}`}
              type="button"
              onClick={() => handleSelect(city)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all border ${
                isSelected
                  ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </header>
  );
};
