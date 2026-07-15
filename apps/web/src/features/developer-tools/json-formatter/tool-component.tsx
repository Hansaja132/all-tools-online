'use client';

import * as React from 'react';
import { Button, Textarea } from '@tools-website/ui';
import { Check, Clipboard, AlertCircle } from 'lucide-react';

export const JSONFormatter: React.FC = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleFormat = (spacing: number = 2) => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, spacing));
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Invalid JSON format');
      setOutput('');
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Invalid JSON format');
      setOutput('');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Input panel */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-zinc-900 dark:text-zinc-100">Input JSON</label>
          <Button variant="ghost" size="sm" onClick={() => setInput('')}>Clear</Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type raw JSON here..."
          className="font-mono text-sm min-h-[400px] h-full"
        />
        <div className="flex flex-wrap gap-2.5">
          <Button onClick={() => handleFormat(2)}>Format (2 Spaces)</Button>
          <Button onClick={() => handleFormat(4)}>Format (4 Spaces)</Button>
          <Button variant="secondary" onClick={handleMinify}>Minify / Compress</Button>
        </div>
        {error && (
          <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-950/20 dark:text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Output panel */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-zinc-900 dark:text-zinc-100">Formatted Output</label>
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
                  <span>Copy</span>
                </>
              )}
            </Button>
          )}
        </div>
        <Textarea
          readOnly
          value={output}
          placeholder="Formatted JSON result will appear here..."
          className="font-mono text-sm min-h-[400px] bg-zinc-50 dark:bg-zinc-900 h-full border-zinc-200 dark:border-zinc-800"
        />
      </div>
    </div>
  );
};
