import type { Command, CommandContext } from "../../../types";
import type { JobManager } from "../../../command-executer";

export class JobsCommand implements Command {
  readonly name = "jobs";

  constructor(private jobManager: JobManager) {}

  execute(context: CommandContext): void {
    const jobs = this.jobManager.list();
    if (jobs.length === 0) return;

    const mostRecentJob = jobs[jobs.length - 1];

    for (const job of jobs) {
      const marker = job.id === mostRecentJob.id ? "+" : " ";
      const status = job.status.padEnd(24, " ");
      context.stdout.write(`[${job.id}]${marker}  ${status}${job.command} &\n`);
    }
  }
}
