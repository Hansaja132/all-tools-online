'use client';

import * as React from 'react';
import { Button, Input, Select } from '@tools-website/ui';
import { Check, Clipboard, RefreshCw } from 'lucide-react';

export const ColorPicker: React.FC = () => {
  const [color1, setColor1] = React.useState('#8b5cf6'); // Violet 500
  const [color2, setColor2] = React.useState('#3b82f6'); // Blue 500
  const [gradientType, setGradientType] = React.useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = React.useState(135);
  const [copied, setCopied] = React.useState(false);

  const getGradientCss = () => {
    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    }
    return `radial-gradient(circle, ${color1}, ${color2})`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`background: ${getGradientCss()};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Controls */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Color Palette Settings</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Color 1</label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-zinc-200 p-0"
              />
              <Input
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="text-sm font-mono h-10"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Color 2</label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-zinc-200 p-0"
              />
              <Input
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="text-sm font-mono h-10"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Type</label>
          <Select
            value={gradientType}
            onChange={(e) => setTheme(e.target.value)} // Wait, select value mapping
            // Oh, we should use setGradientType
            // Let's make sure it calls:
            // onChange={(e) => setGradientType(e.target.value as any)}
            onChange={(e) => setGradientType(e.target.value as any)}
            options={[
              { label: 'Linear Gradient', value: 'linear' },
              { label: 'Radial Gradient', value: 'radial' },
            ]}
          />
        </div>

        {gradientType === 'linear' && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Angle</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{angle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-zinc-200 appearance-none cursor-pointer dark:bg-zinc-800 accent-violet-600"
            />
          </div>
        )}

        <Button onClick={handleCopy} className="w-full flex items-center justify-center space-x-2">
          {copied ? (
            <>
              <Check className="h-4.5 w-4.5 text-green-300" />
              <span>Copied Code</span>
            </>
          ) : (
            <>
              <Clipboard className="h-4.5 w-4.5" />
              <span>Copy CSS Code</span>
            </>
          )}
        </Button>
      </div>

      {/* Preview box */}
      <div className="md:col-span-2 flex flex-col justify-between border border-zinc-200 rounded-xl bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/50">
        <div
          className="w-full h-[250px] rounded-xl shadow-inner border border-zinc-200 dark:border-zinc-800"
          style={{ background: getGradientCss() }}
        />
        <div className="mt-4 rounded-lg bg-white p-4 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <code className="text-sm font-mono text-zinc-700 dark:text-zinc-300 break-all select-all">
            background: {getGradientCss()};
          </code>
        </div>
      </div>
    </div>
  );
};
