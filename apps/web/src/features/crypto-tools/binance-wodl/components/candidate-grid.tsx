'use client';

import * as React from 'react';
import { Check, Clipboard, Sparkles, AlertCircle, RotateCcw } from 'lucide-react';
import { CandidateWord } from '../types';

interface CandidateGridProps {
  wordLength: number;
  candidates: CandidateWord[];
  onCopyWord: (word: string) => void;
  copiedWord: string | null;
  onResetFilters: () => void;
}

export const CandidateGrid: React.FC<CandidateGridProps> = ({
  wordLength,
  candidates,
  onCopyWord,
  copiedWord,
  onResetFilters,
}) => {
  const confirmedCount = candidates.filter((c) => c.isConfirmed).length;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90 space-y-5">
      {/* Header with Title and Dynamic Count */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800/80">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            Possible {wordLength}-Letter Words
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Click any word to copy to clipboard
          </p>
        </div>

        <div className="flex items-center gap-2">
          {confirmedCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              {confirmedCount} Confirmed
            </span>
          )}
          <span className="inline-flex items-center rounded-xl bg-zinc-100 px-3 py-1 text-xs font-extrabold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            {candidates.length} {candidates.length === 1 ? 'word' : 'words'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
          Confirmed Weekly Answer
        </span>
        <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          General Candidate Word
        </span>
      </div>

      {/* Grid or Empty State */}
      {candidates.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[560px] overflow-y-auto pr-1">
          {candidates.map((item) => {
            const isCopied = copiedWord === item.word;
            return (
              <button
                key={item.word}
                type="button"
                onClick={() => onCopyWord(item.word)}
                className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-extrabold tracking-wider transition-all active:scale-[0.98] ${
                  item.isConfirmed
                    ? 'border-2 border-emerald-500 bg-emerald-50/90 text-emerald-950 shadow-sm shadow-emerald-500/10 hover:bg-emerald-100 dark:border-emerald-500/80 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-950/60'
                    : 'border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-100 hover:border-amber-400 dark:hover:border-amber-500/60 hover:bg-zinc-50 dark:hover:bg-zinc-700/80'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>{item.word}</span>
                  {item.isConfirmed && (
                    <span
                      title="Confirmed weekly answer"
                      className="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400"
                    >
                      ★
                    </span>
                  )}
                </div>

                <span className="shrink-0 ml-1.5 text-zinc-400 transition-colors group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
                  {isCopied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Clipboard className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-12 px-4 text-center dark:border-zinc-800">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
            No matching words found.
          </h4>
          <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
            No words match the combined positional, required, and excluded letter filters. Try clearing conflicting letters.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
