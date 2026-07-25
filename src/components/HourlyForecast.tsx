import React, { useState } from 'react';
import { HourlyWeatherData, UnitSystem } from '../types';
import { getWeatherCondition } from '../utils/wmoCodes';
import { WeatherIcon } from './WeatherIcon';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface HourlyForecastProps {
  hourly: HourlyWeatherData;
  units: UnitSystem;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, units }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'chart'>('cards');

  // Format first 24 hours of data starting from now
  const now = new Date();
  const currentISOHour = now.toISOString().slice(0, 13); // e.g., "2026-07-25T10"

  let startIndex = hourly.time.findIndex((t) => t.startsWith(currentISOHour));
  if (startIndex === -1) startIndex = 0;

  const next24Hours = hourly.time.slice(startIndex, startIndex + 24).map((timeStr, idx) => {
    const globalIdx = startIndex + idx;
    const dateObj = new Date(timeStr);
    const hourFormatted = dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
    });

    const code = hourly.weather_code[globalIdx];
    const temp = Math.round(hourly.temperature_2m[globalIdx]);
    const rainProb = hourly.precipitation_probability[globalIdx] ?? 0;
    const wind = Math.round(hourly.wind_speed_10m[globalIdx]);

    return {
      timeLabel: idx === 0 ? 'Now' : hourFormatted,
      timeFull: timeStr,
      temp,
      rainProb,
      wind,
      code,
      condition: getWeatherCondition(code),
    };
  });

  const tempUnitLabel = units === 'imperial' ? '°F' : '°C';

  return (
    <section className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-5">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <WeatherIcon name="Clock" className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">Hourly Forecast</h3>
          <span className="text-xs text-slate-400 font-medium">(Next 24 Hours)</span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'cards'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hourly Timeline
          </button>
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'chart'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Temperature Chart
          </button>
        </div>
      </div>

      {/* Card Carousel Mode */}
      {viewMode === 'cards' ? (
        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar">
          {next24Hours.map((item, idx) => (
            <div
              key={item.timeFull || idx}
              className={`flex-shrink-0 w-24 p-3.5 rounded-2xl flex flex-col items-center justify-between text-center transition-all ${
                idx === 0
                  ? 'bg-gradient-to-b from-sky-500/30 to-blue-600/30 border-2 border-sky-400 shadow-lg'
                  : 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <span className={`text-xs font-semibold ${idx === 0 ? 'text-sky-300' : 'text-slate-300'}`}>
                {item.timeLabel}
              </span>

              <WeatherIcon
                code={item.code}
                className={`w-8 h-8 my-2 ${item.condition.textColor}`}
              />

              <span className="text-base font-bold text-white font-mono">
                {item.temp}{tempUnitLabel}
              </span>

              {item.rainProb > 10 ? (
                <span className="mt-2 text-[10px] font-bold text-sky-300 bg-sky-950/80 border border-sky-800/80 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  💧 {item.rainProb}%
                </span>
              ) : (
                <span className="mt-2 text-[10px] text-slate-500">
                  {item.condition.label.split(' ')[0]}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Chart View Mode */
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={next24Hours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                        <p className="font-bold text-white">{data.timeLabel}</p>
                        <p className="text-sky-300">Temp: {data.temp}{tempUnitLabel}</p>
                        <p className="text-indigo-300">Precip Prob: {data.rainProb}%</p>
                        <p className="text-slate-400">{data.condition.label}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                name="Temperature"
                stroke="#38bdf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
              <Area
                type="monotone"
                dataKey="rainProb"
                name="Rain Probability (%)"
                stroke="#818cf8"
                strokeWidth={2}
                fillOpacity={0.5}
                fill="url(#rainGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};
