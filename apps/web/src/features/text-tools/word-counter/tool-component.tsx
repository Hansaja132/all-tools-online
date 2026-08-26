'use client';

import * as React from 'react';
import { Textarea } from '@tools-website/ui';

export const WordCounter: React.FC = () => {
  const [text, setText] = React.useState('');
  const [stats, setStats] = React.useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0,
  });

  React.useEffect(() => {
    const trimmed = text.trim();
    const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = trimmed === '' ? 0 : trimmed.split(/\n+/).length;
    const lines = text === '' ? 0 : text.split('\n').length;
    
    // Standard reading speed is ~200 words per minute
    const readingTime = Math.ceil(words / 200);

    setStats({ words, chars, charsNoSpaces, paragraphs, lines, readingTime });
  }, [text]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Analytics stats */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Analysis Results</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col p-3 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/30">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-1">Words</span>
            <span className="text-2xl font-black text-violet-600 dark:text-violet-400">{stats.words}</span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-1">Paragraphs</span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{stats.paragraphs}</span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-1">Lines</span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{stats.lines}</span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-1">Chars (all)</span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{stats.chars}</span>
          </div>
          <div className="col-span-2 flex flex-col p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-1">Characters (no spaces)</span>
            <span className="text-xl font-black text-zinc-800 dark:text-zinc-100">{stats.charsNoSpaces}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex justify-between items-center bg-violet-50 dark:bg-violet-950/20 p-4 rounded-xl border border-violet-100 dark:border-violet-900/30">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Reading Time</span>
            <span className="text-lg font-black text-violet-700 dark:text-violet-400">~{stats.readingTime} min</span>
          </div>
        </div>
      </div>

      {/* Editor Textarea */}
      <div className="md:col-span-2 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-zinc-900 dark:text-zinc-100">Your Text</label>
          <button
            onClick={() => setText('')}
            className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or start typing your content here to analyze..."
          className="text-base min-h-[400px] h-full"
        />
      </div>
    </div>
  );
};
