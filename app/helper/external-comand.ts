import { spawn } from "child_process";

export function runExternalCommand(
  executablePath: string,
  commandName: string,
  args: string[],
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(executablePath, args, {
      argv0: commandName,
      stdio: "inherit",
    });
    child.on("error", (err: { message: any; }) => {
      console.error(err.message);
      reject(err);
    });
    child.on("close", (code: any) => {
      resolve();
    });
  });
}