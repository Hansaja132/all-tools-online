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
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';
export type TimerDirection = 'forward' | 'countdown';

export interface DurationUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const timeUnitsToSeconds = (units?: Partial<DurationUnits> | null): number => {
  if (!units) return 0;
  return (
    Math.max(0, units.days || 0) * 86400 +
    Math.max(0, units.hours || 0) * 3600 +
    Math.max(0, units.minutes || 0) * 60 +
    Math.max(0, units.seconds || 0)
  );
};

export const secondsToTimeUnits = (totalSeconds: number): DurationUnits => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(safe / 86400);
  const hours = Math.floor((safe % 86400) / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return { days, hours, minutes, seconds };
};

export const formatTimeParts = (totalSeconds: number) => {
  const { days, hours, minutes, seconds } = secondsToTimeUnits(totalSeconds);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const showDays = days > 0;
  return {
    days,
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    showDays,
    formatted: showDays
      ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    shortText: showDays
      ? `${days}d ${hours}h ${minutes}m`
      : hours > 0
      ? `${hours}h ${minutes}m ${pad(seconds)}s`
      : `${minutes}m ${pad(seconds)}s`,
  };
};

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
  // Config durations (days, hours, minutes, seconds)
  const [durations, setDurations] = React.useState<Record<TimerMode, DurationUnits>>({
    pomodoro: { days: 0, hours: 0, minutes: 25, seconds: 0 },
    shortBreak: { days: 0, hours: 0, minutes: 5, seconds: 0 },
    longBreak: { days: 0, hours: 0, minutes: 15, seconds: 0 },
  });

  const [timerDirection, setTimerDirection] = React.useState<TimerDirection>('forward');
  const [longBreakInterval, setLongBreakInterval] = React.useState(4);
  const [completedSessions, setCompletedSessions] = React.useState(0);
  const [mode, setMode] = React.useState<TimerMode>('pomodoro');
  const [currentTime, setCurrentTime] = React.useState<number>(0);
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

      const savedDirection = localStorage.getItem('focustimer_direction');
      if (savedDirection === 'forward' || savedDirection === 'countdown') {
        setTimerDirection(savedDirection as TimerDirection);
      }

      const savedDurations = localStorage.getItem('focustimer_durations');
      if (savedDurations) {
        const parsed = JSON.parse(savedDurations);
        if (typeof parsed.pomodoro === 'number') {
          // Legacy format stored in minutes
          const converted: Record<TimerMode, DurationUnits> = {
            pomodoro: { days: 0, hours: Math.floor(parsed.pomodoro / 60), minutes: parsed.pomodoro % 60, seconds: 0 },
            shortBreak: { days: 0, hours: Math.floor(parsed.shortBreak / 60), minutes: parsed.shortBreak % 60, seconds: 0 },
            longBreak: { days: 0, hours: Math.floor(parsed.longBreak / 60), minutes: parsed.longBreak % 60, seconds: 0 },
          };
          setDurations(converted);
        } else if (parsed.pomodoro && typeof parsed.pomodoro === 'object') {
          setDurations({
            pomodoro: {
              days: Number(parsed.pomodoro.days) || 0,
              hours: Number(parsed.pomodoro.hours) || 0,
              minutes: Number(parsed.pomodoro.minutes) || 0,
              seconds: Number(parsed.pomodoro.seconds) || 0,
            },
            shortBreak: {
              days: Number(parsed.shortBreak.days) || 0,
              hours: Number(parsed.shortBreak.hours) || 0,
              minutes: Number(parsed.shortBreak.minutes) || 0,
              seconds: Number(parsed.shortBreak.seconds) || 0,
            },
            longBreak: {
              days: Number(parsed.longBreak.days) || 0,
              hours: Number(parsed.longBreak.hours) || 0,
              minutes: Number(parsed.longBreak.minutes) || 0,
              seconds: Number(parsed.longBreak.seconds) || 0,
            },
          });
        }
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

  const targetSeconds = Math.max(1, timeUnitsToSeconds(durations[mode]));

  // Timer Tick effect
  React.useEffect(() => {
    let timer: any = null;

    if (isRunning) {
      timer = setInterval(() => {
        if (timerDirection === 'forward') {
          setCurrentTime((prev) => {
            const next = prev + 1;
            if (enableTicking) {
              playSound('tick', soundVolume * 0.3);
            }
            if (next >= targetSeconds) {
              handleTimerComplete();
              return targetSeconds;
            }
            return next;
          });
        } else {
          // countdown mode
          setCurrentTime((prev) => {
            if (prev <= 1) {
              handleTimerComplete();
              return 0;
            }
            if (enableTicking) {
              playSound('tick', soundVolume * 0.3);
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timerDirection, targetSeconds, enableTicking, soundVolume]);

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
    const newTarget = timeUnitsToSeconds(durations[newMode]);
    setCurrentTime(timerDirection === 'forward' ? 0 : newTarget);
  };

  // Reset timer
  const handleReset = () => {
    setIsRunning(false);
    setCurrentTime(timerDirection === 'forward' ? 0 : targetSeconds);
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

  // Start / Pause toggle
  const toggleStartPause = () => {
    if (!isRunning) {
      if (timerDirection === 'forward' && currentTime >= targetSeconds) {
        setCurrentTime(0);
      } else if (timerDirection === 'countdown' && currentTime <= 0) {
        setCurrentTime(targetSeconds);
      }
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  // Direction handler
  const handleDirectionChange = (newDir: TimerDirection) => {
    setTimerDirection(newDir);
    localStorage.setItem('focustimer_direction', newDir);
    setIsRunning(false);
    if (newDir === 'forward') {
      setCurrentTime(0);
    } else {
      setCurrentTime(targetSeconds);
    }
  };

  // Update specific unit in duration
  const updateDuration = (targetMode: TimerMode, field: keyof DurationUnits, val: number) => {
    const safeVal = Math.max(0, val);
    const updatedUnits: DurationUnits = {
      ...durations[targetMode],
      [field]: safeVal,
    };
    if (timeUnitsToSeconds(updatedUnits) < 1) {
      updatedUnits.seconds = 1;
    }
    const newDurations = {
      ...durations,
      [targetMode]: updatedUnits,
    };
    setDurations(newDurations);
    localStorage.setItem('focustimer_durations', JSON.stringify(newDurations));

    if (mode === targetMode && !isRunning) {
      const newTarget = timeUnitsToSeconds(updatedUnits);
      if (timerDirection === 'countdown') {
        setCurrentTime(newTarget);
      } else if (currentTime > newTarget) {
        setCurrentTime(0);
      }
    }
  };

  // Apply quick preset
  const applyPreset = (targetMode: TimerMode, units: DurationUnits) => {
    const newDurations = {
      ...durations,
      [targetMode]: units,
    };
    setDurations(newDurations);
    localStorage.setItem('focustimer_durations', JSON.stringify(newDurations));

    if (mode === targetMode && !isRunning) {
      const newTarget = timeUnitsToSeconds(units);
      if (timerDirection === 'countdown') {
        setCurrentTime(newTarget);
      } else {
        setCurrentTime(0);
      }
    }
  };

  // Listen for fullscreen change events (e.g. Esc key)
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Toggle fullscreen mode for the container
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // Calculate circular progress percentage
  const progressPercent =
    targetSeconds > 0
      ? timerDirection === 'forward'
        ? Math.min(100, (currentTime / targetSeconds) * 100)
        : Math.min(100, ((targetSeconds - currentTime) / targetSeconds) * 100)
      : 0;
  const strokeDashoffset = 565.48 - (565.48 * progressPercent) / 100; // 2 * PI * 90 = 565.48

  const timeDisplay = formatTimeParts(currentTime);
  const targetDisplay = formatTimeParts(targetSeconds);

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
    document.title = `${timeDisplay.formatted} - ${modeLabel} | MultiTools`;
  }, [timeDisplay.formatted, mode]);

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
      className={`relative w-full transition-all duration-700 font-sans text-white select-none ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen w-screen overflow-hidden'
          : 'min-h-[680px] rounded-2xl shadow-2xl overflow-hidden my-2'
      }`}
      style={bgStyle}
    >
      {/* Background Dark Overlay & Blur */}
      <div
        className="absolute inset-0 transition-all duration-300 pointer-events-none"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`,
          backdropFilter: `blur(${backdropBlur}px)`,
          WebkitBackdropFilter: `blur(${backdropBlur}px)`,
        }}
      />

      {/* Main Container Layout */}
      <div
        className={`relative z-10 flex flex-col justify-between ${
          isFullscreen
            ? 'h-screen w-screen overflow-hidden p-4 sm:p-6 lg:px-10 lg:py-5'
            : 'min-h-[680px] p-6 sm:p-10'
        }`}
      >
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
        <div
          className={`my-auto flex flex-col items-center justify-center text-center overflow-hidden ${
            isFullscreen ? 'py-1 sm:py-2' : 'py-6'
          }`}
        >
          {/* Mode Selector Tabs */}
          <div
            className={`inline-flex rounded-2xl bg-black/40 p-1.5 backdrop-blur-xl border border-white/15 shadow-inner transition-all duration-300 ${
              isFullscreen ? 'mb-3 sm:mb-4 scale-100 sm:scale-105' : 'mb-8'
            }`}
          >
            <button
              onClick={() => switchMode('pomodoro')}
              className={`flex items-center space-x-2 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
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
              className={`flex items-center space-x-2 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
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
              className={`flex items-center space-x-2 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
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
            <div
              className={`flex items-center space-x-2 rounded-full bg-white/10 px-4 py-1 backdrop-blur-md border border-white/20 font-medium text-teal-200 ${
                isFullscreen ? 'mb-3 sm:mb-4 text-xs sm:text-sm' : 'mb-6 text-xs'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
              <span className="truncate max-w-xs sm:max-w-md">{activeTask.text}</span>
            </div>
          )}

          {/* Circular Progress Ring & Timer Counter */}
          <div className="relative flex items-center justify-center my-1 sm:my-2">
            <svg
              viewBox="0 0 200 200"
              className={`-rotate-90 transform drop-shadow-2xl transition-all duration-500 ${
                isFullscreen
                  ? 'h-[min(48vh,480px)] w-[min(48vh,480px)] sm:h-[min(52vh,520px)] sm:w-[min(52vh,520px)]'
                  : 'h-72 w-72 sm:h-80 sm:w-80'
              }`}
            >
              {/* Background Ring */}
              <circle
                cx="100"
                cy="100"
                r="90"
                className="stroke-white/10 fill-none"
                strokeWidth="10"
              />
              {/* Foreground Animated Ring */}
              <circle
                cx="100"
                cy="100"
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
            <div
              className={`absolute flex flex-col items-center justify-center pointer-events-none px-4 ${
                isFullscreen ? 'max-w-[460px] sm:max-w-[560px]' : 'max-w-[260px] sm:max-w-[300px]'
              }`}
            >
              {/* Show Days Pill when days > 0 */}
              {(timeDisplay.showDays || targetDisplay.showDays) && (
                <div
                  className={`inline-flex items-center rounded-full bg-teal-500/25 border border-teal-400/40 text-teal-200 font-bold shadow-sm backdrop-blur-md ${
                    isFullscreen ? 'gap-2 px-3.5 py-0.5 text-xs sm:text-sm mb-1 sm:mb-1.5' : 'gap-1.5 px-3 py-0.5 text-xs mb-1'
                  }`}
                >
                  <Clock className={isFullscreen ? 'h-3.5 w-3.5 text-teal-300' : 'h-3 w-3 text-teal-300'} />
                  <span>
                    {timeDisplay.days} {timeDisplay.days === 1 ? 'Day' : 'Days'}
                    {targetDisplay.days > 0 && targetDisplay.days !== timeDisplay.days && ` / ${targetDisplay.days}d`}
                  </span>
                </div>
              )}

              {/* Main Digital Clock: Hours:Minutes:Seconds */}
              <div className="flex items-baseline justify-center font-mono font-black tracking-tight drop-shadow-2xl text-white">
                <span
                  className={`transition-all duration-300 ${
                    isFullscreen
                      ? 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'
                      : 'text-4xl sm:text-5xl lg:text-6xl'
                  }`}
                >
                  {timeDisplay.hours}:{timeDisplay.minutes}:{timeDisplay.seconds}
                </span>
              </div>

              {/* Monospace Unit Sublabels */}
              <div
                className={`flex items-center justify-center font-mono font-bold uppercase transition-all duration-300 ${
                  isFullscreen
                    ? 'gap-9 sm:gap-14 lg:gap-16 text-xs tracking-[0.25em] text-zinc-300/90 mt-0.5 sm:mt-1'
                    : 'gap-7 sm:gap-9 text-[10px] sm:text-xs tracking-widest text-zinc-300/80 mt-0.5'
                }`}
              >
                <span>Hours</span>
                <span>Mins</span>
                <span>Secs</span>
              </div>

              {/* Direction & Target Details */}
              <div className={`flex flex-col items-center gap-0.5 ${isFullscreen ? 'mt-2 sm:mt-3' : 'mt-2.5'}`}>
                <span
                  className={`uppercase font-bold text-zinc-200 ${
                    isFullscreen ? 'text-xs sm:text-sm tracking-[0.18em]' : 'text-xs tracking-widest'
                  }`}
                >
                  {mode === 'pomodoro' ? 'Focus Session' : mode === 'shortBreak' ? 'Rest & Recharge' : 'Long Break'}
                </span>
                <span
                  className={`font-medium text-teal-300/90 font-mono ${
                    isFullscreen ? 'text-xs' : 'text-[11px]'
                  }`}
                >
                  {timerDirection === 'forward' ? '▲ Forward' : '▼ Countdown'} &bull; Target: {targetDisplay.formatted}
                </span>
              </div>
            </div>
          </div>

          {/* Control Buttons (Play, Pause, Reset, Skip) */}
          <div className={`flex items-center space-x-4 ${isFullscreen ? 'mt-5 sm:mt-7' : 'mt-8'}`}>
            <button
              onClick={handleReset}
              className={`flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-white border border-white/15 active:scale-95 shadow-lg ${
                isFullscreen ? 'h-13 w-13 sm:h-14 sm:w-14' : 'h-12 w-12'
              }`}
              title="Reset Timer"
            >
              <RotateCcw className={isFullscreen ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-5 w-5'} />
            </button>

            <button
              onClick={toggleStartPause}
              className={`flex items-center justify-center space-x-2.5 rounded-2xl font-bold transition-all transform active:scale-95 shadow-xl ${
                isFullscreen ? 'h-16 sm:h-18 w-40 sm:w-44 text-lg sm:text-xl' : 'h-16 w-36 text-lg'
              } ${
                isRunning
                  ? 'bg-rose-500/90 hover:bg-rose-600 text-white shadow-rose-500/30'
                  : 'bg-teal-500 hover:bg-teal-400 text-white shadow-teal-500/40'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className={isFullscreen ? 'h-6 w-6 sm:h-7 sm:w-7 fill-current' : 'h-6 w-6 fill-current'} />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className={isFullscreen ? 'h-6 w-6 sm:h-7 sm:w-7 fill-current ml-1' : 'h-6 w-6 fill-current ml-1'} />
                  <span>START</span>
                </>
              )}
            </button>

            <button
              onClick={handleSkip}
              className={`flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-white border border-white/15 active:scale-95 shadow-lg ${
                isFullscreen ? 'h-13 w-13 sm:h-14 sm:w-14' : 'h-12 w-12'
              }`}
              title="Skip to Next Session"
            >
              <SkipForward className={isFullscreen ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-5 w-5'} />
            </button>
          </div>
        </div>

        {/* BOTTOM SETTINGS BAR & EXPANDABLE MENU */}
        <div className={`mt-auto pt-4 border-t border-white/10 ${isFullscreen ? 'w-full max-w-5xl mx-auto' : ''}`}>
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
            <div
              className={`rounded-2xl bg-zinc-950/95 p-5 backdrop-blur-2xl border border-white/20 shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-4 ${
                isFullscreen
                  ? 'absolute bottom-20 left-4 right-4 sm:left-10 sm:right-10 max-w-5xl mx-auto z-30 max-h-[62vh] overflow-y-auto custom-scrollbar'
                  : 'mt-3'
              }`}
            >
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
                  {/* Timer Direction Selector */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-teal-400" />
                        Timer Direction
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Choose whether the timer progresses forward or counts down
                      </p>
                    </div>
                    <div className="inline-flex rounded-xl bg-black/40 p-1 border border-white/15 self-start sm:self-auto">
                      <button
                        onClick={() => handleDirectionChange('forward')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          timerDirection === 'forward'
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                        <span>Count Forward (Up)</span>
                      </button>
                      <button
                        onClick={() => handleDirectionChange('countdown')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          timerDirection === 'countdown'
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                        <span>Count Down</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode Durations Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {/* Pomodoro Focus Card */}
                    <div className="rounded-xl bg-white/5 p-3.5 border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                          <Flame className="h-3.5 w-3.5 text-teal-400" />
                          Focus Session
                        </label>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-200 border border-teal-500/30">
                          {formatTimeParts(timeUnitsToSeconds(durations.pomodoro)).formatted}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-400 block text-center mb-0.5">Days</label>
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={durations.pomodoro.days}
                            onChange={(e) => updateDuration('pomodoro', 'days', parseInt(e.target.value) || 0)}
                            className="w-full text-center rounded-lg bg-black/40 border border-white/20 px-1 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-teal-400"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-400 block text-center mb-0.5">Hours</label>
                          <input
                            type="number"
                            min="0"
                            max="23"
                            value={durations.pomodoro.hours}
                            onChange={(e) => updateDuration('pomodoro', 'hours', parseInt(e.target.value) || 0)}
                            className="w-full text-center rounded-lg bg-black/40 border border-white/20 px-1 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-teal-400"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-400 block text-center mb-0.5">Mins</label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={durations.pomodoro.minutes}
                            onChange={(e) => updateDuration('pomodoro', 'minutes', parseInt(e.target.value) || 0)}
                            className="w-full text-center rounded-lg bg-black/40 border border-white/20 px-1 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-teal-400"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-400 block text-center mb-0.5">Secs</label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={durations.pomodoro.seconds}
                            onChange={(e) => updateDuration('pomodoro', 'seconds', parseInt(e.target.value) || 0)}
                            className="w-full text-center rounded-lg bg-black/40 border border-white/20 px-1 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-teal-400"
                          />
                        </div>
                      </div>

                      {/* Presets */}
                      <div className="pt-1 border-t border-white/10">
                        <div className="text-[10px] text-zinc-400 font-medium mb-1">Quick Presets:</div>
                        <div className="flex flex-wrap gap-1">
                          {[
                            { label: '30s Test', units: { days: 0, hours: 0, minutes: 0, seconds: 30 } },
                            { label: '15m', units: { days: 0, hours: 0, minutes: 15, seconds: 0 } },
                            { label: '25m', units: { days: 0, hours: 0, minutes: 25, seconds: 0 } },
                            { label: '45m', units: { days: 0, hours: 0, minutes: 45, seconds: 0 } },
                            { label: '1h', units: { days: 0, hours: 1, minutes: 0, seconds: 0 } },
                            { label: '2h', units: { days: 0, hours: 2, minutes: 0, seconds: 0 } },
                            { label: '1d', units: { days: 1, hours: 0, minutes: 0, seconds: 0 } },
                          ].map((p) => (
                            <button
                              key={p.label}
                              onClick={() => applyPreset('pomodoro', p.units)}
                              className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-colors"
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Short Break Card */}
                    <div className="rounded-xl bg-white/5 p-3.5 border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                          <Coffee className="h-3.5 w-3.5 text-sky-400" />
                          Short Break
                        </label>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-200 border border-sky-500/30">
                          {formatTimeParts(timeUnitsToSeconds(durations.shortBreak)).formatted}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-400 block text-center mb-0.5">Days</label>
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={durations.shortBreak.days}
                            onChange={(e) => updateDuration('shortBreak', 'days', parseInt(e.target.value) || 0)}
                            className="w-full text-center rounded-lg bg-black/40 border border-white/20 px-1 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-sky-400"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-400 block text-center mb-0.5">Hours</label>
                          <input
                            type="number"
                            min="0"
                            max="23"
                            value={durations.shortBreak.hours}
                            onChange={(e) => updateDuration('shortBreak', 'hours', parseInt(e.target.value) || 0)}
                            className="w-full text-center rounded-lg bg-black/40 border border-white/20 px-1 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-sky-400"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-400 block text-center mb-0.5">Mins</label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={durations.shortBreak.minutes}
                            onChange={(e) => updateDuration('shortBreak', 'minutes', parseInt(e.target.value) || 0)}
                            className="w-full text-center rounded-lg bg-black/40 border border-white/20 px-1 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-sky-400"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-400 block text-center mb-0.5">Secs</label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={durations.shortBreak.seconds}
                            onChange={(e) => updateDuration('shortBreak', 'seconds', parseInt(e.target.value) || 0)}
                            className="w-full text-center rounded-lg bg-black/40 border border-white/20 px-1 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-sky-400"
                          />
                        </div>
                      </div>

                      {/* Presets */}
                      <div className="pt-1 border-t border-white/10">
                        <div className="text-[10px] text-zinc-400 font-medium mb-1">Quick Presets:</div>
                        <div className="flex flex-wrap gap-1">
                          {[
                            { label: '3m', units: { days: 0, hours: 0, minutes: 3, seconds: 0 } },
                            { label: '5m', units: { days: 0, hours: 0, minutes: 5, seconds: 0 } },
                            { label: '10m', units: { days: 0, hours: 0, minutes: 10, seconds: 0 } },
                            { label: '15m', units: { days: 0, hours: 0, minutes: 15, seconds: 0 } },
                          ].map((p) => (
                            <button
                              key={p.label}
                              onClick={() => applyPreset('shortBreak', p.units)}
                              className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-colors"
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Long Break Card */}
                    <div className="rounded-xl bg-white/5 p-3.5 border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                          Long Break
                        </label>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                          {formatTimeParts(timeUnitsToSeconds(durations.longBreak)).formatted}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-400 block text-center mb-0.5">Days</label>
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={durations.longBreak.days}
                            onChange={(e) => updateDuration('longBreak', 'days', parseInt(e.target.value) || 0)}
                            className="w-full text-center rounded-lg bg-black/40 border border-white/20 px-1 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-400 block text-center mb-0.5">Hours</label>
                          <input
                            type="number"
                            min="0"
                            max="23"
                            value={durations.longBreak.hours}
                            onChange={(e) => updateDuration('longBreak', 'hours', parseInt(e.target.value) || 0)}
                            className="w-full text-center rounded-lg bg-black/40 border border-white/20 px-1 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-400 block text-center mb-0.5">Mins</label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={durations.longBreak.minutes}
                            onChange={(e) => updateDuration('longBreak', 'minutes', parseInt(e.target.value) || 0)}
                            className="w-full text-center rounded-lg bg-black/40 border border-white/20 px-1 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold text-zinc-400 block text-center mb-0.5">Secs</label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={durations.longBreak.seconds}
                            onChange={(e) => updateDuration('longBreak', 'seconds', parseInt(e.target.value) || 0)}
                            className="w-full text-center rounded-lg bg-black/40 border border-white/20 px-1 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                      </div>

                      {/* Presets */}
                      <div className="pt-1 border-t border-white/10">
                        <div className="text-[10px] text-zinc-400 font-medium mb-1">Quick Presets:</div>
                        <div className="flex flex-wrap gap-1">
                          {[
                            { label: '15m', units: { days: 0, hours: 0, minutes: 15, seconds: 0 } },
                            { label: '20m', units: { days: 0, hours: 0, minutes: 20, seconds: 0 } },
                            { label: '30m', units: { days: 0, hours: 0, minutes: 30, seconds: 0 } },
                            { label: '45m', units: { days: 0, hours: 0, minutes: 45, seconds: 0 } },
                            { label: '1h', units: { days: 0, hours: 1, minutes: 0, seconds: 0 } },
                          ].map((p) => (
                            <button
                              key={p.label}
                              onClick={() => applyPreset('longBreak', p.units)}
                              className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-colors"
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Intervals & Auto-start switches */}
                  <div className="flex flex-wrap items-center justify-between rounded-xl bg-white/5 p-3.5 border border-white/10 gap-3">
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
