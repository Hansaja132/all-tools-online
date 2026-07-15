import { create } from 'zustand';

interface FavoritesState {
  favorites: string[]; // List of tool slugs or IDs
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => {
  const getInitialFavorites = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('multi-tools-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  return {
    favorites: getInitialFavorites(),
    toggleFavorite: (toolId) => {
      const current = get().favorites;
      const updated = current.includes(toolId)
        ? current.filter((id) => id !== toolId)
        : [...current, toolId];

      if (typeof window !== 'undefined') {
        localStorage.setItem('multi-tools-favorites', JSON.stringify(updated));
      }
      set({ favorites: updated });
    },
    isFavorite: (toolId) => get().favorites.includes(toolId),
  };
});
