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
    content: 'asdf jkl; asdf jkl; asdf jkl; asdf jkl; a s d f j k l ; asdf jkl; fdsa ;lkj',
    passingCriteria: { minWpm: 15, minAccuracy: 95 }
  },
  {
    id: 'basics-2',
    categoryId: 'beginner',
    title: 'Home Row Reaches',
    description: 'Reaching for G and H from the home row.',
    content: 'asdfg jkl;h gfdsa h;lkj fghj jhgfg fghj asdfg jkl;h asdfg hjkl;',
    passingCriteria: { minWpm: 15, minAccuracy: 95 }
  },
  {
    id: 'basics-3',
    categoryId: 'beginner',
    title: 'Top Row Vowels',
    description: 'Learn E and I.',
    content: 'de ki de ki de ki ded kik ded kik de ki de ki ded kik ded kik',
    passingCriteria: { minWpm: 15, minAccuracy: 95 }
  },
  
  // Intermediate
  {
    id: 'inter-1',
    categoryId: 'intermediate',
    title: 'Shift Keys',
    description: 'Using the opposite shift key for capital letters.',
    content: 'The Quick Brown Fox Jumps Over The Lazy Dog. Typing Is Fun.',
    passingCriteria: { minWpm: 25, minAccuracy: 96 }
  },
  {
    id: 'inter-2',
    categoryId: 'intermediate',
    title: 'Numbers Row',
    description: 'Reaching up for the number keys.',
    content: '1 2 3 4 5 6 7 8 9 0 123 456 7890 0987 654 321 135 246 790',
    passingCriteria: { minWpm: 20, minAccuracy: 95 }
  },
  {
    id: 'inter-3',
    categoryId: 'intermediate',
    title: 'Punctuation',
    description: 'Commas, periods, quotes, and question marks.',
    content: 'Hello, world! How are you? I am fine, thank you. "Code is poetry."',
    passingCriteria: { minWpm: 25, minAccuracy: 96 }
  },
  
  // Advanced
  {
    id: 'adv-1',
    categoryId: 'advanced',
    title: 'Programming Symbols',
    description: 'Brackets, braces, parentheses, and arithmetic operators.',
    content: 'function() { return (a + b) * [c - d]; } => !== === <= >=',
    passingCriteria: { minWpm: 30, minAccuracy: 97 }
  },
  {
    id: 'adv-2',
    categoryId: 'advanced',
    title: 'Speed Drill',
    description: 'A mix of tough words to challenge your speed.',
    content: 'rhythm syzygy queue anomalous ubiquitous xylophone zephyr juxtaposition',
    passingCriteria: { minWpm: 40, minAccuracy: 95 }
  },
];
