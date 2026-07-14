/**
 * Lesson Generator
 * Generates practice text tailored to a specific lesson's unlocked keys.
 */

// A very small dictionary of words that can be formed using early unlocked keys.
// The generator will filter this based on actual unlocked keys.
const EARLY_WORDS = [
  "as", "add", "ask", "all", "alas", "dad", "fad", "fall", "flask", "sad", "salad",
  "has", "had", "half", "hall", "lash", "dash", "flash", "glad", "glass",
  "see", "sea", "she", "he", "fee", "feel", "deal", "lead", "leaf", "fade",
  "is", "if", "did", "fill", "hill", "high", "sigh", "slide", "hide", "side",
  "the", "they", "there", "their", "where", "what", "that", "this", "those",
  "we", "was", "were", "are", "you", "your", "yours", "our", "ours"
];

/**
 * Checks if a word can be typed entirely using the unlocked keys.
 */
function canTypeWord(word, unlockedKeys) {
  const keys = new Set(unlockedKeys.map(k => k.toLowerCase()));
  for (let char of word.toLowerCase()) {
    if (!keys.has(char)) {
      return false;
    }
  }
  return true;
}

/**
 * Generates a random "n-gram" (meaningless chunk of letters) from the unlocked keys.
 * Prioritizes keys with lower confidence scores.
 */
function generateNGram(unlockedKeys, length = 4, confidenceMap = {}) {
  // Filter out punctuation for random ngrams to make them readable
  const letters = unlockedKeys.filter(k => /^[a-zA-Z]$/.test(k));
  if (letters.length === 0) return "a"; // Fallback
  // Calculate weights (inverse of confidence)
  // If confidence is 0.8, weight is 0.2. If confidence is undefined (new key), weight is 1.0.
  const weights = letters.map(k => {
    const conf = confidenceMap[k.toLowerCase()];
    return conf !== undefined ? Math.max(0.1, 1 - conf) : 1.0;
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let ngram = "";
  for (let i = 0; i < length; i++) {
    let rand = Math.random() * totalWeight;
    let selectedChar = letters[0];
    
    for (let j = 0; j < letters.length; j++) {
      rand -= weights[j];
      if (rand <= 0) {
        selectedChar = letters[j];
        break;
      }
    }
    ngram += selectedChar;
  }
  return ngram;
}

/**
 * Generates an array of words for a lesson, using only the unlocked keys.
 * Prioritizes weaker keys if confidenceMap is provided.
 */
export function generateLessonWords(unlockedKeys, wordCount = 30, confidenceMap = {}) {
  const result = [];
  
  // Find all real words we can type
  const availableWords = EARLY_WORDS.filter(w => canTypeWord(w, unlockedKeys));
  
  // Determine if we need to fall back to random ngrams often (e.g. very first lesson)
  const useNgrams = availableWords.length < 5;

  for (let i = 0; i < wordCount; i++) {
    // 30% chance of random ngram if we have words, otherwise 100% ngrams
    if (useNgrams || Math.random() < 0.3) {
      // Pick a random length between 3 and 5
      const len = Math.floor(Math.random() * 3) + 3;
      result.push(generateNGram(unlockedKeys, len, confidenceMap));
    } else {
      // Pick a real word
      // If we have a weakness profile, we could bias this, but for lessons we'll keep it simple: random available word.
      result.push(availableWords[Math.floor(Math.random() * availableWords.length)]);
    }
  }

  // Inject a punctuation mark occasionally if it's unlocked
  const punctuation = unlockedKeys.filter(k => /^[.,;!?]$/.test(k));
  if (punctuation.length > 0) {
    for (let i = 0; i < result.length; i++) {
      if (Math.random() < 0.15) { // 15% chance to append punctuation
        const punc = punctuation[Math.floor(Math.random() * punctuation.length)];
        result[i] = result[i] + punc;
      }
    }
  }

  return result;
}
