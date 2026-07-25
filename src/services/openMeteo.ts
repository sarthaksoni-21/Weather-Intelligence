import { CityResult, GeocodingResponse, OpenMeteoForecastResponse, UnitSystem } from '../types';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<CityResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  try {
    const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding service error (${response.status})`);
    }

    const data: GeocodingResponse = await response.json();
    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message || 'Failed to search city names.');
    }
    throw new Error('An unexpected error occurred while searching cities.');
  }
}

export async function getWeatherData(
  lat: number,
  lon: number,
  units: UnitSystem = 'metric'
): Promise<OpenMeteoForecastResponse> {
  try {
    const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
    const windUnit = units === 'imperial' ? 'mph' : 'kmh';
    const precipUnit = units === 'imperial' ? 'inch' : 'mm';

    const currentParams = [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(',');

    const hourlyParams = [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'pressure_msl',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'uv_index',
    ].join(',');

    const dailyParams = [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant',
    ].join(',');

    const url = new URL(FORECAST_BASE_URL);
    url.searchParams.append('latitude', lat.toString());
    url.searchParams.append('longitude', lon.toString());
    url.searchParams.append('current', currentParams);
    url.searchParams.append('hourly', hourlyParams);
    url.searchParams.append('daily', dailyParams);
    url.searchParams.append('timezone', 'auto');
    url.searchParams.append('temperature_unit', tempUnit);
    url.searchParams.append('wind_speed_unit', windUnit);
    url.searchParams.append('precipitation_unit', precipUnit);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Open-Meteo API returned error status: ${response.status}`);
    }

    const data: OpenMeteoForecastResponse = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message || 'Unable to fetch weather forecast.');
    }
    throw new Error('An unexpected network error occurred while fetching weather data.');
  }
}

// Popular default cities to display when launching or for quick selection
export const DEFAULT_CITIES: CityResult[] = [
  { id: 2643743, name: 'London', latitude: 51.50853, longitude: -0.12574, country: 'United Kingdom', country_code: 'GB' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.69171, country: 'Japan', country_code: 'JP' },
  { id: 5128581, name: 'New York', latitude: 40.71427, longitude: -74.00597, admin1: 'New York', country: 'United States', country_code: 'US' },
  { id: 2988507, name: 'Paris', latitude: 48.85341, longitude: 2.3488, country: 'France', country_code: 'FR' },
  { id: 2147714, name: 'Sydney', latitude: -33.86785, longitude: 151.20732, admin1: 'New South Wales', country: 'Australia', country_code: 'AU' },
  { id: 1275339, name: 'Mumbai', latitude: 19.07283, longitude: 72.88261, admin1: 'Maharashtra', country: 'India', country_code: 'IN' },
  { id: 5368361, name: 'Los Angeles', latitude: 34.05223, longitude: -118.24368, admin1: 'California', country: 'United States', country_code: 'US' },
];
