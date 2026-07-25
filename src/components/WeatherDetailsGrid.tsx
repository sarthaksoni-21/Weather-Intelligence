import React from 'react';
import { CurrentWeatherData, DailyWeatherData, UnitSystem } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface WeatherDetailsGridProps {
  current: CurrentWeatherData;
  daily?: DailyWeatherData;
  units: UnitSystem;
}

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({
  current,
  daily,
  units,
}) => {
  const speedUnitLabel = units === 'imperial' ? 'mph' : 'km/h';
  const windDir = current.wind_direction_10m;
  const humidity = current.relative_humidity_2m;
  const dewPoint = current.dew_point_2m ?? (current.temperature_2m - (100 - humidity) / 5);

  const uvMax = daily?.uv_index_max?.[0] ?? 0;
  const sunriseStr = daily?.sunrise?.[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '06:00 AM';
  const sunsetStr = daily?.sunset?.[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '07:30 PM';

  // Helper for wind compass direction
  const getWindDirectionLabel = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  // Helper for UV level category
  const getUvCategory = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-400', barColor: 'bg-emerald-400' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-400', barColor: 'bg-amber-400' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-400', barColor: 'bg-orange-400' };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-400', barColor: 'bg-rose-400' };
    return { text: 'Extreme', color: 'text-purple-400', barColor: 'bg-purple-500' };
  };

  const uvInfo = getUvCategory(uvMax);

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
        <WeatherIcon name="Activity" className="w-5 h-5 text-sky-400" />
        Atmospheric Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Wind Direction & Compass */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <WeatherIcon name="Wind" className="w-4 h-4 text-emerald-400" />
              Wind Status & Direction
            </span>
            <span className="text-emerald-300 font-bold">{getWindDirectionLabel(windDir)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-white font-mono">
                {Math.round(current.wind_speed_10m)}{' '}
                <span className="text-xs font-sans text-slate-400 font-normal">{speedUnitLabel}</span>
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Gusts up to {Math.round(current.wind_gusts_10m)} {speedUnitLabel}
              </p>
            </div>

            {/* Rotating Wind Needle Compass */}
            <div className="relative w-16 h-16 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center">
              <span className="absolute top-1 text-[9px] font-bold text-slate-400">N</span>
              <span className="absolute bottom-1 text-[9px] font-bold text-slate-400">S</span>
              <span className="absolute left-1 text-[9px] font-bold text-slate-400">W</span>
              <span className="absolute right-1 text-[9px] font-bold text-slate-400">E</span>
              <div
                className="w-1 h-8 bg-gradient-to-t from-emerald-500 to-sky-400 rounded-full transition-transform duration-700"
                style={{ transform: `rotate(${windDir}deg)` }}
              />
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
            Dominant blowing direction: <strong className="text-white">{windDir}° ({getWindDirectionLabel(windDir)})</strong>
          </div>
        </div>

        {/* Card 2: UV Index Gauge */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <WeatherIcon name="Sun" className="w-4 h-4 text-amber-400" />
              UV Exposure Meter
            </span>
            <span className={`font-bold ${uvInfo.color}`}>{uvInfo.text}</span>
          </div>

          <div>
            <p className="text-3xl font-black text-white font-mono">
              {uvMax.toFixed(1)}{' '}
              <span className="text-xs font-sans text-slate-400 font-normal">/ 12</span>
            </p>

            {/* Meter Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mt-3 p-0.5 border border-slate-700">
              <div
                className={`h-full rounded-full transition-all duration-500 ${uvInfo.barColor}`}
                style={{ width: `${Math.min(100, (uvMax / 12) * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
            {uvMax >= 6
              ? 'Protection required. Seek shade during midday.'
              : 'Low risk of sun damage under current sky.'}
          </div>
        </div>

        {/* Card 3: Humidity & Dew Point */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <WeatherIcon name="Droplets" className="w-4 h-4 text-sky-400" />
              Humidity & Dew Point
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-slate-400">Relative Humidity</span>
              <p className="text-2xl font-bold text-white font-mono mt-0.5">{humidity}%</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Dew Point</span>
              <p className="text-2xl font-bold text-white font-mono mt-0.5">
                {Math.round(dewPoint)}°
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
            {humidity > 70
              ? 'High humidity creates a muggy feeling.'
              : humidity < 30
              ? 'Dry air; moisturizer recommended.'
              : 'Comfortable humidity level.'}
          </div>
        </div>

        {/* Card 4: Sunrise & Sunset */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <WeatherIcon name="Sunrise" className="w-4 h-4 text-amber-300" />
              Sun Schedule
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <WeatherIcon name="Sunrise" className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Sunrise</span>
                <span className="text-sm font-bold text-white font-mono">{sunriseStr}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <WeatherIcon name="Sunset" className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Sunset</span>
                <span className="text-sm font-bold text-white font-mono">{sunsetStr}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
            Sun alignment calculated for location timezone.
          </div>
        </div>

        {/* Card 5: Barometric Pressure */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <WeatherIcon name="Gauge" className="w-4 h-4 text-purple-400" />
              Barometric Pressure
            </span>
          </div>

          <div>
            <p className="text-3xl font-black text-white font-mono">
              {Math.round(current.pressure_msl)}{' '}
              <span className="text-xs font-sans text-slate-400 font-normal">hPa</span>
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Surface pressure: {Math.round(current.surface_pressure)} hPa
            </p>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
            {current.pressure_msl >= 1013
              ? 'Stable high-pressure atmosphere.'
              : 'Low pressure system — cloud development likely.'}
          </div>
        </div>

        {/* Card 6: Cloud Coverage & Sky State */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <WeatherIcon name="Cloud" className="w-4 h-4 text-sky-300" />
              Cloud Coverage
            </span>
          </div>

          <div>
            <p className="text-3xl font-black text-white font-mono">{current.cloud_cover}%</p>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mt-3 p-0.5 border border-slate-700">
              <div
                className="h-full bg-sky-400 rounded-full transition-all duration-500"
                style={{ width: `${current.cloud_cover}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
            {current.cloud_cover > 80
              ? 'Heavy cloud blanket over city.'
              : current.cloud_cover > 30
              ? 'Partial sun breaking through clouds.'
              : 'Clear unobstructed view.'}
          </div>
        </div>

      </div>
    </section>
  );
};
