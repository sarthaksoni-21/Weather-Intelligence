import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Card Skeleton */}
      <div className="h-80 rounded-3xl bg-slate-800/60 border border-slate-700/50 p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-700 rounded-full" />
            <div className="h-16 w-48 bg-slate-700 rounded-2xl" />
            <div className="h-4 w-40 bg-slate-700 rounded-full" />
          </div>
          <div className="w-28 h-28 bg-slate-700 rounded-3xl" />
        </div>
        <div className="grid grid-cols-6 gap-3 pt-6 border-t border-slate-700/50">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-700/60 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Hourly Skeleton */}
      <div className="h-48 rounded-3xl bg-slate-800/60 border border-slate-700/50 p-6 space-y-4">
        <div className="h-5 w-40 bg-slate-700 rounded-full" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-24 h-28 bg-slate-700/60 rounded-2xl shrink-0" />
          ))}
        </div>
      </div>

      {/* Recommendations Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-44 bg-slate-800/60 rounded-2xl p-5 space-y-3">
            <div className="h-4 w-28 bg-slate-700 rounded-full" />
            <div className="h-8 w-full bg-slate-700/60 rounded-xl" />
            <div className="h-3 w-3/4 bg-slate-700/40 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
