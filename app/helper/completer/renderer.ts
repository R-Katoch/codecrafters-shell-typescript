export function ringBell() {
  process.stdout.write("\x07");
}

export function renderSuggestions(
  suggestions: string[],
  line: string,
) {
  process.stdout.write("\n");

  process.stdout.write(
    suggestions.join("  "),
  );

  process.stdout.write(
    `\n$ ${line}`,
  );
}