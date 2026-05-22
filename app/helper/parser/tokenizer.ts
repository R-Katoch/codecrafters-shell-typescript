export function tokenize(input: string): string[] {
  const tokens: string[] = [];

  let current = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // toggle quote mode
    if (char === "'") {
      inSingleQuote = !inSingleQuote;
      continue;
    }

    if (char === '"') {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    // whitespace outside quotes
    if (char === " " && !inSingleQuote && !inDoubleQuote) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }

      continue;
    }

    // normal character
    current += char;
  }

  // last token
  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}