import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('multi-tools-theme', theme);
    }
    set({ theme });
    get().initializeTheme();
  },
  initializeTheme: () => {
    if (typeof window === 'undefined') return;
    
    const theme = (localStorage.getItem('multi-tools-theme') as Theme) || 'system';
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    set({ theme });
  },
}));
