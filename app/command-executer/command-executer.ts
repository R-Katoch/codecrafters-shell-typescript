import type { ParsedCommand } from "../types";
import type { ExecutorContext } from "../types";
import type { ChildProcessWithoutNullStreams } from "child_process";

import { resolveFromPath } from "../helper/path-resolver";
import { runExternalCommand, spawnExternalCommand } from "../helper/external-comand";
import { createStderrStream, createStdoutStream } from "../helper/redirect";

export type BackgroundJobStatus = "Running" | "Done";

export type BackgroundJob = {
  id: number;
  pid: number;
  command: string;
  status: BackgroundJobStatus;
};

type JobRecord = BackgroundJob & {
  child: ChildProcessWithoutNullStreams;
};

export class JobManager {
  private readonly jobs = new Map<number, JobRecord>();

  add(command: string, pid: number, child: ChildProcessWithoutNullStreams) {
    const id = this.getNextJobId();
    const record: JobRecord = {
      id,
      pid,
      command,
      status: "Running",
      child,
    };

    this.jobs.set(id, record);
    return this.toJobSummary(record);
  }

  markDone(jobId: number) {
    const job = this.jobs.get(jobId);
    if (!job) return;
    job.status = "Done";
  }

  reapDoneJobs() {
    this.updateJobStatuses();

    const doneJobs = [...this.jobs.values()]
      .filter((job) => job.status === "Done")
      .map((job) => this.toJobSummary(job));

    for (const job of doneJobs) {
      this.jobs.delete(job.id);
    }

    return doneJobs;
  }

  list() {
    this.updateJobStatuses();
    return [...this.jobs.values()].map((job) => this.toJobSummary(job));
  }

  private getNextJobId() {
    let nextId = 1;
    while (this.jobs.has(nextId)) {
      nextId += 1;
    }
    return nextId;
  }

  private updateJobStatuses() {
    for (const job of this.jobs.values()) {
      if (job.status === "Running" && job.child.exitCode !== null) {
        job.status = "Done";
      }
    }
  }

  private toJobSummary(job: JobRecord): BackgroundJob {
    return {
      id: job.id,
      pid: job.pid,
      command: job.command,
      status: job.status,
    };
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
    if (!executable) {
      console.log(`${command}: command not found`);
      return;
    }

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
  }
}
