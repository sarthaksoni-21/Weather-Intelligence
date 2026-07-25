import React from 'react';
import { WeatherIcon } from './WeatherIcon';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onSelectDefault?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Weather Data Unavailable',
  message,
  onRetry,
  onSelectDefault,
}) => {
  return (
    <div className="p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-rose-500/30 text-center max-w-lg mx-auto shadow-2xl space-y-4 my-10">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-400/30 mx-auto flex items-center justify-center">
        <WeatherIcon name="AlertTriangle" className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-lg shadow-sky-500/20 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <WeatherIcon name="RotateCcw" className="w-3.5 h-3.5" />
            Try Again
          </button>
        )}

        {onSelectDefault && (
          <button
            type="button"
            onClick={onSelectDefault}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all active:scale-95"
          >
            Load London Weather
          </button>
        )}
      </div>
    </div>
  );
};
