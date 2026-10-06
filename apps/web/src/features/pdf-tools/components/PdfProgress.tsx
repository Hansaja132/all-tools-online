'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

interface PdfProgressProps {
  progress?: number;
  statusText?: string;
  subText?: string;
}

export const PdfProgress: React.FC<PdfProgressProps> = ({
  progress = 0,
  statusText = 'Processing PDF...',
  subText = 'Processing takes place locally in your browser memory',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="relative flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
      </div>

      <div>
        <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {statusText}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {subText}
        </p>
      </div>

      {progress > 0 && (
        <div className="w-full max-w-xs space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full bg-rose-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
