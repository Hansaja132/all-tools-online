'use client';

import * as React from 'react';
import { Button, Input, Modal, Select, useToast } from '@tools-website/ui';
import {
  Coins,
  Search,
  Plus,
  Trash2,
  Clipboard,
  Check,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  Info,
  Copy,
  Zap,
  Filter,
  CheckCircle2,
  Wand2,
  BookOpen,
  Tag,
  ChevronRight,
  RefreshCw,
  Share2,
} from 'lucide-react';

interface WodlTheme {
  id: string;
  theme: string;
  weekRange: string;
  words: {
    3: string[];
    4: string[];
    5: string[];
    6: string[];
    7: string[];
    8: string[];
  };
  isCustom?: boolean;
}

const PRE_SEEDED_THEMES: WodlTheme[] = [
  {
    id: 'theme-1',
    theme: 'DeFi & Smart Contracts',
    weekRange: 'Aug 24, 2026 - Aug 30, 2026',
    words: {
      3: ['GAS', 'DEX', 'PAY'],
      4: ['LEND', 'POOL', 'SWAP', 'DEFI'],
      5: ['STAKE', 'YIELD', 'WRAP', 'ASSET', 'CHAIN'],
      6: ['MINING', 'LIQUID', 'STABLE', 'ORACLE', 'BRIDGE'],
      7: ['LENDING', 'WRAPPED', 'NETWORK', 'PROTOCOL'],
      8: ['CONTRACT', 'AUTOMATE', 'PLATFORM', 'SECURITY'],
    },
  },
  {
    id: 'theme-2',
    theme: 'Web3 & Creator Economy',
    weekRange: 'Aug 17, 2026 - Aug 23, 2026',
    words: {
      3: ['NFT', 'WEB', 'DAO', 'ART'],
      4: ['DAPP', 'NODE', 'COIN', 'GAME'],
      5: ['TOKEN', 'SMART', 'METAD', 'PROOF', 'OWNER'],
      6: ['LEDGER', 'WALLET', 'SECURE', 'AVATAR', 'VIRTUAL'],
      7: ['CREATOR', 'DIGITAL', 'NETWORK', 'GATEWAY', 'UTILITY'],
      8: ['METAVERSE', 'SECURITY', 'IDENTITY', 'REGISTRY'],
    },
  },
  {
    id: 'theme-3',
    theme: 'Crypto Security & Audits',
    weekRange: 'Aug 10, 2026 - Aug 16, 2026',
    words: {
      3: ['KEY', 'PIN', 'HEX'],
      4: ['SAFE', 'RISK', 'HACK', 'LOCK'],
      5: ['PHISH', 'GUARD', 'CRYPTO', 'VAULT', 'SHIELD'],
      6: ['ATTACK', 'BYPASS', 'CYPHER', 'ENCODE', 'SHIELD'],
      7: ['EXPLOIT', 'ENCRYPT', 'MALWARE', 'FIREWALL', 'AUDITING'],
      8: ['PASSWORD', 'FIREWALL', 'PHISHING', 'MULTISIG'],
    },
  },
  {
    id: 'theme-4',
    theme: 'Blockchain Basics & Consensus',
    weekRange: 'Aug 3, 2026 - Aug 9, 2026',
    words: {
      3: ['BTC', 'ETH', 'SOL', 'HASH'],
      4: ['HALV', 'BLOC', 'MINE', 'FORK', 'COIN'],
      5: ['BLOCK', 'MERGE', 'MINER', 'PROOF', 'STAKE'],
      6: ['BEACON', 'SHARED', 'MINING', 'REWARD', 'BLOCKS'],
      7: ['HALVING', 'GENESIS', 'COMPACT', 'ARCHIVE', 'SHA256'],
      8: ['CONSENSUS', 'ETHERNET', 'PROTOCOL', 'SECURITY'],
    },
  },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const BinanceWodl: React.FC = () => {
  const { toast } = useToast();

  // State for themes
  const [themes, setThemes] = React.useState<WodlTheme[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedThemeId, setSelectedThemeId] = React.useState<string>('');
  const [selectedLengthTab, setSelectedLengthTab] = React.useState<string>('All');
  const [copiedWord, setCopiedWord] = React.useState<string | null>(null);

  // Modal State for adding new theme
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newThemeName, setNewThemeName] = React.useState('');
  const [newWeekRange, setNewWeekRange] = React.useState('');
  const [newWords3, setNewWords3] = React.useState('');
  const [newWords4, setNewWords4] = React.useState('');
  const [newWords5, setNewWords5] = React.useState('');
  const [newWords6, setNewWords6] = React.useState('');
  const [newWords7, setNewWords7] = React.useState('');
  const [newWords8, setNewWords8] = React.useState('');

  // Solver State
  const [solverLength, setSolverLength] = React.useState<number>(5);
  const [greenLetters, setGreenLetters] = React.useState<string[]>(Array(5).fill(''));
  const [yellowLetters, setYellowLetters] = React.useState('');
  const [grayLetters, setGrayLetters] = React.useState('');
  const [solverSearchGlobal, setSolverSearchGlobal] = React.useState(true);

  // Initialize themes from local storage or pre-seeded
  React.useEffect(() => {
    const stored = localStorage.getItem('binance-wodl-themes');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as WodlTheme[];
        const custom = parsed.filter((t) => t.isCustom);
        const combined = [...custom, ...PRE_SEEDED_THEMES];
        setThemes(combined);
        if (custom.length > 0) {
          setSelectedThemeId(custom[0].id);
        } else {
          setSelectedThemeId(PRE_SEEDED_THEMES[0].id);
        }
      } catch (e) {
        setThemes(PRE_SEEDED_THEMES);
        setSelectedThemeId(PRE_SEEDED_THEMES[0].id);
      }
    } else {
      setThemes(PRE_SEEDED_THEMES);
      setSelectedThemeId(PRE_SEEDED_THEMES[0].id);
    }
  }, []);

  // Update solver green letters array size when solver length changes
  React.useEffect(() => {
    setGreenLetters(Array(solverLength).fill(''));
  }, [solverLength]);

  const handleCopyWord = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    toast('Copied to Clipboard!', `"${word}" copied.`, 'success');
    setTimeout(() => setCopiedWord(null), 2000);
  };

  const handleCopyAllThemeWords = (theme: WodlTheme) => {
    let allWords: string[] = [];
    if (selectedLengthTab === 'All') {
      allWords = Object.values(theme.words).flat();
    } else {
      const lenKey = Number(selectedLengthTab) as 3 | 4 | 5 | 6 | 7 | 8;
      allWords = theme.words[lenKey] || [];
    }

    if (allWords.length === 0) {
      toast('No Words', 'No words available in the current selection to copy.', 'info');
      return;
    }

    const textToCopy = `Binance WODL (${theme.theme}): ${allWords.join(', ')}`;
    navigator.clipboard.writeText(textToCopy);
    toast('Copied Theme Words', `Copied ${allWords.length} words to clipboard.`, 'success');
  };

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
    toast('Theme Added', `Theme "${newThemeName}" has been added.`, 'success');

    // Reset Form
    setNewThemeName('');
    setNewWeekRange('');
    setNewWords3('');
    setNewWords4('');
    setNewWords5('');
    setNewWords6('');
    setNewWords7('');
    setNewWords8('');
  };

  const handlePreFillSample = () => {
    setNewThemeName('Crypto Trading & AI');
    setNewWeekRange('Sep 01, 2026 - Sep 07, 2026');
    setNewWords3('AI, BOT, API');
    setNewWords4('GRID, ALGO, NODE, COPY');
    setNewWords5('CHART, ORDER, MINER, MODEL');
    setNewWords6('SIGNAL, MARGIN, PROMPT, AGENT');
    setNewWords7('TRADING, FUTURE, AUDITOR');
    setNewWords8('BOTNETS, ANALYSIS, PLATFORM');
    toast('Sample Loaded', 'Pre-filled sample Binance WODL theme fields.', 'info');
  };

  const handleDeleteTheme = (id: string, name: string) => {
    const updated = themes.filter((t) => t.id !== id);
    setThemes(updated);

    const customOnly = updated.filter((t) => t.isCustom);
    localStorage.setItem('binance-wodl-themes', JSON.stringify(customOnly));

    toast('Theme Deleted', `"${name}" has been deleted.`, 'info');

    if (selectedThemeId === id) {
      setSelectedThemeId(updated.length > 0 ? updated[0].id : '');
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to delete all custom themes and reset to defaults?')) {
      localStorage.removeItem('binance-wodl-themes');
      setThemes(PRE_SEEDED_THEMES);
      setSelectedThemeId(PRE_SEEDED_THEMES[0].id);
      toast('Reset Complete', 'Default Binance themes have been restored.', 'info');
    }
  };

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);

  // Filter themes based on search query
  const filteredThemes = themes.filter(
    (t) =>
      t.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.weekRange.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(t.words)
        .flat()
        .some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Total words metric
  const totalWordsInDatabase = React.useMemo(() => {
    return themes.reduce((acc, t) => acc + Object.values(t.words).flat().length, 0);
  }, [themes]);

  // Solver Candidate calculations
  const solverCandidates = React.useMemo(() => {
    let targetWords: string[] = [];

    if (solverSearchGlobal) {
      themes.forEach((t) => {
        const list = t.words[solverLength as 3 | 4 | 5 | 6 | 7 | 8];
        if (list) targetWords.push(...list);
      });
    } else if (selectedTheme) {
      const list = selectedTheme.words[solverLength as 3 | 4 | 5 | 6 | 7 | 8];
      if (list) targetWords.push(...list);
    }

    targetWords = Array.from(new Set(targetWords));

    const yellowArr = yellowLetters
      .toUpperCase()
      .split(/[,\s]+/)
      .filter(Boolean);
    const grayArr = grayLetters
      .toUpperCase()
      .split(/[,\s]+/)
      .filter(Boolean);

    return targetWords.filter((word) => {
      if (word.length !== solverLength) return false;

      // Green check
      for (let i = 0; i < solverLength; i++) {
        const requiredChar = greenLetters[i]?.toUpperCase();
        if (requiredChar && requiredChar !== '_' && requiredChar !== ' ') {
          if (word[i] !== requiredChar) return false;
        }
      }

      // Yellow check
      for (const char of yellowArr) {
        if (!word.includes(char)) return false;
      }

      // Gray check
      for (const char of grayArr) {
        if (word.includes(char)) return false;
      }

      return true;
    });
  }, [
    themes,
    selectedTheme,
    solverLength,
    greenLetters,
    yellowLetters,
    grayLetters,
    solverSearchGlobal,
  ]);

  const handleGreenLetterChange = (index: number, val: string) => {
    const char = val.slice(-1).toUpperCase();
    setGreenLetters((prev) => {
      const copy = [...prev];
      copy[index] = char;
      return copy;
    });

    if (char && index < solverLength - 1) {
      const nextInput = document.getElementById(`green-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleGreenKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !greenLetters[index] && index > 0) {
      const prevInput = document.getElementById(`green-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        setGreenLetters((prev) => {
          const copy = [...prev];
          copy[index - 1] = '';
          return copy;
        });
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`green-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === 'ArrowRight' && index < solverLength - 1) {
      const nextInput = document.getElementById(`green-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Toggle letter in Alphabet matrix: Default -> Gray -> Yellow -> Default
  const handleToggleKeypadLetter = (char: string) => {
    const yellowArr = yellowLetters
      .toUpperCase()
      .split(/[,\s]+/)
      .filter(Boolean);
    const grayArr = grayLetters
      .toUpperCase()
      .split(/[,\s]+/)
      .filter(Boolean);

    const isGray = grayArr.includes(char);
    const isYellow = yellowArr.includes(char);

    if (isGray) {
      // Gray -> Yellow
      const newGray = grayArr.filter((c) => c !== char).join(', ');
      const newYellow = [...yellowArr, char].join(', ');
      setGrayLetters(newGray);
      setYellowLetters(newYellow);
    } else if (isYellow) {
      // Yellow -> Default
      const newYellow = yellowArr.filter((c) => c !== char).join(', ');
      setYellowLetters(newYellow);
    } else {
      // Default -> Gray
      const newGray = [...grayArr, char].join(', ');
      setGrayLetters(newGray);
    }
  };

  const handleResetSolver = () => {
    setGreenLetters(Array(solverLength).fill(''));
    setYellowLetters('');
    setGrayLetters('');
    toast('Solver Cleared', 'All filter criteria reset.', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Premium Hero Banner (Binance Obsidian Dark & Gold Aesthetics) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950 p-6 md:p-8 text-white border border-amber-500/20 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-bold text-amber-400 backdrop-blur-md">
              <Coins className="h-4 w-4 text-amber-400 animate-pulse" />
              <span className="tracking-wider uppercase">Binance Crypto WODL Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-100">
              Weekly Binance WODL <span className="text-amber-400">Word Assistant</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 font-medium leading-relaxed">
              Instantly look up weekly Binance Word of the Day answers (3–8 letters), track past themes, and use the real-time interactive solver grid to crack today's puzzle.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800 backdrop-blur-xl min-w-[280px]">
            <div className="text-center p-2 rounded-xl bg-zinc-800/40">
              <span className="block text-xl font-black text-amber-400">{themes.length}</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Themes</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-zinc-800/40">
              <span className="block text-xl font-black text-amber-400">{totalWordsInDatabase}</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Words</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-zinc-800/40">
              <span className="block text-xl font-black text-amber-400">3-8</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Lengths</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Theme Explorer & Word Browser (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search themes or words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 shadow-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-1.5 rounded-xl border-amber-500/30 hover:border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/5 font-bold shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Theme</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetToDefaults}
                className="text-zinc-500 hover:text-red-500 rounded-xl"
                title="Reset to default seed themes"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Theme List & Selected Theme Details Grid */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Theme Selector List (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center">
                  <BookOpen className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                  Select Week
                </span>
                <span className="text-[10px] font-bold text-zinc-400">
                  {filteredThemes.length} available
                </span>
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredThemes.length > 0 ? (
                  filteredThemes.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    const count = Object.values(theme.words).flat().length;

                    return (
                      <div
                        key={theme.id}
                        onClick={() => setSelectedThemeId(theme.id)}
                        className={`group relative cursor-pointer rounded-2xl p-4 transition-all duration-200 border ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/10 shadow-md ring-1 ring-amber-500/30'
                            : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4
                              className={`font-black text-sm transition-colors ${
                                isSelected
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500'
                              }`}
                            >
                              {theme.theme}
                            </h4>
                            <p className="flex items-center text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                              <Calendar className="mr-1 h-3 w-3 text-zinc-400" />
                              {theme.weekRange}
                            </p>
                          </div>
                          {theme.isCustom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTheme(theme.id, theme.theme);
                              }}
                              className="text-zinc-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                              title="Delete custom theme"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-2.5">
                          <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                            {count} words
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider flex items-center">
                              Active <ChevronRight className="h-3 w-3 ml-0.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
                    <p className="text-zinc-500 text-xs">No themes found matching search.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Word Display Panel (7 cols) */}
            <div className="md:col-span-7 flex flex-col rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 p-6 min-h-[500px] shadow-sm">
              {selectedTheme ? (
                <>
                  <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest block">
                        Selected Theme
                      </span>
                      <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 leading-tight">
                        {selectedTheme.theme}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {selectedTheme.weekRange}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyAllThemeWords(selectedTheme)}
                      className="rounded-xl border-zinc-200 dark:border-zinc-800 font-bold text-xs flex items-center space-x-1.5"
                      title="Copy all words in this theme"
                    >
                      <Share2 className="h-3.5 w-3.5 text-amber-500" />
                      <span className="hidden sm:inline">Copy All</span>
                    </Button>
                  </div>

                  {/* Filter Tabs by Letter Length */}
                  <div className="my-5 flex flex-wrap gap-1 bg-zinc-100 dark:bg-zinc-800/60 p-1.5 rounded-2xl">
                    {['All', '3', '4', '5', '6', '7', '8'].map((tab) => {
                      const count =
                        tab === 'All'
                          ? Object.values(selectedTheme.words).flat().length
                          : selectedTheme.words[Number(tab) as 3 | 4 | 5 | 6 | 7 | 8]?.length || 0;

                      return (
                        <button
                          key={tab}
                          onClick={() => setSelectedLengthTab(tab)}
                          className={`flex-1 text-center py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                            selectedLengthTab === tab
                              ? 'bg-amber-500 text-zinc-950 shadow-md font-black scale-[1.02]'
                              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {tab === 'All' ? `All (${count})` : `${tab}L (${count})`}
                        </button>
                      );
                    })}
                  </div>

                  {/* Words Badges List */}
                  <div className="flex-1 overflow-y-auto space-y-5 max-h-[340px] pr-2">
                    {Object.entries(selectedTheme.words).map(([lengthKey, wordsList]) => {
                      if (selectedLengthTab !== 'All' && selectedLengthTab !== lengthKey) {
                        return null;
                      }

                      if (wordsList.length === 0) return null;

                      return (
                        <div key={lengthKey} className="space-y-2.5">
                          <h5 className="text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase flex items-center tracking-wider">
                            <Tag className="h-3 w-3 mr-1.5 text-amber-500" />
                            {lengthKey}-Letter Words ({wordsList.length})
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {wordsList.map((word) => (
                              <button
                                key={word}
                                onClick={() => handleCopyWord(word)}
                                className="group inline-flex items-center space-x-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:border-amber-500 hover:bg-amber-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-500/50 dark:hover:bg-amber-500/10 px-3 py-2 text-sm font-black text-zinc-800 dark:text-zinc-200 transition-all active:scale-95 shadow-sm"
                              >
                                <span>{word}</span>
                                {copiedWord === word ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                  <Clipboard className="h-3.5 w-3.5 text-zinc-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {selectedLengthTab !== 'All' &&
                      (!selectedTheme.words[Number(selectedLengthTab) as 3 | 4 | 5 | 6 | 7 | 8] ||
                        selectedTheme.words[Number(selectedLengthTab) as 3 | 4 | 5 | 6 | 7 | 8]
                          .length === 0) && (
                        <div className="py-12 text-center text-zinc-400 text-xs italic">
                          No {selectedLengthTab}-letter words recorded for this theme.
                        </div>
                      )}
                  </div>

                  <div className="mt-4 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3.5 text-xs text-zinc-600 dark:text-zinc-400 flex items-center space-x-2.5">
                    <Info className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <span>Click any word badge above to copy it instantly to your clipboard.</span>
                  </div>
                </>
              ) : (
                <div className="flex-grow flex flex-col justify-center items-center text-zinc-400 py-12">
                  <Coins className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-3" />
                  <p className="text-sm font-medium">Select a theme from the left pane.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Wordle / WODL Solver Helper (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 shadow-xl flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-amber-500/10 p-2.5 text-amber-500 border border-amber-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">WODL Solver Assistant</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Interactive live puzzle solver</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetSolver}
              className="text-zinc-400 hover:text-red-500 rounded-xl"
              title="Clear all solver criteria"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 space-y-6 flex-grow">
            {/* Word Length Selector & Scope */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-wider mb-1">
                  Word Length
                </label>
                <Select
                  value={solverLength}
                  onChange={(e) => setSolverLength(Number(e.target.value))}
                  options={[
                    { label: '3 Letters', value: 3 },
                    { label: '4 Letters', value: 4 },
                    { label: '5 Letters', value: 5 },
                    { label: '6 Letters', value: 6 },
                    { label: '7 Letters', value: 7 },
                    { label: '8 Letters', value: 8 },
                  ]}
                />
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
                <label className="flex items-center space-x-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={solverSearchGlobal}
                    onChange={(e) => setSolverSearchGlobal(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Search All Themes</span>
                </label>
                <span className="text-[10px] text-zinc-400 mt-1">
                  {solverSearchGlobal ? 'Searching global database' : 'Active theme only'}
                </span>
              </div>
            </div>

            {/* Green Letters Zone (Exact Position Tile Input Grid) */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Green Letters (Correct Spot)
                </span>
                <span className="text-[10px] text-zinc-400">Use arrow keys or backspace</span>
              </div>
              <div className="flex gap-2 justify-center">
                {greenLetters.map((letter, idx) => (
                  <input
                    key={idx}
                    id={`green-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={letter}
                    onChange={(e) => handleGreenLetterChange(idx, e.target.value)}
                    onKeyDown={(e) => handleGreenKeyDown(idx, e)}
                    className="h-12 w-10 sm:w-11 rounded-xl border-2 border-emerald-500/40 dark:border-emerald-700/50 bg-white dark:bg-zinc-900 text-center font-black text-zinc-900 dark:text-emerald-400 focus:border-emerald-500 focus:ring-emerald-500 uppercase text-xl shadow-sm transition-all"
                    placeholder="_"
                  />
                ))}
              </div>
            </div>

            {/* Yellow & Gray Text Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20">
                <label className="block text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1.5">
                  Yellow (Present)
                </label>
                <Input
                  type="text"
                  placeholder="E.g. A, E, T"
                  value={yellowLetters}
                  onChange={(e) => setYellowLetters(e.target.value)}
                  className="uppercase text-xs font-bold bg-white dark:bg-zinc-900"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20">
                <label className="block text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1.5">
                  Gray (Excluded)
                </label>
                <Input
                  type="text"
                  placeholder="E.g. X, Z, O"
                  value={grayLetters}
                  onChange={(e) => setGrayLetters(e.target.value)}
                  className="uppercase text-xs font-bold bg-white dark:bg-zinc-900"
                />
              </div>
            </div>

            {/* Interactive Alphabet Keypad Grid */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                  Quick Letter Elimination Grid
                </span>
                <span className="text-[10px] text-zinc-400 italic">Tap letter to toggle</span>
              </div>
              <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
                {ALPHABET.map((char) => {
                  const yellowArr = yellowLetters.toUpperCase().split(/[,\s]+/).filter(Boolean);
                  const grayArr = grayLetters.toUpperCase().split(/[,\s]+/).filter(Boolean);

                  const isYellow = yellowArr.includes(char);
                  const isGray = grayArr.includes(char);

                  let bgClass = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
                  if (isGray) {
                    bgClass = 'bg-rose-500/20 text-rose-500 border-rose-500/40 line-through';
                  } else if (isYellow) {
                    bgClass = 'bg-amber-500 text-zinc-950 border-amber-400 font-black';
                  }

                  return (
                    <button
                      key={char}
                      onClick={() => handleToggleKeypadLetter(char)}
                      className={`h-8 rounded-lg text-xs font-bold border transition-all active:scale-90 flex items-center justify-center ${bgClass}`}
                      title={`${char}: ${isGray ? 'Gray (Excluded)' : isYellow ? 'Yellow (Present)' : 'Available'}`}
                    >
                      {char}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Candidate Words Section */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Matching Words ({solverCandidates.length})
                </span>
                {solverCandidates.length > 0 && (
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    High probability
                  </span>
                )}
              </div>

              <div className="max-h-[160px] overflow-y-auto pr-1">
                {solverCandidates.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {solverCandidates.map((cand) => (
                      <button
                        key={cand}
                        onClick={() => handleCopyWord(cand)}
                        className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 px-3.5 py-1.5 text-xs font-black transition-all active:scale-95 flex items-center space-x-1.5 shadow-sm"
                        title="Click to copy word"
                      >
                        <span>{cand}</span>
                        {copiedWord === cand && <Check className="h-3 w-3 text-emerald-500" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs text-zinc-400 italic">
                      No matching WODL words found. Adjust your letter criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Theme Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Custom Weekly WODL Theme"
      >
        <form onSubmit={handleAddThemeSubmit} className="space-y-4">
          <div className="flex justify-between items-center bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 mb-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Need sample data to test?
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePreFillSample}
              className="text-xs font-bold text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
            >
              <Wand2 className="h-3.5 w-3.5 mr-1" /> Auto-fill Sample
            </Button>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Theme / Event Name *
            </label>
            <Input
              type="text"
              required
              placeholder="E.g. Web3 Security, Layer 2 Rollups"
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Week / Date Range
            </label>
            <Input
              type="text"
              placeholder="E.g. Aug 24, 2026 - Aug 30, 2026"
              value={newWeekRange}
              onChange={(e) => setNewWeekRange(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide block mb-3">
              Words by Letter Counts (Comma or space separated)
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  3-Letter Words
                </label>
                <Input
                  type="text"
                  placeholder="GAS, DEX, BTC"
                  value={newWords3}
                  onChange={(e) => setNewWords3(e.target.value)}
                  className="uppercase text-xs font-bold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  4-Letter Words
                </label>
                <Input
                  type="text"
                  placeholder="POOL, SWAP, HODL"
                  value={newWords4}
                  onChange={(e) => setNewWords4(e.target.value)}
                  className="uppercase text-xs font-bold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  5-Letter Words
                </label>
                <Input
                  type="text"
                  placeholder="STAKE, TOKEN, YIELD"
                  value={newWords5}
                  onChange={(e) => setNewWords5(e.target.value)}
                  className="uppercase text-xs font-bold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  6-Letter Words
                </label>
                <Input
                  type="text"
                  placeholder="MINING, SECURE, WALLET"
                  value={newWords6}
                  onChange={(e) => setNewWords6(e.target.value)}
                  className="uppercase text-xs font-bold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  7-Letter Words
                </label>
                <Input
                  type="text"
                  placeholder="NETWORK, COMPACT, LENDING"
                  value={newWords7}
                  onChange={(e) => setNewWords7(e.target.value)}
                  className="uppercase text-xs font-bold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  8-Letter Words
                </label>
                <Input
                  type="text"
                  placeholder="CONTRACT, SECURITY, AUDITING"
                  value={newWords8}
                  onChange={(e) => setNewWords8(e.target.value)}
                  className="uppercase text-xs font-bold rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="bg-amber-500 text-zinc-950 hover:bg-amber-400 font-black shadow-md rounded-xl"
            >
              Save Theme
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
