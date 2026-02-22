
import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, target }) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-sm font-semibold text-emerald-700">Progress Donasi</span>
        <span className="text-2xl font-black text-emerald-600">{percentage.toFixed(1)}%</span>
      </div>
      <div className="relative h-8 w-full bg-emerald-100 rounded-2xl overflow-hidden shadow-inner border border-emerald-200">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000 ease-out flex items-center justify-end px-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 15 && (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};
