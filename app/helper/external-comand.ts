import { spawn } from "child_process";
import type { Writable } from "stream";

export function runExternalCommand(
  executablePath: string,
  args: string[],
  commandName: string,
  stdout: Writable,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(executablePath, args, {
      argv0: commandName,
      stdio: ["inherit", "pipe", "inherit"],
    });

    if (child.stdout) {
      child.stdout.pipe(stdout);
    }

    child.on("error", reject);
    child.on("close", () => resolve());
  });
}
