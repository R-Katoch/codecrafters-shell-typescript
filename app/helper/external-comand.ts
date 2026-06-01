import { spawn, type ChildProcessWithoutNullStreams } from "child_process";
import type { Writable } from "stream";

export function spawnExternalCommand(
  executablePath: string,
  args: string[],
  commandName: string,
  stdout: Writable,
  stderr: Writable,
): ChildProcessWithoutNullStreams {
  const child = spawn(executablePath, args, {
    argv0: commandName,
    stdio: ["inherit", "pipe", "pipe"],
  });

  child.stdout?.pipe(stdout);
  child.stderr?.pipe(stderr);

  return child;
}

export function runExternalCommand(
  executablePath: string,
  args: string[],
  commandName: string,
  stdout: Writable,
  stderr: Writable,
): Promise<void> {
  const child = spawnExternalCommand(executablePath, args, commandName, stdout, stderr);

  return new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", () => resolve());
  });
}
