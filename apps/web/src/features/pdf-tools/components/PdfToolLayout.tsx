'use client';

import * as React from 'react';
import { ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface PdfToolLayoutProps {
  title?: string;
  badge?: string;
  description?: string;
  children: React.ReactNode;
  error?: string | null;
  privacyNotice?: string;
}

export const PdfToolLayout: React.FC<PdfToolLayoutProps> = ({
  badge = 'Local Processing',
  description,
  children,
  error,
  privacyNotice = 'All document processing runs 100% in your local browser. Your files never touch our servers.',
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Privacy guarantee badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-rose-50/70 px-4 py-2 text-xs text-rose-800 dark:bg-rose-950/30 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
          <span className="font-medium">{privacyNotice}</span>
        </div>
        <span className="inline-flex items-center space-x-1 font-semibold text-rose-700 dark:text-rose-400">
          <Sparkles className="h-3 w-3" />
          <span>Client-Side</span>
        </span>
      </div>

      {description && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      )}

      {error && (
        <div className="flex items-center space-x-2.5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/50">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="w-full">{children}</div>
    </div>
  );
};
