'use client';

import * as React from 'react';
import { Calendar, Sparkles, Tag, ChevronDown, Check } from 'lucide-react';
import { WodlTheme } from '../types';

interface WeeklyInfoCardProps {
  activeTheme: WodlTheme;
  allThemes: WodlTheme[];
  onSelectTheme: (themeId: string) => void;
}

export const WeeklyInfoCard: React.FC<WeeklyInfoCardProps> = ({
  activeTheme,
  allThemes,
  onSelectTheme,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalWordsInTheme = Object.values(activeTheme.words).flat().length;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent p-5 sm:p-6 dark:border-amber-500/30 dark:from-amber-500/15 dark:via-amber-500/5 dark:to-transparent">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-400/20 dark:text-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Active Week
            </span>
            {activeTheme.categoryTag && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-zinc-200/70 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Tag className="h-3 w-3 text-zinc-400" />
                {activeTheme.categoryTag}
              </span>
            )}
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {totalWordsInTheme} confirmed answers
            </span>
          </div>

          <h2 className="text-lg font-bold text-zinc-900 sm:text-xl dark:text-white">
            The weekly theme is &ldquo;{activeTheme.theme}&rdquo;
          </h2>

          <p className="flex items-center gap-1.5 text-xs text-zinc-600 sm:text-sm dark:text-zinc-300">
            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>The activity period is from {activeTheme.weekRange}.</span>
          </p>
        </div>

        {/* Theme Selector Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-800 shadow-sm transition-all hover:border-amber-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-amber-500/60 dark:hover:bg-zinc-700/60"
          >
            <span>Switch Theme</span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 z-30 mt-2 w-72 max-h-72 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Available Themes
              </div>
              {allThemes.map((t) => {
                const isCurrent = t.id === activeTheme.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTheme(t.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex w-full items-start justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${
                      isCurrent
                        ? 'bg-amber-50 font-bold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300'
                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700/50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{t.theme}</div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{t.weekRange}</div>
                    </div>
                    {isCurrent && <Check className="h-4 w-4 text-amber-500 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
