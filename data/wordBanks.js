export const MODULES = {
  words: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see",
    "other", "than", "then", "now", "look", "only", "come", "its", "over",
    "think", "also", "back", "after", "use", "two", "how", "our", "work"
  ],
  capitals: [
    "The", "Hello", "World", "Apple", "Google", "Amazon", "Monday", "Friday",
    "January", "March", "April", "August", "October", "November", "December",
    "London", "Paris", "Tokyo", "Berlin", "Madrid", "Sydney", "Moscow", "Dubai"
  ],
  numbers: [
    "123", "456", "789", "1024", "2048", "4096", "8192", "16384",
    "3.14", "2.71", "1.41", "9.81", "0.577", "1.618", "2.236", "6.022",
    "100", "200", "300", "500", "750", "1000", "2500", "5000", "10000"
  ],
  symbols: [
    "!@#$", "%^&*", "(){}", "[]<>", "+-=_", "~`|\\",
    "@#$%", "^&*(", ")_+-", "=[]{}",  "|\\:;", "',./<>?",
    "!!", "??", "##", "$$", "%%", "&&", "**", "++", "--", "=="
  ],
  punctuation: [
    "Hello,", "world!", "How", "are", "you?", "I'm", "fine,", "thanks.",
    "It's", "a", "beautiful", "day,", "isn't", "it?", "Yes,", "indeed!",
    "Wait...", "really?", "Of", "course!", "Let's", "go.", "No,", "wait."
  ],
  code: [
    "const", "let", "var", "function", "return", "if", "else", "for",
    "while", "do", "switch", "case", "break", "continue", "class",
    "extends", "import", "export", "default", "from", "async", "await"
  ],
  mixed: [] // Generated on fly
};

// Generate mixed
export function getMixedBank() {
  const allBanks = ['words', 'capitals', 'numbers', 'symbols', 'punctuation', 'code'];
  const mixed = [];
  allBanks.forEach(key => {
    const bank = MODULES[key];
    const count = Math.min(bank.length, 20);
    for (let i = 0; i < count; i++) {
      mixed.push(bank[Math.floor(Math.random() * bank.length)]);
    }
  });
  return mixed;
}

export function generateWordsList(module, count) {
  let bank = MODULES[module] || MODULES.words;
  if (module === 'mixed') {
    bank = getMixedBank();
  }
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(bank[Math.floor(Math.random() * bank.length)]);
  }
  return result;
}
