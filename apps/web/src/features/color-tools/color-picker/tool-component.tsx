'use client';

import * as React from 'react';
import { Button, Input, Select, Card } from '@tools-website/ui';
import { Check, Clipboard, RefreshCw } from 'lucide-react';

export const ColorPicker: React.FC = () => {
  const [color1, setColor1] = React.useState('#8b5cf6'); // Violet 500
  const [color2, setColor2] = React.useState('#3b82f6'); // Blue 500
  const [mode, setMode] = React.useState<'single' | 'gradient'>('gradient');
  const [gradientType, setGradientType] = React.useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = React.useState(135);
  const [copied, setCopied] = React.useState(false);

  const getGradientCss = () => {
    if (mode === 'single') return color1;
    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    }
    return `radial-gradient(circle, ${color1}, ${color2})`;
  };

  const getTailwindCss = (type: 'main' | 'button' | 'text' | 'card') => {
    const colorValue = getGradientCss();
    const gradient = `bg-[${colorValue}]`;
    switch (type) {
      case 'button': return `${gradient} text-white font-bold`;
      case 'text': return `${gradient} text-transparent bg-clip-text`;
      case 'card': return `${gradient} text-white`;
      default: return gradient;
    }
  };

  const handleCopy = () => {
    const value = mode === 'single' ? `background-color: ${color1};` : `background: ${getGradientCss()};`;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyTailwind = (type: 'main' | 'button' | 'text' | 'card') => {
    navigator.clipboard.writeText(getTailwindCss(type));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Controls */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Color Palette Settings</h3>

        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <button
            onClick={() => setMode('single')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'single'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            Single Color
          </button>
          <button
            onClick={() => setMode('gradient')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'gradient'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            Gradient
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-3">
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Color 1</label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <div className="relative group">
                  <input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded-lg border border-zinc-200 p-0 appearance-none bg-transparent"
                    style={{ backgroundColor: 'transparent' }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none rounded-lg border border-zinc-200 dark:border-zinc-700"
                    style={{ background: color1 }}
                  />
                </div>
                <Input
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="text-sm font-mono h-10"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff', '#000000'].map(c => (
                  <button
                    key={c}
                    onClick={() => setColor1(c)}
                    className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-700 transition-transform hover:scale-125"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {mode === 'gradient' && (
            <div className="space-y-3">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Color 2</label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <div className="relative group">
                    <input
                      type="color"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded-lg border border-zinc-200 p-0 appearance-none bg-transparent"
                      style={{ backgroundColor: 'transparent' }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none rounded-lg border border-zinc-200 dark:border-zinc-700"
                      style={{ background: color2 }}
                    />
                  </div>
                  <Input
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="text-sm font-mono h-10"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff', '#000000'].map(c => (
                    <button
                      key={c}
                      onClick={() => setColor2(c)}
                      className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-700 transition-transform hover:scale-125"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {mode === 'gradient' && (
          <div className="space-y-3">
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Type</label>
            <Select
              value={gradientType}
              onChange={(e) => setGradientType(e.target.value as any)}
              options={[
                { label: 'Linear Gradient', value: 'linear' },
                { label: 'Radial Gradient', value: 'radial' },
              ]}
            />
          </div>
        )}

        {mode === 'gradient' && gradientType === 'linear' && (
          <div className="space-y-3">
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
      <div className="md:col-span-2 flex flex-col gap-6 border border-zinc-200 rounded-xl bg-zinc-100/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Main Preview</label>
            <div
              className="w-full h-32 rounded-xl shadow-inner border border-zinc-200 dark:border-zinc-800"
              style={{ backgroundImage: getGradientCss() }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Action Button</label>
              <Button
                className="w-full h-12 text-white font-bold border-none"
                style={{ backgroundImage: getGradientCss() }}
              >
                Get Started
              </Button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Gradient Text</label>
              <div
                className="text-3xl font-black text-transparent bg-clip-text"
                style={{ backgroundImage: getGradientCss() }}
              >
                Hello World
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Card Surface</label>
            <Card
              className="p-6 text-white border-none"
              style={{ backgroundImage: getGradientCss() }}
            >
              <h4 className="text-lg font-bold mb-1">Gradient Card</h4>
              <p className="text-sm opacity-90">
                This is a preview of how your gradient looks as a card background.
              </p>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Implementation Options</h3>
          <div className="grid gap-3">
            {[
              { id: 'main', label: 'General Background' },
              { id: 'button', label: 'Action Button' },
              { id: 'text', label: 'Gradient Text' },
              { id: 'card', label: 'Card Surface' },
            ].map((option) => (
              <div key={option.id} className="rounded-lg bg-white/70 backdrop-blur-sm p-3 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{option.label}</span>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-2 group">
                    <div className="flex-1 overflow-hidden">
                      <span className="text-[10px] text-zinc-400 block mb-1 font-mono uppercase">CSS</span>
                      <code className="text-xs font-mono text-zinc-600 dark:text-zinc-400 break-all">
                        {mode === 'single' ? `background-color: ${color1};` : `background-image: ${getGradientCss()};`}
                      </code>
                    </div>
                    <button
                      onClick={() => handleCopy()}
                      className="p-2 rounded-md hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      title="Copy CSS"
                    >
                      <Clipboard className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2 group">
                    <div className="flex-1 overflow-hidden">
                      <span className="text-[10px] text-zinc-400 block mb-1 font-mono uppercase">Tailwind</span>
                      <code className="text-xs font-mono text-zinc-600 dark:text-zinc-400 break-all">
                        {getTailwindCss(option.id as any)}
                      </code>
                    </div>
                    <button
                      onClick={() => handleCopyTailwind(option.id as any)}
                      className="p-2 rounded-md hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      title="Copy Tailwind"
                    >
                      <Clipboard className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
