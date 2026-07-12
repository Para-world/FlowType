export const CODE_SNIPPETS = {
  javascript: [
    "const toggle = () => setOpen(!isOpen);",
    "export default function App() { return <div>Hello World</div>; }",
    "let result = arr.filter(x => x > 10).map(x => x * 2);"
  ],
  python: [
    "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)",
    "import pandas as pd\ndf = pd.read_csv('data.csv')\nprint(df.head())"
  ],
  html: [
    "<div class=\"container\">\n  <h1 id=\"title\">Welcome</h1>\n</div>",
    "<form onSubmit=\"handleSubmit\">\n  <input type=\"text\" required />\n  <button type=\"submit\">Submit</button>\n</form>"
  ]
};

export function getRandomSnippet(language) {
  const bank = CODE_SNIPPETS[language] || CODE_SNIPPETS.javascript;
  return bank[Math.floor(Math.random() * bank.length)];
}
