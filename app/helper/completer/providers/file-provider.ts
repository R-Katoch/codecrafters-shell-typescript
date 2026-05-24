import fs from "fs";
import path from "path";

export function getFileMatches(input: string): string[] {
  const endsWithSlash = input.endsWith("/");

  const dir = endsWithSlash ? input.slice(0, -1) : path.dirname(input);

  const partial = endsWithSlash ? "" : path.basename(input);

  const targetDir =
    dir === "." || dir === "" ? process.cwd() : path.resolve(dir);

  try {
    const entries = fs.readdirSync(targetDir);

    return entries
      .filter((entry) => entry.startsWith(partial))
      .map((entry) => {
        const fullPath = path.join(targetDir, entry);

        const isDirectory = fs.statSync(fullPath).isDirectory();

        const completed =
          dir === "." || dir === "" ? entry : path.join(dir, entry);

        return isDirectory ? completed + "/" : completed + " ";
      })
      .sort();
  } catch {
    return [];
  }
}
