import type { ParsedCommand } from "../types";
import type { ExecutorContext } from "../types";

import { resolveFromPath } from "../helper/path-resolver";
import { runExternalCommand, spawnExternalCommand } from "../helper/external-comand";
import { createStderrStream, createStdoutStream } from "../helper/redirect";

type BackgroundJob = {
  id: number;
  pid: number;
  command: string;
  status: "Running";
};

export class JobManager {
  private nextJobId = 1;
  private jobs = new Map<number, BackgroundJob>();

  add(command: string, pid: number) {
    const id = this.nextJobId++;
    const job: BackgroundJob = {
      id,
      pid,
      command,
      status: "Running",
    };

    this.jobs.set(id, job);
    return job;
  }

  remove(jobId: number) {
    this.jobs.delete(jobId);
  }

  list() {
    return [...this.jobs.values()];
  }
}

export class CommandExecutor {
  constructor(private context: ExecutorContext, private jobManager: JobManager) {}

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
        const commandString = args.length > 0 ? `${command} ${args.join(" ")}` : command;

        if (typeof child.pid === "number") {
          const job = this.jobManager.add(commandString, child.pid);
          console.log(`[${job.id}] ${job.pid}`);

          child.on("close", () => {
            this.jobManager.remove(job.id);
          });
        }

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
