import { getAllCommands } from '../../../helper';

export function getCommandMatches(
  input: string,
): string[] {
  return getAllCommands()
    .filter((cmd) =>
      cmd.startsWith(input),
    )
    .sort()
    .map((cmd) => cmd + " ");
}