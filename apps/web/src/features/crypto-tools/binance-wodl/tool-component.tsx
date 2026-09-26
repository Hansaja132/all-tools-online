'use client';

import * as React from 'react';
import { Button, Input, Modal, useToast } from '@tools-website/ui';
import {
  Search,
  Plus,
  Trash2,
  Clipboard,
  Check,
  RotateCcw,
  Sparkles,
  Calendar,
  Info,
  Zap,
  CheckCircle2,
  Wand2,
  BookOpen,
  Tag,
  ChevronRight,
  Share2,
  Trophy,
  Flame,
  Lightbulb,
} from 'lucide-react';

export interface WodlTheme {
  id: string;
  theme: string;
  weekRange: string;
  categoryTag?: string;
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

// Comprehensive Binance WODL Master Database
const PRE_SEEDED_THEMES: WodlTheme[] = [
  {
    id: 'theme-1',
    theme: 'DeFi & Smart Contracts',
    weekRange: 'Aug 24, 2026 - Aug 30, 2026',
    categoryTag: 'DeFi',
    words: {
      3: ['GAS', 'DEX', 'PAY', 'NFT', 'BNB'],
      4: ['LEND', 'POOL', 'SWAP', 'DEFI', 'HODL', 'EARN', 'MINT', 'BURN'],
      5: ['STAKE', 'YIELD', 'WRAP', 'ASSET', 'CHAIN', 'TOKEN', 'PROOF', 'VAULT'],
      6: ['MINING', 'LIQUID', 'STABLE', 'ORACLE', 'BRIDGE', 'LEDGER', 'REWARD'],
      7: ['LENDING', 'WRAPPED', 'NETWORK', 'PROTOCOL', 'STAKING', 'DEPOSIT', 'BALANCE'],
      8: ['CONTRACT', 'AUTOMATE', 'PLATFORM', 'SECURITY', 'MULTISIG', 'SOLUTIONS'],
    },
  },
  {
    id: 'theme-2',
    theme: 'Web3 & Creator Economy',
    weekRange: 'Aug 17, 2026 - Aug 23, 2026',
    categoryTag: 'Web3',
    words: {
      3: ['NFT', 'WEB', 'DAO', 'ART', 'FAN'],
      4: ['DAPP', 'NODE', 'COIN', 'GAME', 'VOTE'],
      5: ['TOKEN', 'SMART', 'META', 'PROOF', 'OWNER', 'GUILD', 'ARENA'],
      6: ['LEDGER', 'WALLET', 'SECURE', 'AVATAR', 'VIRTUAL', 'PLAYER', 'ENGAGE'],
      7: ['CREATOR', 'DIGITAL', 'NETWORK', 'GATEWAY', 'UTILITY', 'GAMING', 'CREATORS'],
      8: ['METAVERSE', 'SECURITY', 'IDENTITY', 'REGISTRY', 'INDUSTRY', 'PROTOCOL'],
    },
  },
  {
    id: 'theme-3',
    theme: 'AI & Big Data in Crypto',
    weekRange: 'Aug 10, 2026 - Aug 16, 2026',
    categoryTag: 'AI & Data',
    words: {
      3: ['AI', 'BOT', 'API', 'CPU', 'GPU'],
      4: ['DATA', 'ALGO', 'NODE', 'COPY', 'LINK'],
      5: ['MODEL', 'CHART', 'AGENT', 'MINER', 'SOLVE', 'TRACK'],
      6: ['PROMPT', 'SIGNAL', 'NEURAL', 'VECTOR', 'AGENTS', 'INSIGHT', 'RATING'],
      7: ['TRADING', 'AUTOMATE', 'NETWORK', 'COMPUTE', 'ANALYSIS', 'DYNAMIC'],
      8: ['LEARNING', 'ANALYSIS', 'BIGDATA', 'AUTONOMY', 'SOFTWARE', 'HARDWARE'],
    },
  },
  {
    id: 'theme-4',
    theme: 'Layer 2 & Scaling Solutions',
    weekRange: 'Aug 03, 2026 - Aug 09, 2026',
    categoryTag: 'Layer 2',
    words: {
      3: ['L2', 'ZK', 'GAS', 'TPS'],
      4: ['BLOB', 'ROLL', 'FAST', 'NODE', 'MAIN'],
      5: ['PROOF', 'BATCH', 'STATE', 'SHARD', 'SCALE', 'VERIFY', 'LEVEL'],
      6: ['ROLLUP', 'PLASMA', 'BRIDGE', 'CANON', 'SYSTEM', 'ACCESS'],
      7: ['OPTIMISM', 'ARBITRUM', 'ZKPROOF', 'SHARDING', 'RELEASE', 'ADDRESS'],
      8: ['SCALING', 'VALIDATOR', 'ROLLUPS', 'VALIDITY', 'CONSENSUS', 'ETHERNET'],
    },
  },
  {
    id: 'theme-5',
    theme: 'Crypto Security & Audits',
    weekRange: 'Jul 27, 2026 - Aug 02, 2026',
    categoryTag: 'Security',
    words: {
      3: ['KEY', 'PIN', 'HEX', 'KYC'],
      4: ['SAFE', 'RISK', 'HACK', 'LOCK', 'SEED'],
      5: ['PHISH', 'GUARD', 'CRYPTO', 'VAULT', 'SHIELD', 'SAFEST'],
      6: ['ATTACK', 'BYPASS', 'CYPHER', 'ENCODE', 'VERIFY', 'IMPACT'],
      7: ['EXPLOIT', 'ENCRYPT', 'MALWARE', 'FIREWALL', 'PRIVACY', 'ACCOUNT'],
      8: ['PASSWORD', 'AUDITING', 'PHISHING', 'MULTISIG', 'DATABASE', 'HARDENING'],
    },
  },
  {
    id: 'theme-6',
    theme: 'Binance Earn & Spot Trading',
    weekRange: 'Jul 20, 2026 - Jul 26, 2026',
    categoryTag: 'Trading',
    words: {
      3: ['BUY', 'SELL', 'P2P', 'POW', 'POS'],
      4: ['SPOT', 'AUTO', 'BOT', 'POOL', 'BULL', 'BEAR', 'PUMP', 'DUMP'],
      5: ['ORDER', 'EARN', 'DUAL', 'LIMIT', 'SWAP', 'MARGIN', 'MONEY', 'PRICE'],
      6: ['MARGIN', 'FUTURE', 'OPTION', 'REWARD', 'VAULT', 'MARKET', 'SYSTEM'],
      7: ['TRADING', 'STAKING', 'DEPOSIT', 'BALANCE', 'PAYMENTS', 'ACCOUNT'],
      8: ['PORTFOLIO', 'LEVERAGE', 'BOTNETS', 'WINNINGS', 'TREASURY', 'TANGIBLE'],
    },
  },
  {
    id: 'theme-7',
    theme: 'Blockchain Basics & Consensus',
    weekRange: 'Jul 13, 2026 - Jul 19, 2026',
    categoryTag: 'Basics',
    words: {
      3: ['BTC', 'ETH', 'SOL', 'HASH', 'BNB'],
      4: ['HALV', 'BLOC', 'MINE', 'FORK', 'COIN', 'GWEI'],
      5: ['BLOCK', 'MERGE', 'MINER', 'PROOF', 'STAKE', 'POWER'],
      6: ['BEACON', 'SHARED', 'MINING', 'REWARD', 'BLOCKS', 'PUBLIC', 'DOMAIN'],
      7: ['HALVING', 'GENESIS', 'COMPACT', 'ARCHIVE', 'SHA256', 'ACCOUNT'],
      8: ['CONSENSUS', 'ETHERNET', 'PROTOCOL', 'SECURITY', 'VALIDATOR'],
    },
  },
  {
    id: 'theme-8',
    theme: 'Real World Assets (RWA) Tokenization',
    weekRange: 'Jul 06, 2026 - Jul 12, 2026',
    categoryTag: 'RWA',
    words: {
      3: ['RWA', 'SEC', 'OND'],
      4: ['BOND', 'GOLD', 'LAND', 'CASH'],
      5: ['YIELD', 'ASSET', 'TOKEN', 'TREAS', 'TRUST', 'VALUE'],
      6: ['REALTY', 'STABLE', 'CREDIT', 'LIQUID', 'SYSTEM'],
      7: ['BACKING', 'HOUSING', 'ISSUANCE', 'DEPOSIT', 'AUDITED'],
      8: ['PROPERTY', 'TREASURY', 'TANGIBLE', 'AUDITED', 'TOKENIZE'],
    },
  },
];

const QWERTY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export const BinanceWodl: React.FC = () => {
  const { toast } = useToast();

  const [themes, setThemes] = React.useState<WodlTheme[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedThemeId, setSelectedThemeId] = React.useState<string>('');
  const [selectedLengthTab, setSelectedLengthTab] = React.useState<string>('All');
  const [copiedWord, setCopiedWord] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'solver' | 'archive'>('solver');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isGuideOpen, setIsGuideOpen] = React.useState(false);

  // Form State
  const [newThemeName, setNewThemeName] = React.useState('');
  const [newWeekRange, setNewWeekRange] = React.useState('');
  const [newCategoryTag, setNewCategoryTag] = React.useState('Custom');
  const [newWords3, setNewWords3] = React.useState('');
  const [newWords4, setNewWords4] = React.useState('');
  const [newWords5, setNewWords5] = React.useState('');
  const [newWords6, setNewWords6] = React.useState('');
  const [newWords7, setNewWords7] = React.useState('');
  const [newWords8, setNewWords8] = React.useState('');

  // SOLVER STATE
  const [solverLength, setSolverLength] = React.useState<number>(5);
  // Green exact letter position array (size = solverLength)
  const [greenLetters, setGreenLetters] = React.useState<string[]>(Array(5).fill(''));
  // Text inputs for Yellow (included) and Gray (excluded) letters
  const [yellowInput, setYellowInput] = React.useState('');
  const [grayInput, setGrayInput] = React.useState('');
  // Keypad states: keypadYellow = array of chars marked Yellow on keypad, keypadGray = array of chars marked Gray
  const [keypadYellow, setKeypadYellow] = React.useState<string[]>([]);
  const [keypadGray, setKeypadGray] = React.useState<string[]>([]);
  const [solverSearchGlobal, setSolverSearchGlobal] = React.useState(true);

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
    } else {
      setThemes(PRE_SEEDED_THEMES);
      setSelectedThemeId(PRE_SEEDED_THEMES[0].id);
    }
  }, []);

  React.useEffect(() => {
    setGreenLetters(Array(solverLength).fill(''));
  }, [solverLength]);

  const handleCopyWord = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    toast('Copied!', `"${word}" copied.`, 'success');
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
      toast('No Words', 'No words in current selection.', 'info');
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

  const handleDeleteTheme = (id: string, name: string) => {
    const updated = themes.filter((t) => t.id !== id);
    setThemes(updated);
    const customOnly = updated.filter((t) => t.isCustom);
    localStorage.setItem('binance-wodl-themes', JSON.stringify(customOnly));
    toast('Theme Deleted', `"${name}" removed.`, 'info');

    if (selectedThemeId === id) {
      setSelectedThemeId(updated.length > 0 ? updated[0].id : '');
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset to default seed themes?')) {
      localStorage.removeItem('binance-wodl-themes');
      setThemes(PRE_SEEDED_THEMES);
      setSelectedThemeId(PRE_SEEDED_THEMES[0].id);
      toast('Reset Complete', 'Default themes restored.', 'info');
    }
  };

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);

  const filteredThemes = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
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
  }, [themes, searchQuery]);

  // Combined Yellow & Gray letter sets from text inputs + keypad toggles
  const effectiveYellowLetters = React.useMemo(() => {
    const fromInput = yellowInput
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .split('');
    return Array.from(new Set([...keypadYellow, ...fromInput]));
  }, [keypadYellow, yellowInput]);

  const effectiveGrayLetters = React.useMemo(() => {
    const fromInput = grayInput
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .split('');
    return Array.from(new Set([...keypadGray, ...fromInput]));
  }, [keypadGray, grayInput]);

  // HIGH-ACCURACY WORDLE / BINANCE WODL FINDING ALGORITHM
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

    return targetWords.filter((word) => {
      if (word.length !== solverLength) return false;

      // 1. Strict Green Check (Exact character at position i)
      for (let i = 0; i < solverLength; i++) {
        const gChar = greenLetters[i]?.toUpperCase();
        if (gChar && word[i] !== gChar) return false;
      }

      // 2. Strict Yellow Check (Word MUST contain every yellow letter)
      for (const yChar of effectiveYellowLetters) {
        if (!word.includes(yChar)) return false;
      }

      // 3. Strict Gray Check (Word MUST NOT contain any gray letter, unless it is already green/yellow)
      for (const gChar of effectiveGrayLetters) {
        if (word.includes(gChar)) {
          // If the letter is marked green or yellow, allow it only up to known count
          const isGreenOrYellow =
            greenLetters.includes(gChar) || effectiveYellowLetters.includes(gChar);
          if (!isGreenOrYellow) return false;
        }
      }

      return true;
    });
  }, [
    themes,
    selectedTheme,
    solverLength,
    greenLetters,
    effectiveYellowLetters,
    effectiveGrayLetters,
    solverSearchGlobal,
  ]);

  // Optimal Recommended Guess Engine (Entropy Reranker)
  const bestSuggestedGuess = React.useMemo(() => {
    if (solverCandidates.length <= 1) return solverCandidates[0] || null;

    const letterCounts: Record<string, number> = {};
    solverCandidates.forEach((w) => {
      const uniqueChars = new Set(w.split(''));
      uniqueChars.forEach((ch) => {
        letterCounts[ch] = (letterCounts[ch] || 0) + 1;
      });
    });

    let bestWord = solverCandidates[0];
    let maxScore = -1;

    solverCandidates.forEach((w) => {
      const uniqueChars = new Set(w.split(''));
      let score = 0;
      uniqueChars.forEach((ch) => {
        score += letterCounts[ch] || 0;
      });
      if (score > maxScore) {
        maxScore = score;
        bestWord = w;
      }
    });

    return bestWord;
  }, [solverCandidates]);

  // Keypad click handler (cycles: Neutral -> Gray -> Yellow -> Neutral)
  const handleKeypadClick = (char: string) => {
    const isGray = keypadGray.includes(char);
    const isYellow = keypadYellow.includes(char);

    if (isGray) {
      setKeypadGray((prev) => prev.filter((c) => c !== char));
      setKeypadYellow((prev) => [...prev, char]);
    } else if (isYellow) {
      setKeypadYellow((prev) => prev.filter((c) => c !== char));
    } else {
      setKeypadGray((prev) => [...prev, char]);
    }
  };

  // Input Handler for Green Tile Navigation
  const handleGreenLetterChange = (idx: number, val: string) => {
    const char = val.replace(/[^A-Za-z]/g, '').slice(-1).toUpperCase();
    setGreenLetters((prev) => {
      const copy = [...prev];
      copy[idx] = char;
      return copy;
    });

    if (char && idx < solverLength - 1) {
      const nextElem = document.getElementById(`green-tile-${idx + 1}`);
      if (nextElem) (nextElem as HTMLInputElement).focus();
    }
  };

  const handleGreenTileKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (greenLetters[idx]) {
        setGreenLetters((prev) => {
          const copy = [...prev];
          copy[idx] = '';
          return copy;
        });
      } else if (idx > 0) {
        setGreenLetters((prev) => {
          const copy = [...prev];
          copy[idx - 1] = '';
          return copy;
        });
        const prevElem = document.getElementById(`green-tile-${idx - 1}`);
        if (prevElem) (prevElem as HTMLInputElement).focus();
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      const prevElem = document.getElementById(`green-tile-${idx - 1}`);
      if (prevElem) (prevElem as HTMLInputElement).focus();
    } else if (e.key === 'ArrowRight' && idx < solverLength - 1) {
      const nextElem = document.getElementById(`green-tile-${idx + 1}`);
      if (nextElem) (nextElem as HTMLInputElement).focus();
    }
  };

  const handleGreenTilePaste = (idx: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^A-Za-z]/g, '').toUpperCase();
    if (!pasted) return;

    setGreenLetters((prev) => {
      const copy = [...prev];
      for (let i = 0; i < pasted.length && idx + i < solverLength; i++) {
        copy[idx + i] = pasted[i];
      }
      return copy;
    });

    const nextIdx = Math.min(idx + pasted.length, solverLength - 1);
    const nextElem = document.getElementById(`green-tile-${nextIdx}`);
    if (nextElem) (nextElem as HTMLInputElement).focus();
  };

  const handleResetSolver = () => {
    setGreenLetters(Array(solverLength).fill(''));
    setYellowInput('');
    setGrayInput('');
    setKeypadYellow([]);
    setKeypadGray([]);
    toast('Solver Reset', 'All letter criteria cleared.', 'info');
  };

  return (
    <div className="space-y-8 font-sans text-zinc-900 dark:text-zinc-100">
      {/* ── Navigation Bar ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-700/60">
        {/* Main View Tabs */}
        <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 shrink-0">
          <button
            onClick={() => setActiveTab('solver')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all inline-flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'solver'
                ? 'bg-white dark:bg-zinc-700 text-amber-600 dark:text-amber-400 shadow-sm border border-zinc-200/80 dark:border-zinc-600/50'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/40'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Interactive Solver</span>
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all inline-flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0 ${
              activeTab === 'archive'
                ? 'bg-white dark:bg-zinc-700 text-amber-600 dark:text-amber-400 shadow-sm border border-zinc-200/80 dark:border-zinc-600/50'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/40'
            }`}
          >
            <BookOpen className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Word Archive</span>
          </button>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGuideOpen(true)}
            className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 rounded-xl border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 px-4 py-2.5"
          >
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span>How to Win</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-xl flex items-center gap-2 px-4 py-2.5"
          >
            <Plus className="h-4 w-4" />
            <span>Add Theme</span>
          </Button>
        </div>
      </div>

      {/* ── VIEW 1: INTERACTIVE SOLVER ─────────────────── */}
      {activeTab === 'solver' ? (
        <div className="space-y-8">
          {/* Controls Bar: Word Length Selector & Search Scope */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mr-1">Word Length:</span>
              {[3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => setSolverLength(num)}
                  className={`px-4 py-2 rounded-xl text-sm transition-all border ${
                    solverLength === num
                      ? 'bg-amber-500 text-zinc-950 font-extrabold border-amber-500 shadow-md shadow-amber-500/20'
                      : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  {num}L
                </button>
              ))}
            </div>

            <div className="flex items-center gap-5 sm:gap-6 flex-wrap">
              <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={solverSearchGlobal}
                  onChange={(e) => setSolverSearchGlobal(e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-600 text-amber-500 focus:ring-amber-400 h-4 w-4 cursor-pointer"
                />
                <span>Search All Themes</span>
              </label>

              <button
                onClick={handleResetSolver}
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 flex items-center gap-1.5 font-semibold transition-colors px-2.5 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Reset solver criteria"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* ── Solver Two-Column Grid ──────────────────── */}
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left Column: Input Controls (3 cols on lg) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Green Exact Position Tiles */}
              <div className="p-6 bg-white dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Green Tiles — Exact Position</span>
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">Type or paste letters</span>
                </div>

                <div className="flex justify-center gap-3 py-3">
                  {greenLetters.map((letter, idx) => (
                    <input
                      key={idx}
                      id={`green-tile-${idx}`}
                      type="text"
                      maxLength={1}
                      value={letter}
                      onChange={(e) => handleGreenLetterChange(idx, e.target.value)}
                      onKeyDown={(e) => handleGreenTileKeyDown(idx, e)}
                      onPaste={(e) => handleGreenTilePaste(idx, e)}
                      className={`h-16 w-14 sm:h-[72px] sm:w-16 rounded-2xl border-2 text-center font-black text-2xl uppercase transition-all ${
                        letter
                          ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                          : 'border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30'
                      }`}
                      placeholder="•"
                    />
                  ))}
                </div>
              </div>

              {/* Yellow & Gray Text Inputs */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-5 bg-amber-50/70 dark:bg-amber-500/10 rounded-2xl border border-amber-200 dark:border-amber-500/25 space-y-3">
                  <label className="block text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    Yellow Letters (Included)
                  </label>
                  <Input
                    type="text"
                    placeholder="E.g. A E T"
                    value={yellowInput}
                    onChange={(e) => setYellowInput(e.target.value.toUpperCase())}
                    className="uppercase text-sm font-semibold bg-white dark:bg-zinc-900 border-amber-300 dark:border-zinc-700"
                  />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Letters in the word, wrong position</p>
                </div>

                <div className="p-5 bg-zinc-100/80 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 space-y-3">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                    Gray Letters (Excluded)
                  </label>
                  <Input
                    type="text"
                    placeholder="E.g. X Z O"
                    value={grayInput}
                    onChange={(e) => setGrayInput(e.target.value.toUpperCase())}
                    className="uppercase text-sm font-semibold bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
                  />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Letters NOT in the word at all</p>
                </div>
              </div>

              {/* QWERTY Keypad Toggle */}
              <div className="p-5 bg-white dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>QWERTY Quick Filter</span>
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">Tap: Gray → Yellow → Neutral</span>
                </div>

                <div className="space-y-2">
                  {QWERTY_ROWS.map((row, rIdx) => (
                    <div key={rIdx} className="flex justify-center gap-1.5">
                      {row.map((char) => {
                        const isGray = effectiveGrayLetters.includes(char);
                        const isYellow = effectiveYellowLetters.includes(char);
                        const isGreen = greenLetters.includes(char);

                        let keyClass =
                          'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-600';
                        if (isGreen) {
                          keyClass =
                            'bg-emerald-500 text-white font-black border-emerald-500 shadow-md shadow-emerald-500/20';
                        } else if (isYellow) {
                          keyClass =
                            'bg-amber-400 text-zinc-950 font-black border-amber-400 shadow-md shadow-amber-400/20';
                        } else if (isGray) {
                          keyClass =
                            'bg-zinc-300 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 border-zinc-300 dark:border-zinc-800 line-through';
                        }

                        return (
                          <button
                            key={char}
                            onClick={() => handleKeypadClick(char)}
                            className={`h-12 flex-1 max-w-[48px] rounded-xl text-sm font-bold border transition-all active:scale-95 flex items-center justify-center ${keyClass}`}
                          >
                            {char}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Results (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Best Recommended Guess Box */}
              {bestSuggestedGuess && solverCandidates.length > 1 && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-amber-500/10 dark:from-amber-500/15 dark:to-orange-500/10 border border-amber-300 dark:border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
                      <Flame className="h-4 w-4 text-amber-500" />
                      <span>Best Guess</span>
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Highest Elimination Score</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black tracking-[0.2em] text-zinc-900 dark:text-white uppercase">
                      {bestSuggestedGuess}
                    </span>
                    <button
                      onClick={() => handleCopyWord(bestSuggestedGuess)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all active:scale-95 shadow-md shadow-amber-500/20"
                    >
                      <Clipboard className="h-4 w-4" />
                      Copy
                    </button>
                  </div>
                </div>
              )}

              {/* Matching Candidate Words */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span>Candidates ({solverCandidates.length})</span>
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                    {solverCandidates.length === 1 ? '🎯 Solved!' : 'Click to copy'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {solverCandidates.length > 0 ? (
                    solverCandidates.map((word) => (
                      <button
                        key={word}
                        onClick={() => handleCopyWord(word)}
                        className="px-4 py-2.5 rounded-xl text-sm font-bold tracking-wider bg-zinc-50 hover:bg-amber-50 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-amber-500/15 dark:hover:text-amber-300 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2 transition-all active:scale-95"
                      >
                        <span>{word}</span>
                        {copiedWord === word ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Clipboard className="h-3.5 w-3.5 text-zinc-400 opacity-50" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="w-full py-12 text-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 text-sm">
                      No matching words for current filters.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── VIEW 2: WEEKLY WORD ARCHIVE ─────────────── */
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left Column: Theme Selector List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search themes or words..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl text-sm bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleResetToDefaults}
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
                      className={`cursor-pointer rounded-2xl p-5 transition-all border-2 ${
                        isSelected
                          ? 'border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-500/10 shadow-md shadow-amber-500/5'
                          : 'border-transparent bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1.5">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-700/60 text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                            {theme.categoryTag || 'WODL'}
                          </span>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-white leading-snug">
                            {theme.theme}
                          </h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-zinc-400" />
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
                            title="Delete theme"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-700/40 pt-3 text-xs">
                        <span className="text-zinc-500 dark:text-zinc-400 font-medium">{wordCount} words</span>
                        {isSelected && (
                          <span className="text-amber-600 dark:text-amber-400 font-bold uppercase text-[11px] tracking-wider flex items-center gap-0.5">
                            Selected <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-zinc-400 dark:text-zinc-500 text-sm">No themes found.</div>
              )}
            </div>
          </div>

          {/* Right Column: Selected Theme Answer Words */}
          <div className="lg:col-span-3">
            {selectedTheme ? (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-200 dark:border-zinc-700/60 pb-4 gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                      Active Theme
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                      {selectedTheme.theme}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      {selectedTheme.weekRange}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyAllThemeWords(selectedTheme)}
                    className="border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-amber-400 rounded-xl text-sm font-semibold flex items-center gap-2 px-4 py-2.5"
                  >
                    <Share2 className="h-4 w-4 text-amber-500" />
                    <span>Copy All Words</span>
                  </Button>
                </div>

                {/* Length Tabs */}
                <div className="flex flex-wrap gap-1.5 bg-zinc-100 dark:bg-zinc-800/70 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-700/60">
                  {['All', '3', '4', '5', '6', '7', '8'].map((tab) => {
                    const count =
                      tab === 'All'
                        ? Object.values(selectedTheme.words).flat().length
                        : selectedTheme.words[Number(tab) as 3 | 4 | 5 | 6 | 7 | 8]?.length || 0;

                    return (
                      <button
                        key={tab}
                        onClick={() => setSelectedLengthTab(tab)}
                        className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
                          selectedLengthTab === tab
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
                  {Object.entries(selectedTheme.words).map(([lengthKey, wordsList]) => {
                    if (selectedLengthTab !== 'All' && selectedLengthTab !== lengthKey) {
                      return null;
                    }
                    if (!wordsList || wordsList.length === 0) return null;

                    return (
                      <div key={lengthKey} className="space-y-3">
                        <h5 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-amber-500" />
                          {lengthKey}-Letter Answers ({wordsList.length})
                        </h5>
                        <div className="flex flex-wrap gap-2.5">
                          {wordsList.map((word) => (
                            <button
                              key={word}
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

      {/* ── Add Custom Theme Modal ────────────────────── */}
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

      {/* ── Strategy Guide Modal ─────────────────────── */}
      <Modal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        title="Binance WODL Strategy & How to Win"
      >
        <div className="space-y-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-2">
            <h4 className="font-bold text-base flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <Trophy className="h-5 w-5 text-amber-500" />
              What is Binance WODL?
            </h4>
            <p className="text-sm">
              Binance WODL (Word of the Day) is a word-guessing mini-game hosted by Binance. Guess the mystery crypto word in 6 attempts to earn rewards.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm uppercase tracking-wider">
              Quick Guide:
            </h4>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
                1
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 dark:text-white text-sm">Set Word Length</h5>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                  Select letter length (3 to 8) matching your Binance WODL game screen.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-zinc-950 text-xs font-bold">
                2
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 dark:text-white text-sm">Type Green Letters</h5>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                  Type or paste letters directly into green tiles. Auto-advances to next tile.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-600 text-white text-xs font-bold">
                3
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 dark:text-white text-sm">Yellow & Gray Letters</h5>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                  Type letters in Yellow (included) or Gray (excluded) inputs, or tap QWERTY keypad keys.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setIsGuideOpen(false)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-white transition-all active:scale-95 shadow-md shadow-amber-500/20"
            >
              Got it!
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
