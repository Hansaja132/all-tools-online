import { create } from 'zustand';

interface SearchState {
  query: string;
  categoryFilter: string | null;
  setQuery: (query: string) => void;
  setCategoryFilter: (category: string | null) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  categoryFilter: null,
  setQuery: (query) => set({ query }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  reset: () => set({ query: '', categoryFilter: null }),
}));
