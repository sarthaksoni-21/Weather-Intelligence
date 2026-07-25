import React, { useState, useEffect, useCallback } from 'react';
import { CityResult, OpenMeteoForecastResponse, UnitSystem } from './types';
import { DEFAULT_CITIES, getWeatherData } from './services/openMeteo';
import { Header } from './components/Header';
import { CurrentWeather } from './components/CurrentWeather';
import { WeatherRecommendations } from './components/WeatherRecommendations';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherDetailsGrid } from './components/WeatherDetailsGrid';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { getWeatherCondition } from './utils/wmoCodes';
import { WeatherIcon } from './components/WeatherIcon';

const RECENT_CITIES_KEY = 'open_meteo_recent_cities';
const UNITS_KEY = 'open_meteo_units';
const LAST_CITY_KEY = 'open_meteo_last_city';

export default function App() {
  // Unit System State
  const [units, setUnits] = useState<UnitSystem>(() => {
    const saved = localStorage.getItem(UNITS_KEY);
    return saved === 'imperial' ? 'imperial' : 'metric';
  });

  // Current City State
  const [currentCity, setCurrentCity] = useState<CityResult>(() => {
    const saved = localStorage.getItem(LAST_CITY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to London
      }
    }
    return DEFAULT_CITIES[0]; // London default
  });

  // Recent Cities State
  const [recentCities, setRecentCities] = useState<CityResult[]>(() => {
    const saved = localStorage.getItem(RECENT_CITIES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return DEFAULT_CITIES.slice(0, 4);
  });

  // Weather & Loading States
  const [weatherData, setWeatherData] = useState<OpenMeteoForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Geolocation States
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Save units to local storage
  const handleToggleUnits = (newUnits: UnitSystem) => {
    setUnits(newUnits);
    localStorage.setItem(UNITS_KEY, newUnits);
  };

  // Add to recent cities
  const addRecentCity = (city: CityResult) => {
    setRecentCities((prev) => {
      const filtered = prev.filter((c) => c.name.toLowerCase() !== city.name.toLowerCase());
      const updated = [city, ...filtered].slice(0, 5);
      localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Main weather fetch function
  const fetchWeather = useCallback(
    async (city: CityResult, currentUnits: UnitSystem) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getWeatherData(city.latitude, city.longitude, currentUnits);
        setWeatherData(data);
        setCurrentCity(city);
        localStorage.setItem(LAST_CITY_KEY, JSON.stringify(city));
        addRecentCity(city);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load weather data.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Fetch weather on city or unit change
  useEffect(() => {
    fetchWeather(currentCity, units);
  }, [currentCity, units, fetchWeather]);

  // Handle Geolocation lookup
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const myLocCity: CityResult = {
          id: 999999,
          name: 'Your Location',
          latitude,
          longitude,
          country: 'GPS Detected',
        };

        await fetchWeather(myLocCity, units);
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Location permission denied. Please enable location access or search manually.');
        } else {
          setGeoError('Unable to retrieve location.');
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleClearRecent = () => {
    setRecentCities([]);
    localStorage.removeItem(RECENT_CITIES_KEY);
  };

  // Ambient styling derived from current condition
  const condition = weatherData
    ? getWeatherCondition(weatherData.current.weather_code)
    : getWeatherCondition(0);

  const isDay = weatherData?.current.is_day ?? 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Dynamic Sky Atmosphere */}
      <div
        className={`fixed inset-0 bg-gradient-to-br ${
          isDay ? condition.bgGradientDay : condition.bgGradientNight
        } opacity-30 transition-all duration-1000 pointer-events-none z-0`}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Header Search & Navigation */}
        <Header
          currentCity={currentCity}
          onSelectCity={(city) => fetchWeather(city, units)}
          units={units}
          onToggleUnits={handleToggleUnits}
          recentCities={recentCities}
          onClearRecent={handleClearRecent}
          isLoading={isLoading}
          onGeolocation={handleGeolocation}
          geoLoading={geoLoading}
          geoError={geoError}
        />

        {/* Loading State */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          /* Error State */
          <ErrorMessage
            message={error}
            onRetry={() => fetchWeather(currentCity, units)}
            onSelectDefault={() => fetchWeather(DEFAULT_CITIES[0], units)}
          />
        ) : weatherData ? (
          /* Main Dashboard Content */
          <main className="space-y-8">
            
            {/* Hero Current Weather Card */}
            <CurrentWeather
              city={currentCity}
              current={weatherData.current}
              daily={weatherData.daily}
              units={units}
            />

            {/* Smart Recommendations */}
            <WeatherRecommendations
              current={weatherData.current}
              daily={weatherData.daily}
            />

            {/* Hourly Forecast Timeline & Chart */}
            <HourlyForecast
              hourly={weatherData.hourly}
              units={units}
            />

            {/* 7-Day Forecast */}
            <DailyForecast
              daily={weatherData.daily}
              units={units}
            />

            {/* Atmospheric Details Grid */}
            <WeatherDetailsGrid
              current={weatherData.current}
              daily={weatherData.daily}
              units={units}
            />

          </main>
        ) : null}

        {/* Footer */}
        <footer className="pt-8 pb-4 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-2">
          <p className="flex items-center justify-center gap-2">
            <span>Powered exclusively by</span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline font-semibold"
            >
              Open-Meteo Weather APIs
            </a>
            <span>(Free, open-source & no API keys required)</span>
          </p>
          <p>Features Geocoding API, 7-Day Forecast API, and Smart Recommendation Engine.</p>
        </footer>

      </div>
    </div>
  );
}
