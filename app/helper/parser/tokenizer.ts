export function tokenize(input: string): string[] {
  const tokens: string[] = [];

  let current = "";
  let inSingleQuote = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // toggle quote mode
    if (char === "'") {
      inSingleQuote = !inSingleQuote;
      continue;
    }

    // whitespace outside quotes
    if (char === " " && !inSingleQuote) {
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