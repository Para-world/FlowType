/**
 * Adaptive Practice Paragraph Generator
 * 
 * Analyzes a user's typing error patterns and generates practice content
 * that emphasizes their weakest characters and character combinations.
 */

const STORAGE_KEY = 'flowtype-char-errors';

// ─── Large Word Bank (~500 common English words) ─────────────────
// Curated for variety in character coverage
const WORD_BANK = [
  // Common short words
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how",
  // Medium words
  "work", "first", "well", "way", "even", "new", "want", "because",
  "any", "these", "give", "day", "most", "find", "here", "thing",
  "many", "very", "still", "should", "call", "world", "long", "need",
  "house", "show", "hand", "high", "keep", "last", "story", "great",
  "where", "life", "play", "small", "end", "put", "home", "read",
  "help", "line", "turn", "move", "live", "real", "left", "same",
  "begin", "while", "number", "right", "part", "through", "change",
  // Words rich in 'q', 'z', 'x', 'j', 'k' (commonly weak characters)
  "quick", "quite", "quiet", "queen", "quest", "quote", "quiz",
  "quality", "quarter", "question", "unique", "require", "equal",
  "squeeze", "technique", "frequent", "liquid", "sequence",
  "zero", "zone", "puzzle", "freeze", "breeze", "citizen", "realize",
  "organize", "horizon", "amazing", "gazette", "magazine", "pizzazz",
  "extra", "exact", "example", "exist", "expect", "explain", "explore",
  "extreme", "expand", "express", "except", "examine", "exchange",
  "execute", "exercise", "exhibit", "external", "excellent", "excite",
  "jump", "just", "join", "job", "joy", "judge", "jacket", "jungle",
  "justify", "journey", "junior", "major", "project", "subject",
  "object", "reject", "adjust", "enjoy", "injure",
  "kind", "know", "keep", "key", "kick", "king", "kitchen", "knife",
  "knock", "dark", "book", "look", "like", "walk", "week", "work",
  "black", "break", "check", "clock", "drink", "quick", "thick",
  // Words rich in punctuation-adjacent patterns
  "because", "between", "before", "become", "behind", "believe",
  "beyond", "beautiful", "beginning", "benefit", "building",
  "business", "certainly", "challenge", "character", "children",
  "community", "company", "complete", "computer", "condition",
  "consider", "continue", "control", "country", "cultural",
  "current", "customer", "daughter", "decision", "defense",
  "describe", "design", "develop", "different", "difficult",
  "direction", "discover", "discuss", "document", "during",
  "economic", "education", "effect", "effort", "election",
  "employee", "energy", "enough", "entire", "environment",
  "establish", "evening", "evidence", "exactly", "example",
  "experience", "explain", "factory", "family", "feature",
  "federal", "feeling", "figure", "finally", "financial",
  "foreign", "forget", "forward", "freedom", "friend",
  "function", "future", "garden", "general", "generation",
  "global", "government", "ground", "growth", "happen",
  "health", "heart", "heavy", "herself", "himself",
  "history", "hospital", "however", "hundred", "husband",
  "identify", "imagine", "impact", "important", "improve",
  "include", "increase", "indicate", "industry", "information",
  "instead", "interest", "interview", "involve", "issue",
  "kitchen", "knowledge", "language", "large", "later",
  "leader", "learning", "letter", "level", "library",
  "listen", "little", "local", "machine", "manage",
  "market", "material", "matter", "measure", "media",
  "medical", "meeting", "member", "memory", "mention",
  "message", "method", "middle", "military", "million",
  "minute", "mission", "modern", "moment", "money",
  "month", "morning", "mother", "movement", "music",
  "myself", "nation", "nature", "nearly", "necessary",
  "network", "never", "nothing", "notice", "number",
  "office", "officer", "official", "often", "operation",
  "opinion", "opportunity", "option", "order", "outside",
  "owner", "painting", "parent", "particular", "partner",
  "pattern", "people", "perfect", "perform", "perhaps",
  "period", "person", "personal", "phone", "physical",
  "picture", "place", "player", "please", "point",
  "policy", "political", "popular", "position", "positive",
  "possible", "power", "practice", "prepare", "present",
  "president", "pressure", "pretty", "prevent", "private",
  "probably", "problem", "process", "produce", "product",
  "professional", "professor", "program", "project", "property",
  "protect", "prove", "provide", "public", "purpose",
  "quality", "question", "quickly", "radio", "raise",
  "rather", "reach", "ready", "reality", "reason",
  "receive", "recent", "record", "reduce", "reflect",
  "region", "relate", "release", "remain", "remember",
  "remove", "report", "represent", "require", "research",
  "resource", "respond", "result", "return", "reveal",
  "review", "rhythm", "right", "season", "second",
  "section", "security", "senior", "serious", "serve",
  "service", "several", "shoulder", "significant", "similar",
  "simple", "simply", "single", "sister", "situation",
  "skill", "social", "society", "soldier", "somebody",
  "someone", "something", "sometimes", "special", "specific",
  "speech", "spring", "staff", "stage", "standard",
  "statement", "station", "still", "stock", "strategy",
  "street", "strong", "structure", "student", "study",
  "stuff", "style", "subject", "success", "suffer",
  "suggest", "summer", "support", "surface", "surprise",
  "system", "table", "teacher", "technology", "television",
  "temperature", "thank", "theory", "thought", "thousand",
  "through", "throughout", "together", "tonight", "total",
  "toward", "trade", "traditional", "training", "travel",
  "treatment", "trial", "trouble", "truth", "understand",
  "unit", "until", "value", "various", "victim",
  "violence", "visit", "voice", "water", "weapon",
  "weather", "weight", "western", "whatever", "whether",
  "window", "within", "without", "wonder", "worker",
  "writing", "wrong", "young", "yourself"
];

// ─── Weakness Profile ────────────────────────────────

/**
 * Loads the accumulated char error map from localStorage.
 * Returns { [char]: { correct: N, incorrect: N } }
 */
export function loadCharErrors() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Merges new test errors into the stored profile.
 * Uses exponential moving average so recent tests weigh more.
 */
export function saveCharErrors(newCharErrorMap) {
  if (typeof window === 'undefined') return;

  const existing = loadCharErrors();
  const DECAY = 0.7; // How much to weight old data (0-1). Lower = faster adaptation.

  for (const [char, counts] of Object.entries(newCharErrorMap)) {
    if (existing[char]) {
      // Blend old and new with exponential decay
      existing[char] = {
        correct: Math.round(existing[char].correct * DECAY + counts.correct),
        incorrect: Math.round(existing[char].incorrect * DECAY + counts.incorrect),
      };
    } else {
      existing[char] = { ...counts };
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

/**
 * Computes a weakness profile from the stored char error data.
 * Returns an array of { char, errorRate, totalAttempts } sorted by errorRate desc.
 */
export function getWeaknessProfile() {
  const errors = loadCharErrors();
  const profile = [];

  for (const [char, counts] of Object.entries(errors)) {
    const total = counts.correct + counts.incorrect;
    if (total >= 3) { // Need at least 3 attempts to be meaningful
      const errorRate = counts.incorrect / total;
      profile.push({ char, errorRate, totalAttempts: total });
    }
  }

  // Sort by error rate descending (weakest first)
  profile.sort((a, b) => b.errorRate - a.errorRate);
  return profile;
}

/**
 * Scores a word based on how many weak characters it contains.
 * Higher score = more relevant for adaptive practice.
 */
function scoreWord(word, weakChars) {
  let score = 0;
  const lowerWord = word.toLowerCase();

  for (const { char, errorRate } of weakChars) {
    for (const c of lowerWord) {
      if (c === char) {
        score += errorRate; // Weighted by how bad the error rate is
      }
    }
  }

  return score;
}

/**
 * Generates an adaptive word list that emphasizes the user's weakest characters.
 * 
 * @param {number} wordCount - Number of words to generate
 * @returns {string[]} - Array of words biased toward weak characters
 */
export function generateAdaptiveWords(wordCount = 50) {
  const profile = getWeaknessProfile();

  // If no weakness data yet, fall back to random words
  if (profile.length === 0) {
    return pickRandomWords(wordCount);
  }

  // Take the top 8 weakest characters
  const weakChars = profile.slice(0, 8);

  // Score every word in the bank
  const scored = WORD_BANK.map(word => ({
    word,
    score: scoreWord(word, weakChars),
  }));

  // Split into relevant (score > 0) and filler (score === 0)
  const relevant = scored.filter(s => s.score > 0);
  const filler = scored.filter(s => s.score === 0);

  // Sort relevant words by score descending
  relevant.sort((a, b) => b.score - a.score);

  // Build the word list:
  // ~70% from relevant words (weighted random), ~30% filler for natural flow
  const result = [];
  const relevantCount = Math.ceil(wordCount * 0.7);
  const fillerCount = wordCount - relevantCount;

  // Weighted random pick from relevant words
  for (let i = 0; i < relevantCount; i++) {
    result.push(weightedPick(relevant));
  }

  // Random filler words
  for (let i = 0; i < fillerCount; i++) {
    if (filler.length > 0) {
      result.push(filler[Math.floor(Math.random() * filler.length)].word);
    } else {
      result.push(relevant[Math.floor(Math.random() * relevant.length)].word);
    }
  }

  // Shuffle to avoid obvious patterns
  shuffleArray(result);
  return result;
}

/**
 * Picks a word from scored array with probability weighted by score.
 */
function weightedPick(scoredWords) {
  const totalScore = scoredWords.reduce((sum, s) => sum + s.score, 0);
  let rand = Math.random() * totalScore;

  for (const s of scoredWords) {
    rand -= s.score;
    if (rand <= 0) return s.word;
  }

  return scoredWords[scoredWords.length - 1].word;
}

function pickRandomWords(count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]);
  }
  return result;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Returns a human-readable summary of the user's weaknesses.
 * Useful for displaying in the UI.
 */
export function getWeaknessSummary() {
  const profile = getWeaknessProfile();
  if (profile.length === 0) return null;

  const topWeak = profile.slice(0, 5).map(p => ({
    char: p.char === ' ' ? 'space' : p.char,
    errorRate: Math.round(p.errorRate * 100),
  }));

  return topWeak;
}
