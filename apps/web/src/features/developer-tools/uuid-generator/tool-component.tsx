'use client';

import * as React from 'react';
import { Button, Input, Textarea, Select } from '@tools-website/ui';
import { Check, Clipboard, RefreshCw, Download } from 'lucide-react';

export const UUIDGenerator: React.FC = () => {
  const [uuids, setUuids] = React.useState<string[]>([]);
  const [count, setCount] = React.useState(5);
  const [uppercase, setUppercase] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const generateUUID = () => {
    // Standard RFC4122 v4 UUID generator fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleGenerate = () => {
    const list = Array.from({ length: count }, () => {
      const id = generateUUID();
      return uppercase ? id.toUpperCase() : id;
    });
    setUuids(list);
  };

  React.useEffect(() => {
    handleGenerate();
  }, [count, uppercase]);

  const handleCopy = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (uuids.length === 0) return;
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uuids-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Controls */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Generator Options</h3>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Quantity</label>
          <Select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            options={[
              { label: '1 UUID', value: 1 },
              { label: '5 UUIDs', value: 5 },
              { label: '10 UUIDs', value: 10 },
              { label: '50 UUIDs', value: 50 },
              { label: '100 UUIDs', value: 100 },
            ]}
          />
        </div>

        <div className="flex items-center space-x-2.5">
          <input
            type="checkbox"
            id="uppercase"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
          />
          <label htmlFor="uppercase" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
            Uppercase letters
          </label>
        </div>

        <Button onClick={handleGenerate} className="w-full flex items-center justify-center space-x-2">
          <RefreshCw className="h-4.5 w-4.5" />
          <span>Regenerate</span>
        </Button>
      </div>

      {/* Output Panel */}
      <div className="md:col-span-2 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-zinc-900 dark:text-zinc-100">Generated UUIDs</label>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center space-x-1.5">
              <Download className="h-4.5 w-4.5" />
              <span>Download TXT</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center space-x-1.5">
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Clipboard className="h-4 w-4" />
                  <span>Copy List</span>
                </>
              )}
            </Button>
          </div>
        </div>
        <Textarea
          readOnly
          value={uuids.join('\n')}
          className="font-mono text-sm min-h-[300px] h-full"
        />
      </div>
    </div>
  );
};
