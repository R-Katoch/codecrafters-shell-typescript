import fs from "fs";
import path from "path";

export function getFileMatches(
  input: string,
): string[] {
  const dir = path.dirname(input);
  const partial = path.basename(input);

  const targetDir =
    dir === "."
      ? process.cwd()
      : path.resolve(dir);

  try {
    const entries =
      fs.readdirSync(targetDir);

    return entries
      .filter((entry) =>
        entry.startsWith(partial),
      )
      .map((entry) =>
        dir === "."
          ? entry
          : path.join(dir, entry),
      )
      .sort();
  } catch {
    return [];
  }
}