'use client';

import * as React from 'react';
import { Button, Input } from '@tools-website/ui';
import { Check, Clipboard, Link2, Sparkles, ExternalLink } from 'lucide-react';

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it',
  'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these',
  'they', 'this', 'to', 'was', 'will', 'with'
]);

export const SlugGenerator: React.FC = () => {
  const [input, setInput] = React.useState('10 Essential Web Tools Every Developer & Designer Needs in 2026!');
  const [separator, setSeparator] = React.useState<'-' | '_' | '.'>('-');
  const [lowercase, setLowercase] = React.useState(true);
  const [removeStopWords, setRemoveStopWords] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const slug = React.useMemo(() => {
    if (!input.trim()) return '';

    // 1. Normalize accents (e.g. Café -> Cafe)
    let text = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 2. Optional lowercase
    if (lowercase) {
      text = text.toLowerCase();
    }

    // 3. Remove non-alphanumeric chars (except whitespace)
    text = text.replace(/[^a-zA-Z0-9\s]/g, ' ');

    // 4. Split words
    let words = text.trim().split(/\s+/).filter(Boolean);

    // 5. Optional remove stop words
    if (removeStopWords) {
      const filtered = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
      if (filtered.length > 0) {
        words = filtered;
      }
    }

    return words.join(separator);
  }, [input, separator, lowercase, removeStopWords]);

  const handleCopy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Field */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
          <Link2 className="h-4 w-4 text-emerald-500" />
          <span>Enter Title or Article Name</span>
        </label>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. My First Blog Post Header Title"
          className="font-sans text-base py-2.5"
        />
      </div>

      {/* Options Panel */}
      <div className="grid gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 sm:grid-cols-3">
        <div>
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block mb-1">Separator Character</label>
          <div className="flex rounded-lg bg-zinc-200 p-1 dark:bg-zinc-800">
            {(['-', '_', '.'] as const).map((sep) => (
              <button
                key={sep}
                onClick={() => setSeparator(sep)}
                className={`flex-1 rounded-md py-1 text-xs font-bold font-mono transition-all ${
                  separator === sep
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                {sep === '-' ? 'Hyphen (-)' : sep === '_' ? 'Underscore (_)' : 'Dot (.)'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-2">
          <label className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Lowercase Output</span>
          </label>
        </div>

        <div className="flex flex-col justify-center space-y-2">
          <label className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={removeStopWords}
              onChange={(e) => setRemoveStopWords(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Strip Common Stop Words (a, the, in...)</span>
          </label>
        </div>
      </div>

      {/* Generated Slug Result */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center space-x-1.5">
            <Sparkles className="h-4 w-4" />
            <span>Generated URL Slug</span>
          </span>
          {slug && (
            <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 text-xs border-emerald-300 dark:border-emerald-800">
              {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Clipboard className="h-3.5 w-3.5" />}
              <span className="ml-1.5">{copied ? 'Copied' : 'Copy Slug'}</span>
            </Button>
          )}
        </div>
        <p className="font-mono text-lg font-bold text-emerald-900 dark:text-emerald-200 break-all select-all">
          {slug || <span className="text-zinc-400 font-normal italic text-sm">Enter text above to generate slug...</span>}
        </p>

        {slug && (
          <div className="mt-4 pt-4 border-t border-emerald-200/60 dark:border-emerald-900/40 flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-400">
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="font-mono">https://example.com/posts/<strong className="underline">{slug}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};
