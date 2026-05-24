import fs from "fs";

const builtins = ["echo", "exit", "type", "pwd", "cd"];

function getPathExecutables(): string[] {
  const envPath = process.env.PATH || "";
  const dirs = envPath.split(":");

  const seen = new Set<string>();
  const result: string[] = [];

  for (const dir of dirs) {
    try {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        if (!seen.has(file)) {
          seen.add(file);
          result.push(file);
        }
      }
    } catch {
      // ignore invalid dirs
    }
  }

  return result;
}

const pathExecutables = getPathExecutables();

export function getAllCommands() {
  return Array.from(new Set([...builtins, ...pathExecutables]));
}