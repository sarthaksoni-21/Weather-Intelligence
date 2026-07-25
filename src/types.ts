export type UnitSystem = 'metric' | 'imperial';

export interface CityResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string; // State/Province
  admin2?: string;
  country?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: CityResult[];
  generationtime_ms?: number;
}

export interface CurrentWeatherData {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  pressure_msl: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  uv_index: number[];
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: CurrentWeatherData;
  hourly_units: Record<string, string>;
  hourly: HourlyWeatherData;
  daily_units: Record<string, string>;
  daily: DailyWeatherData;
}

export interface WeatherConditionInfo {
  label: string;
  description: string;
  iconName: string; // Lucide icon key
  bgGradientDay: string;
  bgGradientNight: string;
  cardTheme: string;
  textColor: string;
  isRainy: boolean;
  isSnowy: boolean;
  isSevere: boolean;
}

export interface RecommendationCategory {
  title: string;
  icon: string;
  badge: string;
  badgeColor: string;
  advice: string;
  details: string[];
}
