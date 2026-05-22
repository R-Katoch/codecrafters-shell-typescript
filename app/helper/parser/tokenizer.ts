export function tokenize(input: string): string[] {
  const tokens: string[] = [];

  let current = "";

  let inSingleQuote = false;
  let inDoubleQuote = false;

  let tokenStarted = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // single quotes only work outside double quotes
    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      tokenStarted = true;
      continue;
    }

    // double quotes only work outside single quotes
    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      tokenStarted = true;
      continue;
    }

    // whitespace outside quotes = separator
    if (
      (char === " " || char === "\t") &&
      !inSingleQuote &&
      !inDoubleQuote
    ) {
      if (tokenStarted) {
        tokens.push(current);
        current = "";
        tokenStarted = false;
      }

      continue;
    }

    current += char;
    tokenStarted = true;
  }

  // final token
  if (tokenStarted) {
    tokens.push(current);
  }

  return tokens;
}