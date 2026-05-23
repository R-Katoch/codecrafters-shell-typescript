import fs from "fs";
import path from "path";

function getPathExecutables(): string[] {
  const envPath = process.env.PATH || "";

  const dirs = envPath.split(":");

  const executables = new Set<string>();

  for (const dir of dirs) {
    try {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        executables.add(file);
      }
    } catch {
      // ignore invalid dirs
    }
  }

  return [...executables];
}

const builtins = ["echo", "exit", "type", "pwd", "cd"];
const pathExecutables = getPathExecutables();

export const allCommands = [...new Set([...builtins, ...pathExecutables])];