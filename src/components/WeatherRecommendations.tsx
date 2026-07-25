import React from 'react';
import { CurrentWeatherData, DailyWeatherData } from '../types';
import { generateRecommendations } from '../utils/recommendations';
import { WeatherIcon } from './WeatherIcon';

interface WeatherRecommendationsProps {
  current: CurrentWeatherData;
  daily?: DailyWeatherData;
}

export const WeatherRecommendations: React.FC<WeatherRecommendationsProps> = ({
  current,
  daily,
}) => {
  const recommendations = generateRecommendations(current, daily);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <WeatherIcon name="Sparkles" className="w-5 h-5 text-amber-400" />
          Smart Weather Recommendations
        </h3>
        <span className="text-xs text-slate-400">Contextual advice based on live forecast</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((item) => (
          <div
            key={item.title}
            className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 flex flex-col justify-between shadow-xl hover:border-slate-600 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-800 text-sky-400 border border-slate-700/60 group-hover:scale-110 transition-transform">
                    <WeatherIcon name={item.icon} className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>

              <p className="text-xs text-slate-200 font-medium leading-relaxed mb-3">
                {item.advice}
              </p>

              <ul className="space-y-1.5 border-t border-slate-800/80 pt-3">
                {item.details.map((detail, idx) => (
                  <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                    <span className="text-sky-400 font-bold">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
