import type { Command, CommandContext } from "../../../types";
import type { JobManager } from "../../../command-executer";

export class JobsCommand implements Command {
  readonly name = "jobs";

  constructor(private jobManager: JobManager) {}

  execute(context: CommandContext): void {
    const jobs = this.jobManager.list();
    if (jobs.length === 0) return;

    const mostRecentJob = jobs[jobs.length - 1];
    const previousJob = jobs.length > 1 ? jobs[jobs.length - 2] : undefined;

    for (const job of jobs) {
      const marker = job.id === mostRecentJob.id
        ? "+"
        : job.id === previousJob?.id
        ? "-"
        : " ";
      const status = job.status.padEnd(24, " ");
      const trailing = job.status === "Running" ? " &" : "";
      context.stdout.write(`[${job.id}]${marker}  ${status}${job.command}${trailing}\n`);
    }

    this.jobManager.removeDoneJobs();
  }
}
