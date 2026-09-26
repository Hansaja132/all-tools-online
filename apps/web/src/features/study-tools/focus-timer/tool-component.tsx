'use client';

import * as React from 'react';
import { Button, Input } from '@tools-website/ui';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  Maximize2,
  Minimize2,
  Sparkles,
  Sliders,
  Bell,
  SlidersHorizontal,
  Check,
  ChevronUp,
  ChevronDown,
  Layers,
  Flame,
  Coffee,
  Brain,
  Link as LinkIcon,
} from 'lucide-react';

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface WallpaperOption {
  id: string;
  name: string;
  category: 'lofi' | 'nature' | 'space' | 'gradients';
  type: 'image' | 'gradient';
  url?: string;
  gradient?: string;
  thumbnail?: string;
}

export const WALLPAPERS: WallpaperOption[] = [
  // Lo-Fi & Study Ambience
  {
    id: 'lofi-cafe',
    name: 'Cozy Lo-Fi Desk',
    category: 'lofi',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'rainy-window',
    name: 'Rainy Night View',
    category: 'lofi',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Neon Glow',
    category: 'lofi',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'library-nook',
    name: 'Quiet Library',
    category: 'lofi',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=300&q=80',
  },

  // Nature & Serenity
  {
    id: 'misty-forest',
    name: 'Misty Pine Forest',
    category: 'nature',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'mountain-twilight',
    name: 'Misty Mountain',
    category: 'nature',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'bamboo-zen',
    name: 'Ocean Sunset Horizon',
    category: 'nature',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
  },

  // Space & Cosmos
  {
    id: 'cosmic-nebula',
    name: 'Deep Cosmic Stars',
    category: 'space',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'aurora-borealis',
    name: 'Northern Lights',
    category: 'space',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=300&q=80',
  },

  // Aesthetic Dynamic Gradients
  {
    id: 'gradient-sunset',
    name: 'Sunset Twilight Glow',
    category: 'gradients',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #2d1b4e 0%, #1c1033 40%, #4a1942 70%, #892b55 100%)',
  },
  {
    id: 'gradient-midnight',
    name: 'Midnight Deep Cyan',
    category: 'gradients',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #0284c7 50%, #0369a1 100%)',
  },
  {
    id: 'gradient-emerald',
    name: 'Emerald Aurora Glow',
    category: 'gradients',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #022c22 40%, #115e59 100%)',
  },
  {
    id: 'gradient-cyberpunk',
    name: 'Neon Cyberpunk',
    category: 'gradients',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #3b0764 0%, #1e1b4b 40%, #831843 100%)',
  },
  {
    id: 'gradient-minimal-dark',
    name: 'Minimal Charcoal',
    category: 'gradients',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
  },
];

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

// Sound Web Audio API Synthesizer
const playSound = (soundType: string, volume: number = 0.8) => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    if (soundType === 'bell') {
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + idx * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 1.8);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 2);
      });
    } else if (soundType === 'gong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(146.83, ctx.currentTime); // D3
      osc.frequency.exponentialRampToValueAtTime(110.0, ctx.currentTime + 3);
      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 3.1);
    } else if (soundType === 'digital') {
      [0, 0.15, 0.3].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.08);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.09);
      });
    } else if (soundType === 'zen') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, ctx.currentTime);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 2.6);
    } else if (soundType === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    }
  } catch (e) {
    console.error('Audio playback error', e);
  }
};

export const FocusTimer: React.FC = () => {
  // Config durations (in minutes)
  const [durations, setDurations] = React.useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const [longBreakInterval, setLongBreakInterval] = React.useState(4);
  const [completedSessions, setCompletedSessions] = React.useState(0);
  const [mode, setMode] = React.useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = React.useState<number>(25 * 60);
  const [isRunning, setIsRunning] = React.useState(false);

  // Settings & Audio
  const [soundType, setSoundType] = React.useState('bell');
  const [soundVolume, setSoundVolume] = React.useState(0.8);
  const [enableTicking, setEnableTicking] = React.useState(false);
  const [autoStartBreaks, setAutoStartBreaks] = React.useState(false);
  const [autoStartPomodoro, setAutoStartPomodoro] = React.useState(false);

  // Wallpaper settings
  const [selectedWallpaperId, setSelectedWallpaperId] = React.useState<string>('lofi-cafe');
  const [customImageUrl, setCustomImageUrl] = React.useState<string>('');
  const [overlayOpacity, setOverlayOpacity] = React.useState<number>(45); // % overlay dark
  const [backdropBlur, setBackdropBlur] = React.useState<number>(4); // px blur

  // UI state
  const [activeTab, setActiveTab] = React.useState<'wallpaper' | 'durations' | 'sounds' | 'tasks' | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [wallpaperFilter, setWallpaperFilter] = React.useState<'all' | 'lofi' | 'nature' | 'space' | 'gradients' | 'custom'>('all');
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Tasks
  const [tasks, setTasks] = React.useState<TaskItem[]>([
    { id: '1', text: 'Deep Work Focus Session', completed: false },
  ]);
  const [newTaskText, setNewTaskText] = React.useState('');
  const [activeTaskId, setActiveTaskId] = React.useState<string>('1');

  // Load state from localStorage on mount
  React.useEffect(() => {
    try {
      const savedWallpaper = localStorage.getItem('focustimer_wallpaper');
      if (savedWallpaper) setSelectedWallpaperId(savedWallpaper);

      const savedCustomUrl = localStorage.getItem('focustimer_custom_url');
      if (savedCustomUrl) setCustomImageUrl(savedCustomUrl);

      const savedOpacity = localStorage.getItem('focustimer_opacity');
      if (savedOpacity) setOverlayOpacity(Number(savedOpacity));

      const savedBlur = localStorage.getItem('focustimer_blur');
      if (savedBlur) setBackdropBlur(Number(savedBlur));

      const savedDurations = localStorage.getItem('focustimer_durations');
      if (savedDurations) {
        const parsed = JSON.parse(savedDurations);
        setDurations(parsed);
        setTimeLeft(parsed.pomodoro * 60);
      }

      const savedSound = localStorage.getItem('focustimer_sound');
      if (savedSound) setSoundType(savedSound);

      const savedTasks = localStorage.getItem('focustimer_tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save changes to localStorage
  const saveWallpaper = (id: string) => {
    setSelectedWallpaperId(id);
    localStorage.setItem('focustimer_wallpaper', id);
  };

  const handleCustomUrlChange = (url: string) => {
    setCustomImageUrl(url);
    localStorage.setItem('focustimer_custom_url', url);
    setSelectedWallpaperId('custom');
  };

  const handleOpacityChange = (val: number) => {
    setOverlayOpacity(val);
    localStorage.setItem('focustimer_opacity', val.toString());
  };

  const handleBlurChange = (val: number) => {
    setBackdropBlur(val);
    localStorage.setItem('focustimer_blur', val.toString());
  };

  // Timer Tick effect
  React.useEffect(() => {
    let timer: any = null;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          if (enableTicking && (prev - 1) % 1 === 0) {
            playSound('tick', soundVolume * 0.3);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, enableTicking, soundVolume]);

  // Handle timer end
  const handleTimerComplete = () => {
    setIsRunning(false);
    playSound(soundType, soundVolume);

    if (mode === 'pomodoro') {
      const nextCount = completedSessions + 1;
      setCompletedSessions(nextCount);

      if (nextCount % longBreakInterval === 0) {
        switchMode('longBreak', autoStartBreaks);
      } else {
        switchMode('shortBreak', autoStartBreaks);
      }
    } else {
      switchMode('pomodoro', autoStartPomodoro);
    }
  };

  // Switch timer mode
  const switchMode = (newMode: TimerMode, startAuto: boolean = false) => {
    setMode(newMode);
    setIsRunning(startAuto);
    const targetMinutes = durations[newMode];
    setTimeLeft(targetMinutes * 60);
  };

  // Reset timer
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode] * 60);
  };

  // Skip current mode
  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      switchMode('shortBreak');
    } else {
      switchMode('pomodoro');
    }
  };

  // Toggle fullscreen mode for the container
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // Format time display MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate circular progress percentage
  const totalSeconds = durations[mode] * 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const strokeDashoffset = 565.48 - (565.48 * progressPercent) / 100; // 2 * PI * 90 = 565.48

  // Compute background styling
  const currentWallpaper = WALLPAPERS.find((w) => w.id === selectedWallpaperId);

  let bgStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
  };

  if (selectedWallpaperId === 'custom' && customImageUrl) {
    bgStyle = {
      backgroundImage: `url(${customImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  } else if (currentWallpaper) {
    if (currentWallpaper.type === 'gradient' && currentWallpaper.gradient) {
      bgStyle = { background: currentWallpaper.gradient };
    } else if (currentWallpaper.type === 'image' && currentWallpaper.url) {
      bgStyle = {
        backgroundImage: `url(${currentWallpaper.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
  }

  // Update browser document tab title
  React.useEffect(() => {
    const modeLabel = mode === 'pomodoro' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break';
    document.title = `${formatTime(timeLeft)} - ${modeLabel} | MultiTools`;
  }, [timeLeft, mode]);

  // Tasks handlers
  const addTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: TaskItem = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    setNewTaskText('');
    localStorage.setItem('focustimer_tasks', JSON.stringify(updated));
    if (!activeTaskId) setActiveTaskId(newTask.id);
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    localStorage.setItem('focustimer_tasks', JSON.stringify(updated));
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    localStorage.setItem('focustimer_tasks', JSON.stringify(updated));
    if (activeTaskId === id) {
      setActiveTaskId(updated.length > 0 ? updated[0].id : '');
    }
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  // Filter wallpapers by category
  const filteredWallpapers = WALLPAPERS.filter(
    (w) => wallpaperFilter === 'all' || w.category === wallpaperFilter
  );

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[680px] w-full overflow-hidden rounded-2xl shadow-2xl transition-all duration-700 font-sans text-white select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'my-2'
      }`}
      style={bgStyle}
    >
      {/* Background Dark Overlay & Blur */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`,
          backdropFilter: `blur(${backdropBlur}px)`,
          WebkitBackdropFilter: `blur(${backdropBlur}px)`,
        }}
      />

      {/* Main Container Layout */}
      <div className="relative z-10 flex flex-col justify-between min-h-[680px] p-6 sm:p-10">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 backdrop-blur-md border border-teal-400/30 text-teal-300">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Focus Timer
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/30 border border-teal-400/40 text-teal-200 font-medium">
                  Study Tools
                </span>
              </h2>
              <p className="text-xs text-zinc-300">
                Session {completedSessions + 1} &bull; {completedSessions} Pomodoros Completed Today
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Audio Toggle Quick Button */}
            <button
              onClick={() => setSoundVolume(soundVolume > 0 ? 0 : 0.8)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white border border-white/10"
              title={soundVolume > 0 ? 'Mute Audio' : 'Unmute Audio'}
            >
              {soundVolume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-rose-400" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white border border-white/10"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Focus'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Center Timer Section */}
        <div className="my-auto flex flex-col items-center justify-center text-center py-6">
          {/* Mode Selector Tabs */}
          <div className="inline-flex rounded-2xl bg-black/40 p-1.5 backdrop-blur-xl border border-white/15 mb-8 shadow-inner">
            <button
              onClick={() => switchMode('pomodoro')}
              className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                mode === 'pomodoro'
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-105'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Flame className="h-4 w-4" />
              <span>Pomodoro</span>
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                mode === 'shortBreak'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Coffee className="h-4 w-4" />
              <span>Short Break</span>
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                mode === 'longBreak'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Long Break</span>
            </button>
          </div>

          {/* Active Goal / Task Banner */}
          {activeTask && (
            <div className="mb-6 flex items-center space-x-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md border border-white/20 text-xs font-medium text-teal-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
              <span className="truncate max-w-xs">{activeTask.text}</span>
            </div>
          )}

          {/* Circular Progress Ring & Timer Counter */}
          <div className="relative flex items-center justify-center my-2">
            <svg className="h-72 w-72 sm:h-80 sm:w-80 -rotate-90 transform drop-shadow-2xl">
              {/* Background Ring */}
              <circle
                cx="50%"
                cy="50%"
                r="90"
                className="stroke-white/10 fill-none"
                strokeWidth="10"
              />
              {/* Foreground Animated Ring */}
              <circle
                cx="50%"
                cy="50%"
                r="90"
                className={`fill-none transition-all duration-500 ${
                  mode === 'pomodoro'
                    ? 'stroke-teal-400'
                    : mode === 'shortBreak'
                    ? 'stroke-sky-400'
                    : 'stroke-indigo-400'
                }`}
                strokeWidth="10"
                strokeDasharray="565.48"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Time Text Display */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-6xl sm:text-7xl font-black tracking-tight drop-shadow-md font-mono">
                {formatTime(timeLeft)}
              </span>
              <span className="mt-2 text-xs uppercase tracking-widest text-zinc-300 font-semibold">
                {mode === 'pomodoro' ? 'Focus Session' : mode === 'shortBreak' ? 'Rest & Recharge' : 'Long Break'}
              </span>
            </div>
          </div>

          {/* Control Buttons (Play, Pause, Reset, Skip) */}
          <div className="mt-8 flex items-center space-x-4">
            <button
              onClick={handleReset}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-white border border-white/15 active:scale-95 shadow-lg"
              title="Reset Timer"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex h-16 w-36 items-center justify-center space-x-2 rounded-2xl font-bold text-lg transition-all transform active:scale-95 shadow-xl ${
                isRunning
                  ? 'bg-rose-500/90 hover:bg-rose-600 text-white shadow-rose-500/30'
                  : 'bg-teal-500 hover:bg-teal-400 text-white shadow-teal-500/40'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-6 w-6 fill-current" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="h-6 w-6 fill-current ml-1" />
                  <span>START</span>
                </>
              )}
            </button>

            <button
              onClick={handleSkip}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-white border border-white/15 active:scale-95 shadow-lg"
              title="Skip to Next Session"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* BOTTOM SETTINGS BAR & EXPANDABLE MENU */}
        <div className="mt-auto pt-4 border-t border-white/10">
          {/* Bottom Dock Control Bar */}
          <div className="flex items-center justify-between rounded-2xl bg-black/50 p-2 backdrop-blur-2xl border border-white/15 shadow-2xl">
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Wallpaper Menu Button */}
              <button
                onClick={() => {
                  if (activeTab === 'wallpaper' && isSettingsOpen) {
                    setIsSettingsOpen(false);
                  } else {
                    setActiveTab('wallpaper');
                    setIsSettingsOpen(true);
                  }
                }}
                className={`flex items-center space-x-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                  isSettingsOpen && activeTab === 'wallpaper'
                    ? 'bg-teal-500/30 text-teal-300 border border-teal-400/40'
                    : 'text-zinc-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ImageIcon className="h-4 w-4 text-teal-400" />
                <span className="hidden sm:inline">Wallpaper</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 max-w-[80px] truncate hidden md:inline">
                  {selectedWallpaperId === 'custom'
                    ? 'Custom'
                    : currentWallpaper?.name || 'Wallpaper'}
                </span>
              </button>

              {/* Durations Menu Button */}
              <button
                onClick={() => {
                  if (activeTab === 'durations' && isSettingsOpen) {
                    setIsSettingsOpen(false);
                  } else {
                    setActiveTab('durations');
                    setIsSettingsOpen(true);
                  }
                }}
                className={`flex items-center space-x-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                  isSettingsOpen && activeTab === 'durations'
                    ? 'bg-sky-500/30 text-sky-300 border border-sky-400/40'
                    : 'text-zinc-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Clock className="h-4 w-4 text-sky-400" />
                <span className="hidden sm:inline">Timer Times</span>
              </button>

              {/* Sound Menu Button */}
              <button
                onClick={() => {
                  if (activeTab === 'sounds' && isSettingsOpen) {
                    setIsSettingsOpen(false);
                  } else {
                    setActiveTab('sounds');
                    setIsSettingsOpen(true);
                  }
                }}
                className={`flex items-center space-x-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                  isSettingsOpen && activeTab === 'sounds'
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                    : 'text-zinc-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Bell className="h-4 w-4 text-amber-400" />
                <span className="hidden sm:inline">Sounds</span>
              </button>

              {/* Tasks Button */}
              <button
                onClick={() => {
                  if (activeTab === 'tasks' && isSettingsOpen) {
                    setIsSettingsOpen(false);
                  } else {
                    setActiveTab('tasks');
                    setIsSettingsOpen(true);
                  }
                }}
                className={`flex items-center space-x-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                  isSettingsOpen && activeTab === 'tasks'
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-400/40'
                    : 'text-zinc-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-purple-400" />
                <span className="hidden sm:inline">Tasks</span>
                {tasks.length > 0 && (
                  <span className="rounded-full bg-purple-500/40 px-1.5 py-0.2 text-[10px] font-bold text-purple-200">
                    {tasks.length}
                  </span>
                )}
              </button>
            </div>

            {/* Toggle Full Settings Menu */}
            <button
              onClick={() => {
                if (!isSettingsOpen) {
                  setActiveTab('wallpaper');
                }
                setIsSettingsOpen(!isSettingsOpen);
              }}
              className="flex items-center space-x-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs sm:text-sm font-semibold transition-all border border-white/15"
            >
              <SlidersHorizontal className="h-4 w-4 text-teal-400" />
              <span>Settings</span>
              {isSettingsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
          </div>

          {/* Bottom Sliding Settings Panel */}
          {isSettingsOpen && (
            <div className="mt-3 rounded-2xl bg-zinc-950/90 p-5 backdrop-blur-2xl border border-white/20 shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-4">
              {/* Tab Navigation inside Panel */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('wallpaper')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'wallpaper'
                        ? 'bg-teal-500 text-white shadow'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    🎨 Wallpaper Gallery
                  </button>
                  <button
                    onClick={() => setActiveTab('durations')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'durations'
                        ? 'bg-teal-500 text-white shadow'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    ⏱️ Durations
                  </button>
                  <button
                    onClick={() => setActiveTab('sounds')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'sounds'
                        ? 'bg-teal-500 text-white shadow'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    🔔 Audio & Alerts
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'tasks'
                        ? 'bg-teal-500 text-white shadow'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    📋 Task List
                  </button>
                </div>

                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Close &times;
                </button>
              </div>

              {/* TAB 1: WALLPAPER SELECTOR */}
              {activeTab === 'wallpaper' && (
                <div className="space-y-4">
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(['all', 'lofi', 'nature', 'space', 'gradients', 'custom'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setWallpaperFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs capitalize font-medium transition-all ${
                          wallpaperFilter === cat
                            ? 'bg-white/20 text-white border border-white/30 font-bold'
                            : 'text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Wallpaper Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-56 overflow-y-auto p-1 custom-scrollbar">
                    {filteredWallpapers.map((wp) => (
                      <div
                        key={wp.id}
                        onClick={() => saveWallpaper(wp.id)}
                        className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                          selectedWallpaperId === wp.id
                            ? 'border-teal-400 ring-2 ring-teal-400/50 scale-95 shadow-lg'
                            : 'border-white/10 hover:border-white/40'
                        }`}
                      >
                        {wp.type === 'gradient' ? (
                          <div
                            className="h-20 w-full"
                            style={{ background: wp.gradient }}
                          />
                        ) : (
                          <img
                            src={wp.thumbnail || wp.url}
                            alt={wp.name}
                            className="h-20 w-full object-cover transition-transform group-hover:scale-110"
                          />
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 backdrop-blur-xs text-center">
                          <span className="text-[10px] font-medium text-white truncate block">
                            {wp.name}
                          </span>
                        </div>
                        {selectedWallpaperId === wp.id && (
                          <div className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-white shadow">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Custom Image URL Option */}
                  {(wallpaperFilter === 'all' || wallpaperFilter === 'custom') && (
                    <div className="rounded-xl bg-white/5 p-3 border border-white/10 space-y-2">
                      <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                        <LinkIcon className="h-3.5 w-3.5 text-teal-400" />
                        Custom Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={customImageUrl}
                          onChange={(e) => handleCustomUrlChange(e.target.value)}
                          className="flex-1 rounded-lg bg-black/40 border border-white/20 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-teal-400"
                        />
                        <button
                          onClick={() => {
                            if (customImageUrl) saveWallpaper('custom');
                          }}
                          className="rounded-lg bg-teal-500 hover:bg-teal-400 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Overlay Controls (Darkness & Blur) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-white/5 p-3 border border-white/10">
                    <div>
                      <div className="flex justify-between text-xs text-zinc-300 mb-1 font-medium">
                        <span>Background Dim (Overlay)</span>
                        <span className="text-teal-400">{overlayOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        value={overlayOpacity}
                        onChange={(e) => handleOpacityChange(Number(e.target.value))}
                        className="w-full accent-teal-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-zinc-300 mb-1 font-medium">
                        <span>Backdrop Blur</span>
                        <span className="text-teal-400">{backdropBlur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={backdropBlur}
                        onChange={(e) => handleBlurChange(Number(e.target.value))}
                        className="w-full accent-teal-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TIMER DURATIONS */}
              {activeTab === 'durations' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                      <label className="text-xs font-semibold text-teal-300 block mb-1">
                        Pomodoro (minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={durations.pomodoro}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value));
                          const newDur = { ...durations, pomodoro: val };
                          setDurations(newDur);
                          localStorage.setItem('focustimer_durations', JSON.stringify(newDur));
                          if (mode === 'pomodoro' && !isRunning) setTimeLeft(val * 60);
                        }}
                        className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-teal-400"
                      />
                    </div>

                    <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                      <label className="text-xs font-semibold text-sky-300 block mb-1">
                        Short Break (minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={durations.shortBreak}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value));
                          const newDur = { ...durations, shortBreak: val };
                          setDurations(newDur);
                          localStorage.setItem('focustimer_durations', JSON.stringify(newDur));
                          if (mode === 'shortBreak' && !isRunning) setTimeLeft(val * 60);
                        }}
                        className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                      <label className="text-xs font-semibold text-indigo-300 block mb-1">
                        Long Break (minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={durations.longBreak}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value));
                          const newDur = { ...durations, longBreak: val };
                          setDurations(newDur);
                          localStorage.setItem('focustimer_durations', JSON.stringify(newDur));
                          if (mode === 'longBreak' && !isRunning) setTimeLeft(val * 60);
                        }}
                        className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between rounded-xl bg-white/5 p-3 border border-white/10 gap-3">
                    <div className="flex items-center space-x-2">
                      <label className="text-xs text-zinc-300 font-medium">Long Break Interval:</label>
                      <select
                        value={longBreakInterval}
                        onChange={(e) => setLongBreakInterval(Number(e.target.value))}
                        className="rounded-lg bg-black/40 border border-white/20 px-2 py-1 text-xs text-white focus:outline-none focus:border-teal-400"
                      >
                        <option value={2}>Every 2 sessions</option>
                        <option value={3}>Every 3 sessions</option>
                        <option value={4}>Every 4 sessions</option>
                        <option value={5}>Every 5 sessions</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer text-xs text-zinc-300">
                        <input
                          type="checkbox"
                          checked={autoStartBreaks}
                          onChange={(e) => setAutoStartBreaks(e.target.checked)}
                          className="rounded accent-teal-400"
                        />
                        <span>Auto-start Breaks</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer text-xs text-zinc-300">
                        <input
                          type="checkbox"
                          checked={autoStartPomodoro}
                          onChange={(e) => setAutoStartPomodoro(e.target.checked)}
                          className="rounded accent-teal-400"
                        />
                        <span>Auto-start Pomodoros</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: AUDIO & ALERTS */}
              {activeTab === 'sounds' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/5 p-3 border border-white/10 space-y-2">
                      <label className="text-xs font-semibold text-zinc-300 block">
                        Alarm Sound Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'bell', label: 'Gentle Bell' },
                          { id: 'gong', label: 'Zen Gong' },
                          { id: 'digital', label: 'Digital Beep' },
                          { id: 'zen', label: 'Singing Bowl' },
                        ].map((s) => (
                          <button
                            key={s.id}
                            onClick={() => {
                              setSoundType(s.id);
                              localStorage.setItem('focustimer_sound', s.id);
                              playSound(s.id, soundVolume);
                            }}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              soundType === s.id
                                ? 'bg-teal-500 text-white font-bold shadow'
                                : 'bg-black/30 text-zinc-300 hover:bg-white/10'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/5 p-3 border border-white/10 space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-zinc-300 mb-1 font-medium">
                          <span>Sound Volume</span>
                          <span className="text-teal-400">{Math.round(soundVolume * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={soundVolume}
                          onChange={(e) => setSoundVolume(Number(e.target.value))}
                          className="w-full accent-teal-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center space-x-2 cursor-pointer text-xs text-zinc-300">
                          <input
                            type="checkbox"
                            checked={enableTicking}
                            onChange={(e) => setEnableTicking(e.target.checked)}
                            className="rounded accent-teal-400"
                          />
                          <span>Soft Ticking Sound</span>
                        </label>

                        <button
                          onClick={() => playSound(soundType, soundVolume)}
                          className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-teal-300 font-semibold"
                        >
                          Test Sound
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TASK LIST */}
              {activeTab === 'tasks' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a study goal or task for this session..."
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addTask();
                      }}
                      className="flex-1 rounded-xl bg-black/40 border border-white/20 px-3.5 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-teal-400"
                    />
                    <button
                      onClick={addTask}
                      className="flex items-center space-x-1 rounded-xl bg-teal-500 hover:bg-teal-400 px-4 py-2 text-xs font-semibold text-white transition-colors shadow"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {tasks.length === 0 ? (
                      <p className="text-center text-xs text-zinc-500 py-4">
                        No tasks added yet. Create one to focus on during your study timer!
                      </p>
                    ) : (
                      tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center justify-between rounded-xl p-2.5 border transition-all ${
                            activeTaskId === task.id
                              ? 'bg-teal-500/20 border-teal-400/50 text-white'
                              : 'bg-white/5 border-white/10 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`flex h-4 w-4 items-center justify-center rounded transition-colors ${
                                task.completed
                                  ? 'bg-teal-500 text-white'
                                  : 'border border-white/40 hover:border-teal-400'
                              }`}
                            >
                              {task.completed && <Check className="h-3 w-3" />}
                            </button>

                            <span
                              onClick={() => setActiveTaskId(task.id)}
                              className={`text-xs cursor-pointer truncate ${
                                task.completed ? 'line-through text-zinc-500' : ''
                              }`}
                            >
                              {task.text}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            {activeTaskId !== task.id && (
                              <button
                                onClick={() => setActiveTaskId(task.id)}
                                className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-teal-300 hover:bg-white/20"
                              >
                                Set Active
                              </button>
                            )}
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
