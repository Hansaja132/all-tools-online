'use client';

import * as React from 'react';
import { Button, Textarea } from '@tools-website/ui';
import { Check, Clipboard, Type, RefreshCw } from 'lucide-react';

export const CaseConverter: React.FC = () => {
  const [input, setInput] = React.useState('Hello world! Welcome to MultiTools case converter.');
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const getWords = (str: string): string[] => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_\-.]+/g, ' ')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  };

  const cases = [
    {
      key: 'camelCase',
      label: 'camelCase',
      transform: (str: string) => {
        const words = getWords(str);
        if (!words.length) return '';
        return (
          words[0].toLowerCase() +
          words
            .slice(1)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join('')
        );
      },
    },
    {
      key: 'snake_case',
      label: 'snake_case',
      transform: (str: string) => getWords(str).map((w) => w.toLowerCase()).join('_'),
    },
    {
      key: 'kebab-case',
      label: 'kebab-case',
      transform: (str: string) => getWords(str).map((w) => w.toLowerCase()).join('-'),
    },
    {
      key: 'PascalCase',
      label: 'PascalCase',
      transform: (str: string) =>
        getWords(str)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(''),
    },
    {
      key: 'CONSTANT_CASE',
      label: 'CONSTANT_CASE',
      transform: (str: string) => getWords(str).map((w) => w.toUpperCase()).join('_'),
    },
    {
      key: 'UPPERCASE',
      label: 'UPPERCASE',
      transform: (str: string) => str.toUpperCase(),
    },
    {
      key: 'lowercase',
      label: 'lowercase',
      transform: (str: string) => str.toLowerCase(),
    },
    {
      key: 'Title Case',
      label: 'Title Case',
      transform: (str: string) =>
        getWords(str)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' '),
    },
    {
      key: 'dot.case',
      label: 'dot.case',
      transform: (str: string) => getWords(str).map((w) => w.toLowerCase()).join('.'),
    },
  ];

  const handleCopy = (key: string, value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input section */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Type className="h-4 w-4 text-blue-500" />
            <span>Enter Your Text</span>
          </label>
          {input && (
            <Button variant="ghost" size="sm" onClick={() => setInput('')} className="text-xs text-zinc-400">
              Clear
            </Button>
          )}
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste your text here..."
          className="font-sans text-sm min-h-[100px]"
        />
      </div>

      {/* Grid of converted outputs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => {
          const result = input ? c.transform(input) : '';
          const isCopied = copiedKey === c.key;

          return (
            <div
              key={c.key}
              className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{c.label}</span>
                <button
                  onClick={() => handleCopy(c.key, result)}
                  className="rounded-md p-1.5 text-zinc-400 hover:bg-white hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  title="Copy result"
                >
                  {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Clipboard className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 break-all line-clamp-3 min-h-[2.5rem]">
                {result || <span className="text-zinc-400 font-normal italic text-xs">Waiting for input...</span>}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
