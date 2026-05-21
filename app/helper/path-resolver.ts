import fs from "fs";
import path from "path";

export function resolveFromPath(cmd: string): string | null {
  const PATH = process.env.PATH ?? "";
  const dirs = PATH.split(":");

  for (const dir of dirs) {
    const fullPath = path.join(dir, cmd);

    try {
      fs.accessSync(fullPath, fs.constants.X_OK);
      return fullPath;
    } catch {
      // ignore
    }
  }

  return null;
}