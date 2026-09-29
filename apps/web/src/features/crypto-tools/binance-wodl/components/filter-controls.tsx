'use client';

import * as React from 'react';
import { RotateCcw, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import { FilterState } from '../types';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetAll: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFilterChange,
  onResetAll,
}) => {
  const { wordLength, positionedLetters, requiredLetters, excludedLetters } = filters;

  // Handle word length switch: adjusts position array size
  const handleLengthChange = (newLen: number) => {
    if (newLen === wordLength) return;
    const nextPositions = Array(newLen).fill('');
    for (let i = 0; i < Math.min(positionedLetters.length, newLen); i++) {
      nextPositions[i] = positionedLetters[i];
    }
    onFilterChange({
      ...filters,
      wordLength: newLen,
      positionedLetters: nextPositions,
    });
  };

  // Positional tile input change
  const handlePositionLetterChange = (index: number, val: string) => {
    const char = val.replace(/[^A-Za-z]/g, '').slice(-1).toUpperCase();
    const nextPositions = [...positionedLetters];
    nextPositions[index] = char;

    onFilterChange({
      ...filters,
      positionedLetters: nextPositions,
    });

    // Auto-advance to next tile if a letter was typed
    if (char && index < wordLength - 1) {
      const nextElem = document.getElementById(`pos-tile-${index + 1}`);
      if (nextElem) {
        (nextElem as HTMLInputElement).focus();
      }
    }
  };

  // Positional tile keyboard navigation
  const handlePositionKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (positionedLetters[index]) {
        // Clear current tile
        const nextPositions = [...positionedLetters];
        nextPositions[index] = '';
        onFilterChange({
          ...filters,
          positionedLetters: nextPositions,
        });
      } else if (index > 0) {
        // Move to and clear previous tile
        const nextPositions = [...positionedLetters];
        nextPositions[index - 1] = '';
        onFilterChange({
          ...filters,
          positionedLetters: nextPositions,
        });
        const prevElem = document.getElementById(`pos-tile-${index - 1}`);
        if (prevElem) {
          (prevElem as HTMLInputElement).focus();
        }
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevElem = document.getElementById(`pos-tile-${index - 1}`);
      if (prevElem) {
        (prevElem as HTMLInputElement).focus();
      }
    } else if (e.key === 'ArrowRight' && index < wordLength - 1) {
      e.preventDefault();
      const nextElem = document.getElementById(`pos-tile-${index + 1}`);
      if (nextElem) {
        (nextElem as HTMLInputElement).focus();
      }
    }
  };

  // Positional tile paste handler
  const handlePositionPaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^A-Za-z]/g, '')
      .toUpperCase();
    if (!pasted) return;

    const nextPositions = [...positionedLetters];
    for (let i = 0; i < pasted.length && index + i < wordLength; i++) {
      nextPositions[index + i] = pasted[i];
    }
    onFilterChange({
      ...filters,
      positionedLetters: nextPositions,
    });

    const nextFocusIdx = Math.min(index + pasted.length, wordLength - 1);
    const nextElem = document.getElementById(`pos-tile-${nextFocusIdx}`);
    if (nextElem) {
      (nextElem as HTMLInputElement).focus();
    }
  };

  // Clear single positional letter
  const clearPosition = (index: number) => {
    const nextPositions = [...positionedLetters];
    nextPositions[index] = '';
    onFilterChange({
      ...filters,
      positionedLetters: nextPositions,
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800/80">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            Filters
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Set letter positions and constraints
          </p>
        </div>
        <button
          type="button"
          onClick={onResetAll}
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-400 dark:hover:border-rose-500/40 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          title="Reset all filters to default"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Clear All Filters</span>
        </button>
      </div>

      {/* ── 1. Word Length Selector ──────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Word Length
          </label>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {wordLength} Letters
          </span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {[3, 4, 5, 6, 7, 8].map((num) => {
            const isSelected = wordLength === num;
            return (
              <button
                key={num}
                type="button"
                id={`length-btn-${num}`}
                onClick={() => handleLengthChange(num)}
                aria-pressed={isSelected}
                className={`flex h-11 items-center justify-center rounded-xl text-sm font-extrabold transition-all ${
                  isSelected
                    ? 'border-2 border-amber-500 bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700/80'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Correct Letter Positions (Green) ─────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Correct Positions</span>
          </label>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Green • Exact Spot
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-2.5 py-1">
          {positionedLetters.map((char, idx) => (
            <div key={idx} className="relative group">
              <input
                id={`pos-tile-${idx}`}
                type="text"
                maxLength={1}
                value={char}
                aria-label={`Position ${idx + 1}`}
                placeholder="•"
                onChange={(e) => handlePositionLetterChange(idx, e.target.value)}
                onKeyDown={(e) => handlePositionKeyDown(idx, e)}
                onPaste={(e) => handlePositionPaste(idx, e)}
                className={`h-12 w-10 sm:h-14 sm:w-12 rounded-xl border-2 text-center font-black text-xl sm:text-2xl uppercase transition-all outline-none ${
                  char
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                    : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-amber-400 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-amber-400/20 dark:focus:border-amber-400'
                }`}
              />
              <span className="mt-1 block text-center text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Correct Letters (Unknown Position) ────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="correct-letters-input"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300"
          >
            <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
            <span>Correct Letters</span>
          </label>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Yellow • Wrong Spot
          </span>
        </div>
        <div className="relative">
          <input
            id="correct-letters-input"
            type="text"
            placeholder="e.g. RTA or AA"
            value={requiredLetters}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                requiredLetters: e.target.value.toUpperCase(),
              })
            }
            className="w-full rounded-xl border border-amber-300/80 dark:border-amber-500/40 bg-white dark:bg-zinc-800/90 px-3.5 py-2.5 text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase placeholder:normal-case placeholder:text-zinc-400 dark:placeholder:text-zinc-500 placeholder:font-normal focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
          {requiredLetters && (
            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  requiredLetters: '',
                })
              }
              aria-label="Clear correct letters"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Letters known to exist in the word. Repeat letters if you know multiple exist (e.g. <span className="font-semibold text-zinc-700 dark:text-zinc-300">AA</span>).
        </p>
      </div>

      {/* ── 4. Incorrect Letters (Excluded) ─────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="incorrect-letters-input"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
          >
            <XCircle className="h-3.5 w-3.5 text-zinc-500" />
            <span>Incorrect Letters</span>
          </label>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Gray • Ruled Out
          </span>
        </div>
        <div className="relative">
          <input
            id="incorrect-letters-input"
            type="text"
            placeholder="e.g. XYZ"
            value={excludedLetters}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                excludedLetters: e.target.value.toUpperCase(),
              })
            }
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/90 px-3.5 py-2.5 text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase placeholder:normal-case placeholder:text-zinc-400 dark:placeholder:text-zinc-500 placeholder:font-normal focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/20"
          />
          {excludedLetters && (
            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  excludedLetters: '',
                })
              }
              aria-label="Clear incorrect letters"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Letters confirmed NOT to exist anywhere in the word.
        </p>
      </div>
    </div>
  );
};
