import { spawn } from "child_process";

export function runExternalCommand(
  executablePath: string,
  args: string[]
) {
  const child = spawn(executablePath, args, {
    stdio: "inherit",
  });

  child.on("error", (err) => {
    console.error(err.message);
  });
}