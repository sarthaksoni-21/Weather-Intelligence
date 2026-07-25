import React, { useState } from 'react';
import { DailyWeatherData, UnitSystem } from '../types';
import { getWeatherCondition } from '../utils/wmoCodes';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  daily: DailyWeatherData;
  units: UnitSystem;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, units }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const tempUnitLabel = units === 'imperial' ? '°F' : '°C';
  const speedUnitLabel = units === 'imperial' ? 'mph' : 'km/h';
  const precipUnitLabel = units === 'imperial' ? 'in' : 'mm';

  // Find min and max across all 7 days for the visual range bar
  const globalMin = Math.min(...daily.temperature_2m_min);
  const globalMax = Math.max(...daily.temperature_2m_max);
  const tempRange = Math.max(1, globalMax - globalMin);

  return (
    <section className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WeatherIcon name="Calendar" className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">7-Day Weather Forecast</h3>
        </div>
        <span className="text-xs text-slate-400">Click a day for detailed breakdown</span>
      </div>

      <div className="space-y-2.5">
        {daily.time.map((dateStr, idx) => {
          const dateObj = new Date(dateStr + 'T00:00:00');
          const isToday = idx === 0;
          const dayName = isToday
            ? 'Today'
            : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dateFormatted = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          const code = daily.weather_code[idx];
          const condition = getWeatherCondition(code);
          const maxTemp = Math.round(daily.temperature_2m_max[idx]);
          const minTemp = Math.round(daily.temperature_2m_min[idx]);
          const precipProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const rainSum = daily.precipitation_sum?.[idx] ?? 0;
          const windMax = Math.round(daily.wind_speed_10m_max[idx]);
          const uvMax = daily.uv_index_max?.[idx] ?? 0;
          const sunrise = daily.sunrise?.[idx]
            ? new Date(daily.sunrise[idx]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '—';
          const sunset = daily.sunset?.[idx]
            ? new Date(daily.sunset[idx]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '—';

          // Calculate bar percentages for relative temperature indicator
          const leftPercent = Math.max(0, Math.min(100, ((minTemp - globalMin) / tempRange) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((maxTemp - globalMin) / tempRange) * 100));
          const widthPercent = Math.max(5, rightPercent - leftPercent);

          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={dateStr}
              className={`rounded-2xl transition-all border overflow-hidden ${
                isExpanded
                  ? 'bg-slate-800/80 border-sky-500/50 shadow-lg'
                  : 'bg-slate-800/40 hover:bg-slate-800/60 border-slate-700/50'
              }`}
            >
              {/* Row Summary */}
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left transition-colors cursor-pointer"
              >
                {/* Date & Day Name */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/80 flex flex-col items-center justify-center shrink-0">
                    <span className={`text-xs font-bold ${isToday ? 'text-sky-400' : 'text-slate-200'}`}>
                      {dayName}
                    </span>
                    <span className="text-[10px] text-slate-400">{dateFormatted}</span>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-white block">
                      {condition.label}
                    </span>
                    {precipProb > 15 && (
                      <span className="text-xs text-sky-300 font-medium flex items-center gap-1">
                        💧 {precipProb}% rain ({rainSum}{precipUnitLabel})
                      </span>
                    )}
                  </div>
                </div>

                {/* Weather Icon */}
                <div className="flex items-center gap-2">
                  <WeatherIcon code={code} className={`w-7 h-7 ${condition.textColor}`} />
                </div>

                {/* Relative Temperature Bar */}
                <div className="flex-1 max-w-xs flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 w-8 text-right font-medium">
                    {minTemp}°
                  </span>

                  <div className="flex-1 h-2 bg-slate-950 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-mono text-white font-bold w-8">
                    {maxTemp}°
                  </span>
                </div>

                {/* Chevron expand indicator */}
                <div className="text-slate-400 text-xs flex items-center gap-1 shrink-0">
                  <WeatherIcon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} className="w-4 h-4" />
                </div>
              </button>

              {/* Detailed Expanded Section */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-700/50 bg-slate-900/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                    <span className="text-slate-400 block text-[11px] font-medium">Max Wind Speed</span>
                    <span className="text-white font-bold font-mono text-sm mt-0.5 block">
                      {windMax} {speedUnitLabel}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                    <span className="text-slate-400 block text-[11px] font-medium">UV Index Max</span>
                    <span className="text-amber-300 font-bold font-mono text-sm mt-0.5 block">
                      {uvMax.toFixed(1)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                    <span className="text-slate-400 block text-[11px] font-medium">Sunrise</span>
                    <span className="text-white font-bold font-mono text-sm mt-0.5 flex items-center gap-1">
                      <WeatherIcon name="Sunrise" className="w-3.5 h-3.5 text-amber-400" />
                      {sunrise}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                    <span className="text-slate-400 block text-[11px] font-medium">Sunset</span>
                    <span className="text-white font-bold font-mono text-sm mt-0.5 flex items-center gap-1">
                      <WeatherIcon name="Sunset" className="w-3.5 h-3.5 text-indigo-400" />
                      {sunset}
                    </span>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
