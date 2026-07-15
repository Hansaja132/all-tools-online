'use client';

import * as React from 'react';
import { Button, Textarea } from '@tools-website/ui';
import { Check, Clipboard, RefreshCw, AlertCircle } from 'lucide-react';

export const Base64Tool: React.FC = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [mode, setMode] = React.useState<'encode' | 'decode'>('encode');
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleProcess = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
        setError(null);
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
        setError(null);
      }
    } catch (e) {
      setError('Failed to process string. Please verify input schema is compatible.');
      setOutput('');
    }
  };

  React.useEffect(() => {
    handleProcess();
  }, [input, mode]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Input */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">Input Data</span>
          <div className="flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
            <button
              onClick={() => setMode('encode')}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                mode === 'encode'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                mode === 'decode'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              Decode
            </button>
          </div>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter plain text to encode...' : 'Enter Base64 data to decode...'}
          className="font-mono text-sm min-h-[350px]"
        />
        {error && (
          <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-950/20 dark:text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Output */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">Result</span>
          {output && (
            <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center space-x-1.5">
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Clipboard className="h-4 w-4" />
                  <span>Copy Result</span>
                </>
              )}
            </Button>
          )}
        </div>
        <Textarea
          readOnly
          value={output}
          placeholder="Output will display here..."
          className="font-mono text-sm min-h-[350px] bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
        />
      </div>
    </div>
  );
};
