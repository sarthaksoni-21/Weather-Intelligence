import React from 'react';
import { CityResult, CurrentWeatherData, DailyWeatherData, UnitSystem } from '../types';
import { getWeatherCondition } from '../utils/wmoCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  city: CityResult;
  current: CurrentWeatherData;
  daily?: DailyWeatherData;
  units: UnitSystem;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  city,
  current,
  daily,
  units,
}) => {
  const condition = getWeatherCondition(current.weather_code);
  const tempUnitLabel = units === 'imperial' ? '°F' : '°C';
  const speedUnitLabel = units === 'imperial' ? 'mph' : 'km/h';

  // Get today's high and low
  const maxTemp = daily?.temperature_2m_max?.[0] !== undefined ? Math.round(daily.temperature_2m_max[0]) : null;
  const minTemp = daily?.temperature_2m_min?.[0] !== undefined ? Math.round(daily.temperature_2m_min[0]) : null;
  const uvMax = daily?.uv_index_max?.[0] !== undefined ? daily.uv_index_max[0] : null;

  // Format current local time from API or current date
  const nowFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-2xl text-white">
      
      {/* Background ambient gradient glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${current.is_day ? condition.bgGradientDay : condition.bgGradientNight} opacity-20 blur-3xl pointer-events-none`} />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        
        {/* Left Side: Temperature & Main Status */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-sky-200">
              Current Conditions
            </span>
            <span className="text-xs text-slate-300">{nowFormatted}</span>
          </div>

          <div className="flex items-baseline gap-4">
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight font-mono drop-shadow-md">
              {Math.round(current.temperature_2m)}
              <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-sky-200 font-sans">
                {tempUnitLabel}
              </span>
            </h2>

            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                {condition.label}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xs">
                {condition.description}
              </p>
            </div>
          </div>

          {/* High / Low & Feels Like */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <WeatherIcon name="Thermometer" className="w-4 h-4 text-sky-400" />
              <span className="text-slate-400">Feels like:</span>
              <span className="text-white font-bold">{Math.round(current.apparent_temperature)}{tempUnitLabel}</span>
            </div>

            {maxTemp !== null && minTemp !== null && (
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-rose-400 flex items-center gap-1">
                  <WeatherIcon name="ArrowUp" className="w-3.5 h-3.5" />
                  H: {maxTemp}{tempUnitLabel}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-sky-400 flex items-center gap-1">
                  <WeatherIcon name="ArrowDown" className="w-3.5 h-3.5" />
                  L: {minTemp}{tempUnitLabel}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Big Weather Icon Visual */}
        <div className="flex items-center justify-center lg:justify-end">
          <div className="relative group">
            <div className="absolute -inset-4 rounded-full bg-sky-500/20 blur-2xl group-hover:bg-sky-400/30 transition-all duration-500" />
            <div className="relative p-6 rounded-3xl bg-slate-800/40 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center text-center">
              <WeatherIcon
                code={current.weather_code}
                isDay={current.is_day}
                className={`w-28 h-28 sm:w-36 sm:h-36 ${condition.textColor} drop-shadow-xl transition-transform duration-300 hover:scale-105`}
              />
              <span className="mt-2 text-xs font-semibold text-slate-300 tracking-wider">
                WMO Code {current.weather_code}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-slate-800/80">
        
        {/* Humidity */}
        <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Humidity</span>
            <WeatherIcon name="Droplets" className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-xl font-bold text-white mt-2 font-mono">
            {current.relative_humidity_2m}%
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {current.relative_humidity_2m > 70 ? 'High moisture' : current.relative_humidity_2m < 30 ? 'Dry air' : 'Optimal'}
          </span>
        </div>

        {/* Wind Speed */}
        <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Wind Speed</span>
            <WeatherIcon name="Wind" className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-white mt-2 font-mono">
            {Math.round(current.wind_speed_10m)} <span className="text-xs text-slate-400">{speedUnitLabel}</span>
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5">
            Gusts to {Math.round(current.wind_gusts_10m)} {speedUnitLabel}
          </span>
        </div>

        {/* UV Index */}
        <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Max UV Index</span>
            <WeatherIcon name="Sun" className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white mt-2 font-mono">
            {uvMax !== null ? uvMax.toFixed(1) : '—'}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {uvMax !== null && uvMax >= 6 ? 'High (protection required)' : 'Low to Moderate'}
          </span>
        </div>

        {/* Air Pressure */}
        <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Pressure</span>
            <WeatherIcon name="Gauge" className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-white mt-2 font-mono">
            {Math.round(current.pressure_msl)} <span className="text-xs text-slate-400">hPa</span>
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {current.pressure_msl > 1013 ? 'High pressure' : 'Low pressure'}
          </span>
        </div>

        {/* Cloud Cover */}
        <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Cloud Cover</span>
            <WeatherIcon name="Cloud" className="w-4 h-4 text-blue-300" />
          </div>
          <p className="text-xl font-bold text-white mt-2 font-mono">
            {current.cloud_cover}%
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {current.cloud_cover > 80 ? 'Overcast skies' : current.cloud_cover > 30 ? 'Scattered' : 'Clear'}
          </span>
        </div>

        {/* Precipitation */}
        <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Precipitation</span>
            <WeatherIcon name="CloudRain" className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl font-bold text-white mt-2 font-mono">
            {current.precipitation} <span className="text-xs text-slate-400">{units === 'imperial' ? 'in' : 'mm'}</span>
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {current.precipitation > 0 ? 'Active rain/snow' : 'Dry currently'}
          </span>
        </div>

      </div>
    </div>
  );
};
