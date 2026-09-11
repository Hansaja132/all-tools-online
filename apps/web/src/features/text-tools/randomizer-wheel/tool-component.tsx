'use client';

import * as React from 'react';
import { Button, Input, Modal, Select, Textarea, useToast } from '@tools-website/ui';
import {
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Shuffle,
  Plus,
  Trash2,
  Trophy,
  History,
  Layers,
  Wand2,
} from 'lucide-react';

interface EntryItem {
  id: string;
  text: string;
}

const PALETTES = {
  rainbow: ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93', '#F15BB5', '#00F5D4'],
  pastel: ['#FBF8CC', '#FDE4CF', '#FFCFD2', '#F1C0E8', '#CFBAF0', '#A3C4F3', '#B9FBC0'],
  neon: ['#FF007F', '#7F00FF', '#00F0FF', '#00FF66', '#FFE600', '#FF5500'],
  binance: ['#F0B90B', '#181A20', '#F3BA2F', '#2B313A', '#FCD535', '#474D57'],
  ocean: ['#03045E', '#023E8A', '#0077B6', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF'],
};

const PRESETS = [
  {
    name: 'Yes / No / Maybe',
    items: ['Yes', 'No', 'Maybe', 'Ask Again'],
  },
  {
    name: 'Dice Roll (1 - 6)',
    items: ['1', '2', '3', '4', '5', '6'],
  },
  {
    name: 'Lunch Options',
    items: [
      'Pizza 🍕',
      'Sushi 🍣',
      'Tacos 🌮',
      'Burger 🍔',
      'Salad 🥗',
      'Ramen 🍜',
      'Pasta 🍝',
      'Sandwich 🥪',
    ],
  },
  {
    name: 'Team Standup Order',
    items: ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank'],
  },
  {
    name: 'Numbers (1 - 10)',
    items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  },
];

export const RandomizerWheel: React.FC = () => {
  const { toast } = useToast();

  const [entries, setEntries] = React.useState<EntryItem[]>([
    { id: '1', text: 'Option A' },
    { id: '2', text: 'Option B' },
    { id: '3', text: 'Option C' },
    { id: '4', text: 'Option D' },
    { id: '5', text: 'Option E' },
    { id: '6', text: 'Option F' },
  ]);

  const [bulkInput, setBulkInput] = React.useState(
    'Option A\nOption B\nOption C\nOption D\nOption E\nOption F',
  );
  const [newEntryText, setNewEntryText] = React.useState('');
  const [paletteKey, setPaletteKey] = React.useState<keyof typeof PALETTES>('rainbow');
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [autoRemoveWinner, setAutoRemoveWinner] = React.useState(false);

  const [isSpinning, setIsSpinning] = React.useState(false);
  const [winner, setWinner] = React.useState<string | null>(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = React.useState(false);
  const [history, setHistory] = React.useState<{ id: string; winner: string; timestamp: string }[]>(
    [],
  );

  // Dark mode detector for Canvas adaptive styling
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  React.useEffect(() => {
    const checkDark = () => {
      setIsDarkTheme(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Wheel angle state (in radians)
  const angleRef = React.useRef(0);
  const animationFrameRef = React.useRef<number | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Audio Context ref for synthesized sound effects
  const audioCtxRef = React.useRef<AudioContext | null>(null);

  const playTickSound = React.useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Audio context fallback
    }
  }, [soundEnabled]);

  const playVictorySound = React.useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {
      // Audio context fallback
    }
  }, [soundEnabled]);

  // Render Wheel on Canvas (Adapts automatically to dark/light theme)
  const drawWheel = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 16;

    ctx.clearRect(0, 0, width, height);

    if (entries.length === 0) {
      // Empty state
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = isDarkTheme ? '#27272a' : '#f4f4f5';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = isDarkTheme ? '#3f3f46' : '#e4e4e7';
      ctx.stroke();

      ctx.fillStyle = isDarkTheme ? '#a1a1aa' : '#71717a';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Add choices to spin wheel', centerX, centerY);
      return;
    }

    const colors = PALETTES[paletteKey];
    const sliceAngle = (2 * Math.PI) / entries.length;

    // Draw slices
    entries.forEach((entry, i) => {
      const startAngle = angleRef.current + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      const fillColor = colors[i % colors.length];
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDarkTheme ? '#ffffff22' : '#00000015';
      ctx.stroke();

      // Draw Text on slice
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // High contrast text color calculation
      ctx.fillStyle = paletteKey === 'pastel' ? '#18181b' : '#ffffff';
      const fontSize = Math.max(11, Math.min(18, 260 / entries.length));
      ctx.font = `bold ${fontSize}px sans-serif`;

      // Truncate long text
      const maxTextWidth = radius - 45;
      let text = entry.text;
      if (ctx.measureText(text).width > maxTextWidth) {
        while (text.length > 3 && ctx.measureText(text + '...').width > maxTextWidth) {
          text = text.slice(0, -1);
        }
        text += '...';
      }

      ctx.fillText(text, radius - 20, 0);
      ctx.restore();
    });

    // Outer Rim Border Ring (Adapts to theme)
    const rimColor = isDarkTheme ? '#18181b' : '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 8;
    ctx.strokeStyle = rimColor;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f0b90b';
    ctx.stroke();

    // Center Hub Circle Pin (Adapts to theme)
    const hubBg = isDarkTheme ? '#18181b' : '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    ctx.fillStyle = hubBg;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f0b90b';
    ctx.stroke();

    ctx.fillStyle = '#f0b90b';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', centerX, centerY);
  }, [entries, paletteKey, isDarkTheme]);

  // Guaranteed canvas draw on frame mount
  React.useEffect(() => {
    const id = requestAnimationFrame(() => {
      drawWheel();
    });
    return () => cancelAnimationFrame(id);
  }, [drawWheel]);

  // Synchronize bulk text with entry list updates
  const updateEntriesFromBulk = (text: string) => {
    setBulkInput(text);
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const newEntries = lines.map((line, idx) => ({
      id: `item-${idx}-${Date.now()}`,
      text: line,
    }));
    setEntries(newEntries);
  };

  const handleAddEntry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newEntryText.trim()) return;

    const newEntry: EntryItem = {
      id: `item-${Date.now()}`,
      text: newEntryText.trim(),
    };
    const updated = [...entries, newEntry];
    setEntries(updated);
    setBulkInput(updated.map((e) => e.text).join('\n'));
    setNewEntryText('');
    toast('Entry Added', `"${newEntryText.trim()}" added to wheel.`, 'success');
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    setBulkInput(updated.map((e) => e.text).join('\n'));
  };

  const handleShuffleEntries = () => {
    const shuffled = [...entries].sort(() => Math.random() - 0.5);
    setEntries(shuffled);
    setBulkInput(shuffled.map((e) => e.text).join('\n'));
    toast('Shuffled', 'Entries order shuffled randomly.', 'info');
  };

  const handleLoadPreset = (items: string[], presetName: string) => {
    const newEntries = items.map((text, idx) => ({
      id: `preset-${idx}-${Date.now()}`,
      text,
    }));
    setEntries(newEntries);
    setBulkInput(items.join('\n'));
    toast('Preset Loaded', `Loaded "${presetName}" preset.`, 'info');
  };

  // Physics Spin Animation Engine
  const spinWheel = () => {
    if (isSpinning || entries.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    const totalSpinTime = 4000 + Math.random() * 1500; // 4 - 5.5 seconds
    const extraRotations = (6 + Math.floor(Math.random() * 5)) * 2 * Math.PI; // 6 - 10 full turns
    const targetRandomOffset = Math.random() * 2 * Math.PI;
    const startAngle = angleRef.current;
    const targetAngle = startAngle + extraRotations + targetRandomOffset;

    let startTime: number | null = null;
    let lastSliceIndex = -1;

    const sliceAngle = (2 * Math.PI) / entries.length;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalSpinTime, 1);

      // Cubic Ease-Out Deceleration Curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      angleRef.current = startAngle + (targetAngle - startAngle) * easeOut;

      // Calculate current slice under pointer at 270 degrees (Top center point)
      const normalizedAngle =
        (1.5 * Math.PI - (angleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const currentSliceIndex = Math.floor(normalizedAngle / sliceAngle) % entries.length;

      if (currentSliceIndex !== lastSliceIndex) {
        playTickSound();
        lastSliceIndex = currentSliceIndex;
      }

      drawWheel();

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished
        setIsSpinning(false);
        const winningEntry = entries[currentSliceIndex];
        setWinner(winningEntry.text);
        setIsWinnerModalOpen(true);
        playVictorySound();

        // Add to history log
        setHistory((prev) => [
          {
            id: `hist-${Date.now()}`,
            winner: winningEntry.text,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);

        if (autoRemoveWinner) {
          handleDeleteEntry(winningEntry.id);
          toast('Winner Removed', `"${winningEntry.text}" removed from wheel.`, 'info');
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleRemoveWinnerAndClose = () => {
    if (winner) {
      const match = entries.find((e) => e.text === winner);
      if (match) {
        handleDeleteEntry(match.id);
      }
    }
    setIsWinnerModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center rounded-xl bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            {entries.length} Wheel Choices
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 mr-1.5 text-purple-500" />
            ) : (
              <VolumeX className="h-4 w-4 mr-1.5 text-zinc-400" />
            )}
            <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEntries([]);
              setBulkInput('');
              toast('Cleared', 'All wheel entries cleared.', 'info');
            }}
            className="rounded-xl text-zinc-500 hover:text-red-500 text-xs font-bold"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            <span>Clear All</span>
          </Button>
        </div>
      </div>

      {/* Main Wheel Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Canvas Wheel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-zinc-50/50 dark:border-zinc-800/80 dark:bg-zinc-900/40 p-6 md:p-8 relative min-h-[480px]">
          {/* Top Pointer Arrow */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-amber-400 drop-shadow-lg" />
          </div>

          {/* Interactive Canvas - Explicit Pixel Dimensions & Aspect Ratio */}
          <div
            onClick={spinWheel}
            className={`relative cursor-pointer transition-transform duration-300 my-4 ${
              isSpinning ? 'scale-105 pointer-events-none' : 'hover:scale-[1.02]'
            }`}
          >
            <canvas
              ref={canvasRef}
              width={420}
              height={420}
              className="w-[320px] sm:w-[400px] h-[320px] sm:h-[400px] aspect-square max-w-full rounded-full drop-shadow-2xl"
            />
          </div>

          {/* Spin Trigger Button */}
          <div className="mt-6 flex items-center justify-center space-x-3 w-full">
            <button
              disabled={isSpinning || entries.length === 0}
              onClick={spinWheel}
              className="h-11 px-8 rounded-xl font-black text-sm text-white bg-purple-600 hover:bg-purple-500 active:scale-95 transition-all shadow-md shadow-purple-600/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <Sparkles className={`h-4 w-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}</span>
            </button>

            <button
              disabled={isSpinning || entries.length === 0}
              onClick={handleShuffleEntries}
              className="h-11 w-11 rounded-xl font-bold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 flex items-center justify-center transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              title="Shuffle items order"
            >
              <Shuffle className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Controls, Entries & Presets Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Presets */}
          <div className="rounded-2xl border border-zinc-200/80 p-5 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center">
              <Wand2 className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handleLoadPreset(p.items, p.name)}
                  className="rounded-lg bg-zinc-200/80 text-zinc-900 hover:bg-purple-600 hover:text-white dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-purple-600 dark:hover:text-white px-3 py-1.5 text-xs font-bold transition-all border border-zinc-300/50 dark:border-zinc-700/60 shadow-sm cursor-pointer"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Palette & Settings */}
          <div className="rounded-2xl border border-zinc-200/80 p-5 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center">
                <Layers className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                Color Theme
              </span>
              <div className="w-36">
                <Select
                  value={paletteKey}
                  onChange={(e) => setPaletteKey(e.target.value as keyof typeof PALETTES)}
                  options={[
                    { label: 'Rainbow', value: 'rainbow' },
                    { label: 'Pastel', value: 'pastel' },
                    { label: 'Neon Synth', value: 'neon' },
                    { label: 'Binance Gold', value: 'binance' },
                    { label: 'Ocean Breeze', value: 'ocean' },
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
              <label
                htmlFor="auto-remove"
                className="text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                Auto-remove winner after spin
              </label>
              <input
                id="auto-remove"
                type="checkbox"
                checked={autoRemoveWinner}
                onChange={(e) => setAutoRemoveWinner(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Custom Entries Section */}
          <div className="rounded-2xl border border-zinc-200/80 p-5 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Wheel Choices ({entries.length})
              </span>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddEntry} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter choice name..."
                value={newEntryText}
                onChange={(e) => setNewEntryText(e.target.value)}
                className="rounded-xl text-xs font-medium bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              <Button
                type="submit"
                variant="primary"
                className="bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white px-4"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </form>

            {/* Bulk Textarea Editor */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Bulk Input (One choice per line)
              </label>
              <Textarea
                rows={5}
                value={bulkInput}
                onChange={(e) => updateEntriesFromBulk(e.target.value)}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                className="rounded-xl text-xs font-medium bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Spin History Log */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-zinc-200/80 p-5 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center">
                  <History className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                  Spin History ({history.length})
                </span>
                <button
                  onClick={() => setHistory([])}
                  className="text-[10px] font-bold text-zinc-400 hover:text-red-500"
                >
                  Clear History
                </button>
              </div>
              <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800/80 text-xs font-bold text-zinc-900 dark:text-zinc-100"
                  >
                    <span className="text-purple-600 dark:text-purple-400">{h.winner}</span>
                    <span className="text-[10px] text-zinc-400 font-normal">{h.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Winner Celebration Modal */}
      <Modal
        isOpen={isWinnerModalOpen}
        onClose={() => setIsWinnerModalOpen(false)}
        title="🎉 WE HAVE A WINNER!"
      >
        <div className="text-center py-6 space-y-6">
          <div className="inline-flex p-4 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <Trophy className="h-12 w-12 animate-bounce" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-purple-500">
              Selected Choice
            </span>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{winner}</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              variant="outline"
              onClick={handleRemoveWinnerAndClose}
              className="rounded-xl font-bold border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
            >
              <Trash2 className="h-4 w-4 mr-1.5 text-red-500" />
              Remove Winner & Close
            </Button>

            <Button
              variant="primary"
              onClick={() => {
                setIsWinnerModalOpen(false);
                spinWheel();
              }}
              className="bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl"
            >
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Spin Again
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
