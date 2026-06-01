import type { Command, CommandContext } from "../../../types";
import type { JobManager } from "../../../command-executer";

export class JobsCommand implements Command {
  readonly name = "jobs";

  constructor(private jobManager: JobManager) {}

  execute(context: CommandContext): void {
    const jobs = this.jobManager.list();
    if (jobs.length === 0) return;

    const mostRecentJob = jobs[jobs.length - 1];
    const previousJob = this.getPreviousJob(jobs, mostRecentJob);

    for (const job of jobs) {
      const marker =
        job.id === mostRecentJob.id
          ? "+"
          : job.id === previousJob?.id
            ? "-"
            : " ";
      const status = job.status.padEnd(24, " ");
      const trailing = job.status === "Running" ? " &" : "";
      context.stdout.write(
        `[${job.id}]${marker}  ${status}${job.command}${trailing}\n`,
      );
    }
  }

  private getPreviousJob(
    jobs: Array<{ id: number; status: string }>,
    mostRecentJob: { id: number; status: string },
  ) {
    if (jobs.length < 2) return undefined;

    if (mostRecentJob.status === "Running") {
      return jobs[jobs.length - 2];
    }

    return (
      [...jobs]
        .slice(0, jobs.length - 1)
        .reverse()
        .find((job) => job.status === "Running") ?? jobs[jobs.length - 2]
    );
  }
}
