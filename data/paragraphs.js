export const PARAGRAPHS = {
  easy: [
    "The sun was shining brightly in the clear blue sky. A gentle breeze blew through the tall green trees. The little dog ran across the soft grass, chasing a red ball. Children were laughing and playing in the park.",
    "I like to read books before I go to sleep. My favorite stories are about brave knights and magical dragons. Reading helps me relax after a long day of school and play. I have a large shelf filled with many colorful books."
  ],
  medium: [
    "Technology has changed the way we communicate with each other. Today, we can send messages instantly across the globe using our smartphones. However, some people argue that we are losing the art of face-to-face conversation. It is important to find a balance between digital connectivity and real-world interactions.",
    "Learning a new language can be a challenging but rewarding experience. It opens up opportunities to connect with different cultures and understand diverse perspectives. Consistent practice and immersion are key to achieving fluency. Don't be afraid to make mistakes, as they are a natural part of the learning process."
  ],
  hard: [
    "The phenomenon of quantum entanglement suggests that particles can remain connected such that the quantum state of one cannot be adequately described independently of the state of the others, even when separated by a large distance. This apparent action at a distance deeply troubled Einstein, who referred to it as 'spooky action at a distance.'",
    "In JavaScript, closures are a fundamental concept where an inner function has access to the outer enclosing function's variables—scope chain. This has three scope chains: it has access to its own scope, it has access to the outer function's variables, and it has access to the global variables."
  ]
};

export function getRandomParagraph(difficulty) {
  const bank = PARAGRAPHS[difficulty] || PARAGRAPHS.medium;
  return bank[Math.floor(Math.random() * bank.length)];
}
