export function tokenize(input: string): string[] {
  const tokens: string[] = [];

  let current = "";

  let inSingleQuote = false;
  let inDoubleQuote = false;

  let tokenStarted = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // ---------------------------------
    // BACKSLASH
    // ---------------------------------

    if (char === "\\") {
      const next = input[i + 1];

      // single quotes:
      // backslash is literal
      if (inSingleQuote) {
        current += "\\";
        tokenStarted = true;
        continue;
      }

      // double quotes:
      // only escape \, ", $
      if (inDoubleQuote) {
        if (
          next === "\\" ||
          next === '"' ||
          next === "$"
        ) {
          current += next;
          tokenStarted = true;
          i++;
          continue;
        }

        // otherwise preserve backslash
        current += "\\";
        tokenStarted = true;
        continue;
      }

      // outside quotes:
      // escape ANY next char
      if (next !== undefined) {
        current += next;
        tokenStarted = true;
        i++;
        continue;
      }
    }

    // ---------------------------------
    // SINGLE QUOTES
    // ---------------------------------

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      tokenStarted = true;
      continue;
    }

    // ---------------------------------
    // DOUBLE QUOTES
    // ---------------------------------

    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      tokenStarted = true;
      continue;
    }

    // ---------------------------------
    // WHITESPACE
    // ---------------------------------

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

    // normal char
    current += char;
    tokenStarted = true;
  }

  // final token
  if (tokenStarted) {
    tokens.push(current);
  }

  return tokens;
}