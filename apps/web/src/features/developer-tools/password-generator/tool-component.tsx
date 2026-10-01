'use client';

import * as React from 'react';
import { Button, Textarea, Select } from '@tools-website/ui';
import { Check, Clipboard, RefreshCw } from 'lucide-react';

export const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = React.useState('');
  const [length, setLength] = React.useState(16);
  const [useUppercase, setUseUppercase] = React.useState(true);
  const [useNumbers, setUseNumbers] = React.useState(true);
  const [useSymbols, setUseSymbols] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [strength, setStrength] = React.useState({ label: 'Weak', color: 'bg-red-500', width: 'w-1/4' });

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 8) score++;
    if (pwd.length > 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) {
      setStrength({ label: 'Weak', color: 'bg-red-500', width: 'w-1/4' });
    } else if (score === 3 || score === 4) {
      setStrength({ label: 'Medium', color: 'bg-amber-500', width: 'w-2/4' });
    } else {
      setStrength({ label: 'Strong', color: 'bg-green-500', width: 'w-full' });
    }
  };

  const handleGenerate = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let generated = '';
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const randomValues = new Uint32Array(length);
      window.crypto.getRandomValues(randomValues);
      for (let i = 0; i < length; i++) {
        generated += chars.charAt(randomValues[i] % chars.length);
      }
    } else {
      for (let i = 0; i < length; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        generated += chars.charAt(idx);
      }
    }
    setPassword(generated);
    calculateStrength(generated);

  };

  React.useEffect(() => {
    handleGenerate();
  }, [length, useUppercase, useNumbers, useSymbols]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Controls */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Configuration</h3>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Length</label>
          <Select
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            options={[
              { label: '8 Characters', value: 8 },
              { label: '12 Characters', value: 12 },
              { label: '16 Characters', value: 16 },
              { label: '24 Characters', value: 24 },
              { label: '32 Characters', value: 32 },
            ]}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={useUppercase}
              onChange={(e) => setUseUppercase(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 select-none">Include Uppercase</span>
          </label>

          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 select-none">Include Numbers</span>
          </label>

          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 select-none">Include Symbols</span>
          </label>
        </div>

        <Button onClick={handleGenerate} className="w-full flex items-center justify-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Regenerate</span>
        </Button>
      </div>

      {/* Output Panel */}
      <div className="md:col-span-2 flex flex-col justify-center space-y-5">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-zinc-900 dark:text-zinc-100">Generated Password</label>
          <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center space-x-1.5">
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4" />
                <span>Copy Password</span>
              </>
            )}
          </Button>
        </div>

        <div className="relative">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-xl text-center text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 shadow-sm"
          />
        </div>

        {/* Strength Meter */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex justify-between text-sm font-semibold mb-2">
            <span className="text-zinc-500 dark:text-zinc-400">Password Strength:</span>
            <span className="text-zinc-900 dark:text-zinc-100">{strength.label}</span>
          </div>
          <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
