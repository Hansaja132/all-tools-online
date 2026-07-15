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
      {/* Editor Textarea */}
      <div className="md:col-span-2 flex flex-col space-y-4">
        <label className="text-base font-bold text-zinc-900 dark:text-zinc-100">Your Text</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or start typing your content here to analyze..."
          className="text-base min-h-[350px] h-full"
        />
      </div>

      {/* Analytics stats */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">Analysis Results</h3>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">Words</span>
              <span className="text-base font-extrabold text-violet-600 dark:text-violet-400">{stats.words}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">Characters (with spaces)</span>
              <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-100">{stats.chars}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">Characters (no spaces)</span>
              <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-100">{stats.charsNoSpaces}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">Paragraphs</span>
              <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-100">{stats.paragraphs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">Lines</span>
              <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-100">{stats.lines}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <div className="flex justify-between items-center bg-violet-50 dark:bg-violet-950/20 p-3.5 rounded-lg border border-violet-100 dark:border-violet-900/30">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Estimated Reading Time</span>
            <span className="text-base font-black text-violet-700 dark:text-violet-400">~{stats.readingTime} min</span>
          </div>
        </div>
      </div>
    </div>
  );
};
