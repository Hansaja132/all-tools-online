'use client';

import * as React from 'react';
import { Button, Input, Modal, useToast } from '@tools-website/ui';
import {
  Sparkles,
  BookOpen,
  Lightbulb,
  Plus,
  Trash2,
  Calendar,
  Share2,
  Check,
  Clipboard,
  ChevronRight,
  Search,
  RotateCcw,
  Wand2,
  Coins,
} from 'lucide-react';
import { WodlTheme, FilterState, CandidateWord } from './types';
import { PRE_SEEDED_THEMES, getCandidateWordsForLength } from './word-database';
import { filterWords } from './filter-engine';
import { WeeklyInfoCard } from './components/weekly-info-card';
import { FilterControls } from './components/filter-controls';
import { CandidateGrid } from './components/candidate-grid';

export const BinanceWodl: React.FC = () => {
  const { toast } = useToast();

  // Themes database & active theme
  const [themes, setThemes] = React.useState<WodlTheme[]>(PRE_SEEDED_THEMES);
  const [selectedThemeId, setSelectedThemeId] = React.useState<string>(
    PRE_SEEDED_THEMES[0].id
  );

  // View Navigation: 'filter' (Advanced Word Finder) or 'archive' (Themes & Word Lists)
  const [activeTab, setActiveTab] = React.useState<'filter' | 'archive'>('filter');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isGuideOpen, setIsGuideOpen] = React.useState(false);

  // Copied word tracker
  const [copiedWord, setCopiedWord] = React.useState<string | null>(null);

  // ── FILTER STATE (Single Source of Truth) ───────────────────────────
  const [filters, setFilters] = React.useState<FilterState>({
    wordLength: 6,
    positionedLetters: Array(6).fill(''),
    requiredLetters: '',
    excludedLetters: '',
  });

  // ── ARCHIVE VIEW STATE ──────────────────────────────────────────────
  const [archiveSearch, setArchiveSearch] = React.useState('');
  const [archiveLengthTab, setArchiveLengthTab] = React.useState<string>('All');

  // ── ADD THEME FORM STATE ────────────────────────────────────────────
  const [newThemeName, setNewThemeName] = React.useState('');
  const [newWeekRange, setNewWeekRange] = React.useState('');
  const [newCategoryTag, setNewCategoryTag] = React.useState('Custom');
  const [newWords3, setNewWords3] = React.useState('');
  const [newWords4, setNewWords4] = React.useState('');
  const [newWords5, setNewWords5] = React.useState('');
  const [newWords6, setNewWords6] = React.useState('');
  const [newWords7, setNewWords7] = React.useState('');
  const [newWords8, setNewWords8] = React.useState('');

  // Load custom themes from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('binance-wodl-themes');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as WodlTheme[];
        const custom = parsed.filter((t) => t.isCustom);
        const combined = [...custom, ...PRE_SEEDED_THEMES];
        setThemes(combined);
        setSelectedThemeId(combined[0]?.id || PRE_SEEDED_THEMES[0].id);
      } catch (e) {
        setThemes(PRE_SEEDED_THEMES);
        setSelectedThemeId(PRE_SEEDED_THEMES[0].id);
      }
    }
  }, []);

  // Active theme object
  const activeTheme = React.useMemo(() => {
    return themes.find((t) => t.id === selectedThemeId) || themes[0];
  }, [themes, selectedThemeId]);

  // ── CANDIDATE WORDS & FILTERING ENGINE ──────────────────────────────
  // 1. Get candidate pool for current word length
  const rawCandidates = React.useMemo(() => {
    return getCandidateWordsForLength(filters.wordLength, activeTheme, themes);
  }, [filters.wordLength, activeTheme, themes]);

  // 2. Real-time deterministic pure filtering pipeline
  const filteredCandidates = React.useMemo(() => {
    return filterWords(rawCandidates, filters);
  }, [rawCandidates, filters]);

  // Handle Copy Word
  const handleCopyWord = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    toast('Copied!', `"${word}" copied to clipboard.`, 'success');
    setTimeout(() => setCopiedWord(null), 2000);
  };

  // Reset all filters to default initial state
  const handleResetAllFilters = () => {
    setFilters({
      wordLength: 6,
      positionedLetters: Array(6).fill(''),
      requiredLetters: '',
      excludedLetters: '',
    });
    toast('Filters Cleared', 'Reset all criteria to initial 6-letter state.', 'info');
  };

  // ── ARCHIVE VIEW HANDLERS ───────────────────────────────────────────
  const filteredThemes = React.useMemo(() => {
    const q = archiveSearch.toLowerCase().trim();
    if (!q) return themes;
    return themes.filter(
      (t) =>
        t.theme.toLowerCase().includes(q) ||
        t.weekRange.toLowerCase().includes(q) ||
        (t.categoryTag && t.categoryTag.toLowerCase().includes(q)) ||
        Object.values(t.words)
          .flat()
          .some((w) => w.toLowerCase().includes(q))
    );
  }, [themes, archiveSearch]);

  const handleCopyAllThemeWords = (theme: WodlTheme) => {
    let allWords: string[] = [];
    if (archiveLengthTab === 'All') {
      allWords = Object.values(theme.words).flat();
    } else {
      const lenKey = Number(archiveLengthTab) as 3 | 4 | 5 | 6 | 7 | 8;
      allWords = theme.words[lenKey] || [];
    }

    if (allWords.length === 0) {
      toast('No Words', 'No words in current selection.', 'info');
      return;
    }

    const textToCopy = `Binance WODL (${theme.theme}): ${allWords.join(', ')}`;
    navigator.clipboard.writeText(textToCopy);
    toast('Copied Theme Words', `Copied ${allWords.length} words to clipboard.`, 'success');
  };

  const handleDeleteTheme = (id: string, name: string) => {
    const updated = themes.filter((t) => t.id !== id);
    setThemes(updated);
    const customOnly = updated.filter((t) => t.isCustom);
    localStorage.setItem('binance-wodl-themes', JSON.stringify(customOnly));
    toast('Theme Deleted', `"${name}" removed.`, 'info');

    if (selectedThemeId === id) {
      setSelectedThemeId(updated.length > 0 ? updated[0].id : PRE_SEEDED_THEMES[0].id);
    }
  };

  const handleResetToDefaultThemes = () => {
    if (confirm('Reset to default themes database?')) {
      localStorage.removeItem('binance-wodl-themes');
      setThemes(PRE_SEEDED_THEMES);
      setSelectedThemeId(PRE_SEEDED_THEMES[0].id);
      toast('Restored Defaults', 'Default theme database restored.', 'info');
    }
  };

  // Add Theme Form Submit
  const handleAddThemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThemeName.trim()) {
      toast('Error', 'Theme name is required.', 'error');
      return;
    }

    const parseWords = (input: string) =>
      input
        .split(/[,\s]+/)
        .map((w) => w.trim().toUpperCase())
        .filter((w) => w.length > 0);

    const customTheme: WodlTheme = {
      id: `custom-${Date.now()}`,
      theme: newThemeName.trim(),
      weekRange: newWeekRange.trim() || `Week of ${new Date().toLocaleDateString()}`,
      categoryTag: newCategoryTag.trim() || 'Custom',
      words: {
        3: parseWords(newWords3),
        4: parseWords(newWords4),
        5: parseWords(newWords5),
        6: parseWords(newWords6),
        7: parseWords(newWords7),
        8: parseWords(newWords8),
      },
      isCustom: true,
    };

    const updatedThemes = [customTheme, ...themes];
    setThemes(updatedThemes);

    const customOnly = updatedThemes.filter((t) => t.isCustom);
    localStorage.setItem('binance-wodl-themes', JSON.stringify(customOnly));

    setSelectedThemeId(customTheme.id);
    setIsAddModalOpen(false);
    toast('Theme Added', `"${newThemeName}" added.`, 'success');

    setNewThemeName('');
    setNewWeekRange('');
    setNewCategoryTag('Custom');
    setNewWords3('');
    setNewWords4('');
    setNewWords5('');
    setNewWords6('');
    setNewWords7('');
    setNewWords8('');
  };

  const handlePreFillSample = () => {
    setNewThemeName('Web3 Gaming & Metaverse');
    setNewWeekRange('Sep 01, 2026 - Sep 07, 2026');
    setNewCategoryTag('Gaming');
    setNewWords3('NFT, P2E, MAN');
    setNewWords4('GAME, HERO, LAND, COIN');
    setNewWords5('GUILD, ASSET, ARENA, TOKEN');
    setNewWords6('AVATAR, PLAYER, ENGAGE, REWARD');
    setNewWords7('VIRTUAL, CREATOR, GAMING');
    setNewWords8('METAVERSE, PROTOCOL, INDUSTRY');
    toast('Sample Loaded', 'Pre-filled sample fields.', 'info');
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-sans text-zinc-900 dark:text-zinc-100">
      {/* ── Top Header Navigation Bar ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('filter')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all inline-flex items-center gap-2 shrink-0 ${
              activeTab === 'filter'
                ? 'bg-white dark:bg-zinc-700 text-amber-600 dark:text-amber-400 shadow-sm border border-zinc-200/80 dark:border-zinc-600/50'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Advanced Filter</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('archive')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all inline-flex items-center gap-2 shrink-0 ${
              activeTab === 'archive'
                ? 'bg-white dark:bg-zinc-700 text-amber-600 dark:text-amber-400 shadow-sm border border-zinc-200/80 dark:border-zinc-600/50'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <BookOpen className="h-4 w-4 text-amber-500" />
            <span>Weekly Archive</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGuideOpen(true)}
            className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 rounded-xl border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 px-3 sm:px-4 py-2"
          >
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span>How to Win</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-xl flex items-center gap-1.5 px-3 sm:px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Theme</span>
          </Button>
        </div>
      </div>

      {/* ── VIEW 1: ADVANCED WORD FILTER (Main) ───────────────────── */}
      {activeTab === 'filter' ? (
        <div className="space-y-6">
          {/* Header section required by reference */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 font-black text-lg shadow-md shadow-amber-500/20">
                ₿
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Binance WODL Advanced Filter
              </h1>
            </div>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
              Solve Binance WODL puzzles faster
            </p>
            <p className="max-w-3xl text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Enter what you already know - letters in the right spot, letters in the wrong spot, and letters ruled out - and the filter narrows this week&apos;s word list down to the possible answers, from 3-letter up to 8-letter words.
            </p>
          </div>

          {/* Weekly Information Card */}
          <WeeklyInfoCard
            activeTheme={activeTheme}
            allThemes={themes}
            onSelectTheme={(id) => setSelectedThemeId(id)}
          />

          {/* Main 2-Column Content Layout (Filters | Results) */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Left Column: Filters (5 cols on lg) */}
            <div className="lg:col-span-5">
              <FilterControls
                filters={filters}
                onFilterChange={setFilters}
                onResetAll={handleResetAllFilters}
              />
            </div>

            {/* Right Column: Possible Words Grid (7 cols on lg) */}
            <div className="lg:col-span-7">
              <CandidateGrid
                wordLength={filters.wordLength}
                candidates={filteredCandidates}
                onCopyWord={handleCopyWord}
                copiedWord={copiedWord}
                onResetFilters={handleResetAllFilters}
              />
            </div>
          </div>
        </div>
      ) : (
        /* ── VIEW 2: WEEKLY WORD ARCHIVE ─────────────────────────── */
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left Column: Theme Selector List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search themes or words..."
                  value={archiveSearch}
                  onChange={(e) => setArchiveSearch(e.target.value)}
                  className="pl-10 rounded-xl text-sm bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleResetToDefaultThemes}
                className="border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-rose-500 rounded-xl px-3"
                title="Reset default themes"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredThemes.length > 0 ? (
                filteredThemes.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  const wordCount = Object.values(theme.words).flat().length;

                  return (
                    <div
                      key={theme.id}
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all border-2 ${
                        isSelected
                          ? 'border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-500/10 shadow-md shadow-amber-500/5'
                          : 'border-transparent bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1.5">
                          <span className="inline-block px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-700/60 text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                            {theme.categoryTag || 'WODL'}
                          </span>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-white leading-snug">
                            {theme.theme}
                          </h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-zinc-400 shrink-0" />
                            {theme.weekRange}
                          </p>
                        </div>

                        {theme.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTheme(theme.id, theme.theme);
                            }}
                            className="text-zinc-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                            title="Delete custom theme"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-700/40 pt-3 text-xs">
                        <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                          {wordCount} words
                        </span>
                        {isSelected && (
                          <span className="text-amber-600 dark:text-amber-400 font-bold uppercase text-[11px] tracking-wider flex items-center gap-0.5">
                            Active Theme <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-zinc-400 dark:text-zinc-500 text-sm">
                  No themes found.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Selected Theme Answer Words */}
          <div className="lg:col-span-3">
            {activeTheme ? (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-200 dark:border-zinc-700/60 pb-4 gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                      Theme Details
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                      {activeTheme.theme}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      {activeTheme.weekRange}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyAllThemeWords(activeTheme)}
                    className="border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-amber-400 rounded-xl text-sm font-semibold flex items-center gap-2 px-4 py-2.5"
                  >
                    <Share2 className="h-4 w-4 text-amber-500" />
                    <span>Copy All Words</span>
                  </Button>
                </div>

                {/* Length Filter Tabs */}
                <div className="flex flex-wrap gap-1.5 bg-zinc-100 dark:bg-zinc-800/70 p-1.5 sm:p-2 rounded-2xl border border-zinc-200 dark:border-zinc-700/60">
                  {['All', '3', '4', '5', '6', '7', '8'].map((tab) => {
                    const count =
                      tab === 'All'
                        ? Object.values(activeTheme.words).flat().length
                        : activeTheme.words[Number(tab) as 3 | 4 | 5 | 6 | 7 | 8]?.length || 0;

                    return (
                      <button
                        key={tab}
                        onClick={() => setArchiveLengthTab(tab)}
                        className={`flex-1 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                          archiveLengthTab === tab
                            ? 'bg-amber-500 text-white font-bold shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {tab === 'All' ? `All (${count})` : `${tab}L (${count})`}
                      </button>
                    );
                  })}
                </div>

                {/* Word Badges */}
                <div className="space-y-5 max-h-[440px] overflow-y-auto pr-1">
                  {Object.entries(activeTheme.words).map(([lengthKey, wordsList]) => {
                    if (archiveLengthTab !== 'All' && archiveLengthTab !== lengthKey) {
                      return null;
                    }
                    if (!wordsList || wordsList.length === 0) return null;

                    return (
                      <div key={lengthKey} className="space-y-3">
                        <h5 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Coins className="h-3.5 w-3.5 text-amber-500" />
                          {lengthKey}-Letter Answers ({wordsList.length})
                        </h5>
                        <div className="flex flex-wrap gap-2.5">
                          {wordsList.map((word) => (
                            <button
                              key={word}
                              type="button"
                              onClick={() => handleCopyWord(word)}
                              className="group inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50 px-4 py-2.5 text-sm font-bold text-zinc-800 dark:text-zinc-100 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all active:scale-95"
                            >
                              <span>{word}</span>
                              {copiedWord === word ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Clipboard className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-400 dark:text-zinc-500 text-sm rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700">
                Select a theme from the left pane.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Add Custom Theme Modal ───────────────────────────────── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Custom Binance WODL Theme"
      >
        <form onSubmit={handleAddThemeSubmit} className="space-y-5">
          <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl border border-amber-200 dark:border-amber-500/20 text-sm text-amber-800 dark:text-amber-300 font-semibold">
            <span>Want to test with sample data?</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePreFillSample}
              className="text-sm font-semibold text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 px-4 py-2"
            >
              <Wand2 className="h-4 w-4 mr-2" /> Auto-fill
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Theme Name *
              </label>
              <Input
                type="text"
                required
                placeholder="E.g. Web3 Security"
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Category Tag
              </label>
              <Input
                type="text"
                placeholder="E.g. DeFi, AI, Web3"
                value={newCategoryTag}
                onChange={(e) => setNewCategoryTag(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Date Range
            </label>
            <Input
              type="text"
              placeholder="E.g. Sep 01, 2026 - Sep 07, 2026"
              value={newWeekRange}
              onChange={(e) => setNewWeekRange(e.target.value)}
              className="rounded-xl text-sm"
            />
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-700/60 pt-5 space-y-4">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
              Words by Letter Length (comma or space separated)
            </span>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">3-Letter</label>
                <Input
                  type="text"
                  placeholder="GAS, DEX, BTC"
                  value={newWords3}
                  onChange={(e) => setNewWords3(e.target.value)}
                  className="uppercase text-sm font-semibold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">4-Letter</label>
                <Input
                  type="text"
                  placeholder="POOL, SWAP, HODL"
                  value={newWords4}
                  onChange={(e) => setNewWords4(e.target.value)}
                  className="uppercase text-sm font-semibold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">5-Letter</label>
                <Input
                  type="text"
                  placeholder="STAKE, TOKEN, YIELD"
                  value={newWords5}
                  onChange={(e) => setNewWords5(e.target.value)}
                  className="uppercase text-sm font-semibold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">6-Letter</label>
                <Input
                  type="text"
                  placeholder="MINING, SECURE, WALLET"
                  value={newWords6}
                  onChange={(e) => setNewWords6(e.target.value)}
                  className="uppercase text-sm font-semibold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">7-Letter</label>
                <Input
                  type="text"
                  placeholder="NETWORK, COMPACT, LENDING"
                  value={newWords7}
                  onChange={(e) => setNewWords7(e.target.value)}
                  className="uppercase text-sm font-semibold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">8-Letter</label>
                <Input
                  type="text"
                  placeholder="CONTRACT, SECURITY, AUDITING"
                  value={newWords8}
                  onChange={(e) => setNewWords8(e.target.value)}
                  className="uppercase text-sm font-semibold rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl font-semibold px-5 py-2.5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold shadow-md shadow-amber-500/20 rounded-xl text-sm px-6 py-2.5"
            >
              Save Theme
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Strategy Guide Modal ─────────────────────────────────── */}
      <Modal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        title="Binance WODL Strategy & How to Win"
      >
        <div className="space-y-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-2">
            <h4 className="font-bold text-base flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <Sparkles className="h-5 w-5 text-amber-500" />
              What is Binance WODL?
            </h4>
            <p className="text-sm">
              Binance WODL (Word of the Day) is a mini-game hosted by Binance. Guess the mystery crypto word in 6 attempts to earn Binance crypto points and voucher rewards.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm uppercase tracking-wider">
              Quick Guide:
            </h4>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-zinc-950 text-xs font-black">
                1
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 dark:text-white text-sm">Select Word Length</h5>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                  Choose letter length (3 to 8) matching your Binance WODL game grid (default is 6 letters).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
                2
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 dark:text-white text-sm">Enter Correct Positions (Green)</h5>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                  Type letters confirmed in exact positions directly into the green tiles. Focus auto-advances.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-zinc-950 text-xs font-bold">
                3
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 dark:text-white text-sm">Enter Yellow &amp; Gray Letters</h5>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                  Enter letters in the word but wrong spot into Correct Letters. Enter ruled-out letters into Incorrect Letters.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-white text-xs font-bold">
                4
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 dark:text-white text-sm">Pick Confirmed Weekly Answers</h5>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                  Words marked with a green border and star (★) are confirmed answers for this week&apos;s theme.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={() => setIsGuideOpen(false)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all active:scale-95 shadow-md shadow-amber-500/20"
            >
              Got it!
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
