import type { ParsedCommand } from "../types";
import type { ExecutorContext } from "../types";

import { resolveFromPath } from "../helper/path-resolver";
import { runExternalCommand, spawnExternalCommand } from "../helper/external-comand";
import { createStderrStream, createStdoutStream } from "../helper/redirect";

type BackgroundJob = {
  id: number;
  pid: number;
  command: string;
};

export class CommandExecutor {
  private nextJobId = 1;
  private jobs = new Map<number, BackgroundJob>();

  constructor(private context: ExecutorContext) {}

  async execute(parsed: ParsedCommand) {
    const { command, args, redirects, background } = parsed;

    if (!command) {
      return;
    }

    const builtin = this.context.registry.get(command);

    const stdout = createStdoutStream(redirects);
    const stderr = createStderrStream(redirects);

    if (builtin) {
      builtin.execute({ args, stdout });
      return;
    }

    const executable = resolveFromPath(command);

    if (executable) {
      if (background) {
        const child = spawnExternalCommand(executable, args, command, stdout, stderr);
        const jobId = this.nextJobId++;

        if (typeof child.pid === "number") {
          this.jobs.set(jobId, {
            id: jobId,
            pid: child.pid,
            command,
          });
          console.log(`[${jobId}] ${child.pid}`);
        }

        child.on("close", () => {
          this.jobs.delete(jobId);
        });

        child.on("error", (error) => {
          stderr.write(`${command}: ${error.message}\n`);
        });

        return;
      }

      await runExternalCommand(executable, args, command, stdout, stderr);
      return;
    }

    console.log(`${command}: command not found`);
  }
}
