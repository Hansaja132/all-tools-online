import { CandidateWord, FilterState } from './types';

/**
 * Normalizes a candidate word: uppercase and trimmed.
 */
export function normalizeWord(word: string): string {
  return (word || '').trim().toUpperCase();
}

/**
 * Normalizes user input letters: strips non-alphabetic characters and converts to uppercase.
 */
export function normalizeInput(input: string): string {
  return (input || '').toUpperCase().replace(/[^A-Z]/g, '');
}

/**
 * Checks whether the word satisfies all populated exact-position constraints.
 * For index i where positionedLetters[i] is defined and non-empty,
 * candidate[i] must strictly equal positionedLetters[i].
 */
export function matchesPositionConstraints(
  word: string,
  positionedLetters: string[]
): boolean {
  for (let i = 0; i < positionedLetters.length; i++) {
    const expected = positionedLetters[i];
    if (expected && expected.trim() !== '') {
      if (word[i] !== expected.toUpperCase()) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks that the candidate word contains at least the required letter occurrences.
 * Handles duplicate letters correctly (e.g. required "AA" requires at least two 'A's).
 */
export function containsRequiredLetters(
  word: string,
  requiredLetters: string
): boolean {
  const normalizedReq = normalizeInput(requiredLetters);
  if (!normalizedReq) return true;

  // Build letter frequency requirement
  const reqCounts: Record<string, number> = {};
  for (const ch of normalizedReq) {
    reqCounts[ch] = (reqCounts[ch] || 0) + 1;
  }

  // Count candidate word letter frequency
  const wordCounts: Record<string, number> = {};
  for (const ch of word) {
    wordCounts[ch] = (wordCounts[ch] || 0) + 1;
  }

  // Candidate must have at least the required count of each letter
  for (const [ch, requiredCount] of Object.entries(reqCounts)) {
    if ((wordCounts[ch] || 0) < requiredCount) {
      return false;
    }
  }

  return true;
}

/**
 * Checks that the candidate word contains NONE of the excluded letters.
 */
export function containsNoExcludedLetters(
  word: string,
  excludedLetters: string
): boolean {
  const normalizedExcluded = normalizeInput(excludedLetters);
  if (!normalizedExcluded) return true;

  for (const ch of normalizedExcluded) {
    if (word.includes(ch)) {
      return false;
    }
  }
  return true;
}

/**
 * Pure and deterministic filtering pipeline:
 * Candidates -> Normalize -> Length Filter -> Position Constraints -> Required Letters -> Excluded Letters -> Matching Candidates
 */
export function filterWords(
  candidates: CandidateWord[],
  filters: FilterState
): CandidateWord[] {
  const { wordLength, positionedLetters, requiredLetters, excludedLetters } = filters;

  return candidates.filter((item) => {
    const word = normalizeWord(item.word);

    // 1. Length constraint
    if (word.length !== wordLength) {
      return false;
    }

    // 2. Exact positional letter constraints
    if (!matchesPositionConstraints(word, positionedLetters)) {
      return false;
    }

    // 3. Required / Unknown position letter constraints (with duplicate support)
    if (!containsRequiredLetters(word, requiredLetters)) {
      return false;
    }

    // 4. Excluded letter constraints
    if (!containsNoExcludedLetters(word, excludedLetters)) {
      return false;
    }

    return true;
  });
}
