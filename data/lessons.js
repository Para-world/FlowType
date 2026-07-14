export const lessonCategories = [
  {
    id: 'beginner',
    title: 'Beginner Basics',
    description: 'Learn the fundamentals of touch typing, starting from the home row.',
    color: 'var(--primary)',
  },
  {
    id: 'intermediate',
    title: 'Intermediate Skills',
    description: 'Master shift keys, numbers, and common punctuation marks.',
    color: 'var(--secondary)',
  },
  {
    id: 'advanced',
    title: 'Advanced Mastery',
    description: 'Special characters, programming symbols, and speed drills.',
    color: 'var(--success)',
  }
];

export const lessons = [
  // Beginner
  {
    id: 'basics-1',
    categoryId: 'beginner',
    title: 'The Home Row',
    description: 'Learn the core resting position: ASDF JKL;',
    unlockedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    passingCriteria: { minWpm: 15, minAccuracy: 95, confidenceThreshold: 0.7 }
  },
  {
    id: 'basics-2',
    categoryId: 'beginner',
    title: 'Home Row Reaches',
    description: 'Reaching for G and H from the home row.',
    unlockedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    passingCriteria: { minWpm: 18, minAccuracy: 95, confidenceThreshold: 0.75 }
  },
  {
    id: 'basics-3',
    categoryId: 'beginner',
    title: 'Top Row Vowels',
    description: 'Learn E and I.',
    unlockedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'e', 'i'],
    passingCriteria: { minWpm: 20, minAccuracy: 95, confidenceThreshold: 0.8 }
  },
  {
    id: 'basics-4',
    categoryId: 'beginner',
    title: 'Remaining Top Row',
    description: 'Learn Q, W, R, T, Y, U, O, P.',
    unlockedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    passingCriteria: { minWpm: 25, minAccuracy: 96, confidenceThreshold: 0.8 }
  },
  {
    id: 'basics-5',
    categoryId: 'beginner',
    title: 'Bottom Row',
    description: 'Learn Z, X, C, V, B, N, M.',
    unlockedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    passingCriteria: { minWpm: 30, minAccuracy: 96, confidenceThreshold: 0.85 }
  },
  
  // Intermediate
  {
    id: 'inter-1',
    categoryId: 'intermediate',
    title: 'Shift Keys',
    description: 'Using the opposite shift key for capital letters.',
    unlockedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'A', 'S', 'D', 'F', 'J', 'K', 'L', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    passingCriteria: { minWpm: 35, minAccuracy: 96, confidenceThreshold: 0.85 }
  },
  {
    id: 'inter-2',
    categoryId: 'intermediate',
    title: 'Numbers Row',
    description: 'Reaching up for the number keys.',
    unlockedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    passingCriteria: { minWpm: 30, minAccuracy: 95, confidenceThreshold: 0.85 }
  },
];
