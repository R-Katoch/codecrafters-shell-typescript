import type { ParsedCommand } from "../types";
import type { ExecutorContext } from "../types";
import type { ChildProcessWithoutNullStreams } from "child_process";

import { resolveFromPath } from "../helper/path-resolver";
import { runExternalCommand, spawnExternalCommand } from "../helper/external-comand";
import { createStderrStream, createStdoutStream } from "../helper/redirect";

type BackgroundJob = {
  id: number;
  pid: number;
  command: string;
  status: "Running" | "Done";
  child: ChildProcessWithoutNullStreams;
};

export class JobManager {
  private nextJobId = 1;
  private jobs = new Map<number, BackgroundJob>();

  add(command: string, pid: number, child: ChildProcessWithoutNullStreams) {
    const id = this.nextJobId++;
    const job: BackgroundJob = {
      id,
      pid,
      command,
      status: "Running",
      child,
    };

    this.jobs.set(id, job);
    return job;
  }

  markDone(jobId: number) {
    const job = this.jobs.get(jobId);
    if (!job) return;
    job.status = "Done";
  }

  remove(jobId: number) {
    this.jobs.delete(jobId);
  }

  removeDoneJobs() {
    for (const [id, job] of this.jobs) {
      if (job.status === "Done") {
        this.jobs.delete(id);
      }
    }
  }

  updateStatuses() {
    for (const job of this.jobs.values()) {
      if (job.status === "Running" && job.child.exitCode !== null) {
        job.status = "Done";
      }
    }
  }

  reapDoneJobs() {
    this.updateStatuses();
    const doneJobs = [...this.jobs.values()].filter((job) => job.status === "Done");
    for (const job of doneJobs) {
      this.jobs.delete(job.id);
    }
    return doneJobs;
  }

  list() {
    this.updateStatuses();
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
          const job = this.jobManager.add(commandString, child.pid, child);
          console.log(`[${job.id}] ${job.pid}`);

          child.on("exit", () => {
            this.jobManager.markDone(job.id);
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
