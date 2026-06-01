import readline from "readline";

import { CommandRegistry, JobManager, CommandExecutor } from "./command-executer";

import { CompleteCommand, EchoCommand, JobsCommand } from "./commands";
import { ExitCommand } from "./commands";
import { TypeCommand } from "./commands";
import { PwdCommand } from "./commands";
import { CdCommand } from "./commands";

import { parse } from "./helper/parser/parser";
import { CompletionEngine } from "./helper/completer/completer";

const registry = new CommandRegistry();
const jobManager = new JobManager();
const completionEngine = new CompletionEngine();

registry.register(new EchoCommand());
registry.register(new ExitCommand());
registry.register(new TypeCommand(registry));
registry.register(new PwdCommand());
registry.register(new CdCommand());
registry.register(new CompleteCommand());
registry.register(new JobsCommand(jobManager));

const executor = new CommandExecutor({ registry }, jobManager);

class Shell {
  private readonly rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: (line: string) => completionEngine.complete(line),
    prompt: "$ ",
  });

  async start() {
    this.reapJobsBeforePrompt();
    this.rl.prompt();

    this.rl.on("line", async (input: string) => {
      const parsed = parse(input);
      await this.handleInput(parsed);
      await this.waitForBackgroundEvents();
      await this.reapJobsBeforePrompt(parsed.command !== "jobs");
      this.rl.prompt();
    });

    this.rl.on("SIGINT", () => {
      process.stdout.write("\n");
      process.exit(0);
    });
  }

  private async handleInput(parsed: ReturnType<typeof parse>) {
    await executor.execute(parsed);
  }

  private async waitForBackgroundEvents() {
    await new Promise((resolve) => setImmediate(resolve));
  }

  private async reapJobsBeforePrompt(showNotifications = true) {
    const doneJobs = jobManager.reapDoneJobs();
    if (doneJobs.length === 0) return;
    if (!showNotifications) return;

    const mostRecentJob = doneJobs[doneJobs.length - 1];
    const previousJob = doneJobs.length > 1 ? doneJobs[doneJobs.length - 2] : undefined;

    for (const job of doneJobs) {
      process.stdout.write(this.formatJobLine(job, mostRecentJob, previousJob));
    }
  }

  private formatJobLine(job: { id: number; command: string; status: string }, mostRecentJob: { id: number }, previousJob?: { id: number }) {
    const marker = job.id === mostRecentJob.id
      ? "+"
      : job.id === previousJob?.id
      ? "-"
      : " ";

    const status = job.status.padEnd(24, " ");
    return `[${job.id}]${marker}  ${status}${job.command}\n`;
  }
}

new Shell().start();
