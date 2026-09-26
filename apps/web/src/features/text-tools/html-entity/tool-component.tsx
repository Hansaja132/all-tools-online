'use client';

import * as React from 'react';
import { Button, Textarea } from '@tools-website/ui';
import { Check, Clipboard, Code2, AlertCircle } from 'lucide-react';

const COMMON_ENTITIES = [
  { char: '<', name: '&lt;', number: '&#60;' },
  { char: '>', name: '&gt;', number: '&#62;' },
  { char: '&', name: '&amp;', number: '&#38;' },
  { char: '"', name: '&quot;', number: '&#34;' },
  { char: "'", name: '&apos;', number: '&#39;' },
  { char: '©', name: '&copy;', number: '&#169;' },
  { char: '®', name: '&reg;', number: '&#174;' },
  { char: '™', name: '&trade;', number: '&#8482;' },
  { char: '€', name: '&euro;', number: '&#8364;' },
  { char: '£', name: '&pound;', number: '&#163;' },
  { char: '¥', name: '&yen;', number: '&#165;' },
  { char: ' ', name: '&nbsp;', number: '&#160;' },
];

export const HTMLEntityTool: React.FC = () => {
  const [input, setInput] = React.useState('<h1>Hello World & Welcome!</h1>');
  const [output, setOutput] = React.useState('');
  const [mode, setMode] = React.useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = React.useState(false);

  const encodeHTML = (str: string) => {
    return str.replace(/[\u00A0-\u9999<>&"']/g, (i) => '&#' + i.charCodeAt(0) + ';');
  };

  const decodeHTML = (str: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  };

  const handleProcess = () => {
    if (!input) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(encodeHTML(input));
      } else {
        setOutput(decodeHTML(input));
      }
    } catch (e) {
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
    <div className="space-y-8">
      {/* Input / Output Editors */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
              <Code2 className="h-4 w-4 text-purple-500" />
              <span>Input Text</span>
            </span>
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
            placeholder={mode === 'encode' ? 'Type HTML or text to encode...' : 'Paste encoded entities like &lt;h1&gt;...'}
            className="font-mono text-xs min-h-[300px]"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Result</span>
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
            placeholder="Converted output will appear here..."
            className="font-mono text-xs min-h-[300px] bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
          />
        </div>
      </div>

      {/* Common HTML Entities Quick Reference */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
          Common HTML Entity Reference
        </h3>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {COMMON_ENTITIES.map((ent, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-white border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 text-center"
            >
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{ent.char}</span>
              <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400 mt-1">{ent.name}</span>
              <span className="font-mono text-[10px] text-zinc-400">{ent.number}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
