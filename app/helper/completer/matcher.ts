export function getMatches(
  input: string,
  commands: string[],
): string[] {
  return commands
    .filter((command) =>
      command.startsWith(input),
    )
    .sort();
}