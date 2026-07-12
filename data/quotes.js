export const QUOTES = [
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "inspirational" },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein", category: "famous" },
  { text: "So many books, so little time.", author: "Frank Zappa", category: "books" },
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi", category: "inspirational" },
  { text: "May the Force be with you.", author: "Star Wars", category: "movies" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds", category: "technology" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", category: "technology" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "business" },
];

export function getRandomQuote(category = 'all') {
  const filtered = category === 'all' ? QUOTES : QUOTES.filter(q => q.category === category);
  return filtered[Math.floor(Math.random() * filtered.length)];
}
