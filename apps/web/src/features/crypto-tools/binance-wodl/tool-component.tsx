'use client';

import * as React from 'react';
import { Button, Input, Modal, Select } from '@tools-website/ui';
import { useToast } from '@tools-website/ui';
import {
  Coins,
  Search,
  Plus,
  Trash2,
  HelpCircle,
  Clipboard,
  Check,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  Info,
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
        // Filter custom items to prevent pollution, and combine
        const custom = parsed.filter((t) => t.isCustom);
        setThemes([...custom, ...PRE_SEEDED_THEMES]);
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

  // Update solver green letters size when length changes
  React.useEffect(() => {
    setGreenLetters(Array(solverLength).fill(''));
  }, [solverLength]);

  const handleCopyWord = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    toast('Copied to Clipboard!', `"${word}" has been successfully copied.`, 'success');
    setTimeout(() => setCopiedWord(null), 2000);
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

    // Save custom themes only
    const customOnly = updatedThemes.filter((t) => t.isCustom);
    localStorage.setItem('binance-wodl-themes', JSON.stringify(customOnly));

    setSelectedThemeId(customTheme.id);
    setIsAddModalOpen(false);
    toast('Theme Added', `Theme "${newThemeName}" has been added to your lists.`, 'success');

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

  const handleDeleteTheme = (id: string, name: string) => {
    const updated = themes.filter((t) => t.id !== id);
    setThemes(updated);

    const customOnly = updated.filter((t) => t.isCustom);
    localStorage.setItem('binance-wodl-themes', JSON.stringify(customOnly));

    toast('Theme Deleted', `"${name}" has been deleted.`, 'info');

    // fallback select
    if (selectedThemeId === id) {
      if (updated.length > 0) {
        setSelectedThemeId(updated[0].id);
      } else {
        setSelectedThemeId('');
      }
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to delete all custom themes and reset to defaults?')) {
      localStorage.removeItem('binance-wodl-themes');
      setThemes(PRE_SEEDED_THEMES);
      setSelectedThemeId(PRE_SEEDED_THEMES[0].id);
      toast('Reset Complete', 'Default themes have been restored.', 'info');
    }
  };

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);

  // Filter themes in list based on search query
  const filteredThemes = themes.filter(
    (t) =>
      t.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.weekRange.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(t.words)
        .flat()
        .some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Solver Candidate calculations
  const solverCandidates = React.useMemo(() => {
    // 1. Collect words to search
    let targetWords: string[] = [];

    if (solverSearchGlobal) {
      // search all themes
      themes.forEach((t) => {
        const list = t.words[solverLength as 3 | 4 | 5 | 6 | 7 | 8];
        if (list) targetWords.push(...list);
      });
    } else if (selectedTheme) {
      // search selected theme only
      const list = selectedTheme.words[solverLength as 3 | 4 | 5 | 6 | 7 | 8];
      if (list) targetWords.push(...list);
    }

    // Deduplicate
    targetWords = Array.from(new Set(targetWords));

    // 2. Apply Filters
    const yellowArr = yellowLetters
      .toUpperCase()
      .split(/[,\s]*/)
      .filter(Boolean);
    const grayArr = grayLetters
      .toUpperCase()
      .split(/[,\s]*/)
      .filter(Boolean);

    return targetWords.filter((word) => {
      // Check length
      if (word.length !== solverLength) return false;

      // Match Green letters (exact position)
      for (let i = 0; i < solverLength; i++) {
        const requiredChar = greenLetters[i]?.toUpperCase();
        if (requiredChar && requiredChar !== '_' && requiredChar !== ' ') {
          if (word[i] !== requiredChar) return false;
        }
      }

      // Match Yellow letters (word contains letter, and if position specific isn't requested)
      for (const char of yellowArr) {
        if (!word.includes(char)) return false;
      }

      // Match Gray letters (word must NOT contain letter)
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
    const char = val.slice(-1).toUpperCase(); // take last typed character
    setGreenLetters((prev) => {
      const copy = [...prev];
      copy[index] = char;
      return copy;
    });

    // Auto-focus next input box if typed
    if (char && index < solverLength - 1) {
      const nextInput = document.getElementById(`green-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleResetSolver = () => {
    setGreenLetters(Array(solverLength).fill(''));
    setYellowLetters('');
    setGrayLetters('');
    toast('Solver Cleared', 'Filter criteria has been reset.', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Upper Banner Accent */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 p-6 text-zinc-950 shadow-md md:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-300 opacity-20 blur-2xl" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 rounded-full bg-black/10 px-3 py-1 text-xs font-semibold tracking-wider">
            <Coins className="h-3.5 w-3.5" />
            <span>BINANCE CRYPTO WODL UTILITIES</span>
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
            Weekly Word of the Day (WODL) Hub
          </h2>
          <p className="mt-2 text-sm text-zinc-900/80 md:text-base font-medium">
            Stay ahead of the game with direct lookups of current and past themes. Add new words
            instantly and use the live interactive guess assistant to solve daily Binance WODL puzzles.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Columns - Word Lists and Week Selector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
                <Search className="h-4 w-4" />
              </span>
              <Input
                type="text"
                placeholder="Search themes or words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-1.5 w-full sm:w-auto border-amber-500/20 hover:border-amber-500"
              >
                <Plus className="h-4 w-4 text-amber-500" />
                <span>Add Weekly Words</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetToDefaults}
                className="text-zinc-500 hover:text-red-500 flex items-center space-x-1 w-full sm:w-auto"
                title="Reset local storage and restore default seed words"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Default</span>
              </Button>
            </div>
          </div>

          {/* Grid Layout of Themes */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Select Theme / Week
              </label>
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {filteredThemes.length > 0 ? (
                  filteredThemes.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    const totalWordsCount = Object.values(theme.words).flat().length;

                    return (
                      <div
                        key={theme.id}
                        onClick={() => setSelectedThemeId(theme.id)}
                        className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-950/10 shadow-sm'
                            : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                              {theme.theme}
                            </h4>
                            <p className="mt-1 flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                              <Calendar className="mr-1.5 h-3.5 w-3.5 text-zinc-400" />
                              {theme.weekRange}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                              {totalWordsCount} words
                            </span>
                            {theme.isCustom && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTheme(theme.id, theme.theme);
                                }}
                                className="text-zinc-400 hover:text-red-500 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                title="Delete custom theme"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">No themes found matching search.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Word Display Panel */}
            <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/40 p-6 h-full min-h-[480px] shadow-sm">
              {selectedTheme ? (
                <>
                  <div className="border-b border-zinc-100 pb-4 dark:border-zinc-800 flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-black uppercase tracking-widest">
                        Active Selection
                      </span>
                      <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 leading-tight">
                        {selectedTheme.theme}
                      </h3>
                    </div>
                  </div>

                  {/* Tab Selector for Letters */}
                  <div className="my-6 flex flex-wrap gap-1 bg-zinc-100 dark:bg-zinc-800/60 p-1.5 rounded-xl">
                    {['All', '3', '4', '5', '6', '7', '8'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedLengthTab(tab)}
                        className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                          selectedLengthTab === tab
                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm scale-[1.02]'
                            : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                        }`}
                      >
                        {tab === 'All' ? 'All' : `${tab}L`}
                      </button>
                    ))}
                  </div>

                  {/* Words Badges List */}
                  <div className="flex-1 overflow-y-auto space-y-6 max-h-[300px] pr-2">
                    {Object.entries(selectedTheme.words).map(([lengthKey, wordsList]) => {
                      if (selectedLengthTab !== 'All' && selectedLengthTab !== lengthKey) {
                        return null;
                      }

                      if (wordsList.length === 0) return null;

                      return (
                        <div key={lengthKey} className="space-y-3">
                          <h5 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase flex items-center tracking-wider">
                            <Layers className="h-3.5 w-3.5 mr-2 text-amber-500" />
                            {lengthKey}-Letter Words ({wordsList.length})
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {wordsList.map((word) => (
                              <button
                                key={word}
                                onClick={() => handleCopyWord(word)}
                                className="group inline-flex items-center space-x-2 rounded-lg border border-zinc-200 bg-white hover:border-amber-500 hover:bg-amber-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-500/50 dark:hover:bg-amber-950/20 px-3 py-2 text-sm font-bold text-zinc-800 dark:text-zinc-200 transition-all active:scale-95"
                              >
                                <span>{word}</span>
                                {copiedWord === word ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Clipboard className="h-3.5 w-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {selectedLengthTab !== 'All' &&
                      (!selectedTheme.words[selectedLengthTab as unknown as 3 | 4 | 5 | 6 | 7 | 8] ||
                        selectedTheme.words[selectedLengthTab as unknown as 3 | 4 | 5 | 6 | 7 | 8]
                          .length === 0) && (
                        <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm italic">
                          No {selectedLengthTab}-letter words available in this theme.
                        </div>
                      )}
                  </div>

                  <div className="mt-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 p-4 border border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex items-start space-x-3">
                    <Info className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">
                      Click any word badge above to copy it to clipboard. WODL words are updated weekly.
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex-grow flex flex-col justify-center items-center text-zinc-500 dark:text-zinc-400">
                  <Coins className="h-12 w-12 text-zinc-300 mb-3" />
                  <p className="text-sm font-medium">Please select a theme from the left pane.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Interactive Solver Helper */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-sm flex flex-col h-full">
          <div className="flex items-center space-x-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">WODL Guess Helper</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Solve today's puzzle in real-time</p>
            </div>
          </div>

          <div className="mt-6 space-y-6 flex-grow">
            {/* Word Length Selector */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80">
              <label className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Word Length
              </label>
              <div className="w-32">
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
            </div>

            {/* Scope Selector */}
            <div className="flex items-center justify-between py-2 px-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800/80">
              <label htmlFor="search-global" className="text-xs font-bold text-zinc-600 dark:text-zinc-400 cursor-pointer">
                Search all themes
              </label>
              <input
                id="search-global"
                type="checkbox"
                checked={solverSearchGlobal}
                onChange={(e) => setSolverSearchGlobal(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
              />
            </div>

            {/* Green Letters Zone */}
            <div className="p-4 rounded-xl bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/30">
              <label className="mb-3 block text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center justify-between">
                <span>Green Letters (Correct Spot)</span>
                <span className="text-zinc-400 font-normal lowercase italic">Leave blank if unknown</span>
              </label>
              <div className="flex gap-2 justify-center">
                {greenLetters.map((letter, idx) => (
                  <input
                    key={idx}
                    id={`green-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={letter}
                    onChange={(e) => handleGreenLetterChange(idx, e.target.value)}
                    className="h-12 w-10 rounded-lg border-2 border-green-200 dark:border-green-900/50 bg-white dark:bg-zinc-900 text-center font-black text-zinc-900 dark:text-white focus:border-green-500 focus:ring-green-500 dark:focus:border-green-600 uppercase text-xl shadow-sm"
                    placeholder="_"
                  />
                ))}
              </div>
            </div>

            {/* Yellow & Gray Zones */}
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30">
                <label className="mb-2 block text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                  Yellow Letters (Present in Word)
                </label>
                <Input
                  type="text"
                  placeholder="E.g. A, E"
                  value={yellowLetters}
                  onChange={(e) => setYellowLetters(e.target.value)}
                  className="uppercase placeholder:normal-case focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-zinc-900"
                />
              </div>

              <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30">
                <label className="mb-2 block text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">
                  Gray Letters (Exclude from Word)
                </label>
                <Input
                  type="text"
                  placeholder="E.g. R, T, S"
                  value={grayLetters}
                  onChange={(e) => setGrayLetters(e.target.value)}
                  className="uppercase placeholder:normal-case focus:ring-red-500 focus:border-red-500 bg-white dark:bg-zinc-900"
                />
              </div>
            </div>

            {/* Action Row */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetSolver}
                className="flex-1 flex items-center justify-center space-x-1.5 border-zinc-200 dark:border-zinc-800 font-bold"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Clear Criteria</span>
              </Button>
            </div>

            {/* Candidate List Display */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5 mt-2">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Candidate Words ({solverCandidates.length})
                </span>
              </div>
              <div className="max-h-[180px] overflow-y-auto pr-1">
                {solverCandidates.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {solverCandidates.map((cand) => (
                      <button
                        key={cand}
                        onClick={() => handleCopyWord(cand)}
                        className="rounded-lg bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 hover:bg-green-500/20 hover:border-green-500/50 px-3 py-1.5 text-xs font-black transition-all active:scale-95 flex items-center space-x-1.5 shadow-sm"
                        title="Click to copy word"
                      >
                        <span>{cand}</span>
                        {copiedWord === cand && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                      No matching WODL words found. Adjust criteria.
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
        title="Add Custom Weekly WODL Words"
      >
        <form onSubmit={handleAddThemeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Theme / Event Name *
            </label>
            <Input
              type="text"
              required
              placeholder="E.g. Web3 Security, Ethereum Merge"
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
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
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-md">
              Save Theme
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
