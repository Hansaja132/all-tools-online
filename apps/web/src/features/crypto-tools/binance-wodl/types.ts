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

export interface CandidateWord {
  word: string;
  isConfirmed: boolean;
}

export interface FilterState {
  wordLength: number; // 3 | 4 | 5 | 6 | 7 | 8
  positionedLetters: string[]; // Length equals wordLength
  requiredLetters: string; // Unknown position letters, e.g. "RTA" or "AA"
  excludedLetters: string; // Letters confirmed not in word, e.g. "XYZ"
}
