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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (line: string) => {
    return completionEngine.complete(line);
  },
  prompt: "$ ",
});

// EXECUTION
async function handleInput(input: string) {
  const parsed = parse(input);
  await executor.execute(parsed);
}

function reapJobsBeforePrompt() {
  const doneJobs = jobManager.reapDoneJobs();
  if (doneJobs.length === 0) return;

  const mostRecentJob = doneJobs[doneJobs.length - 1];
  const previousJob = doneJobs.length > 1 ? doneJobs[doneJobs.length - 2] : undefined;

  for (const job of doneJobs) {
    const marker = job.id === mostRecentJob.id
      ? "+"
      : job.id === previousJob?.id
      ? "-"
      : " ";
    const status = job.status.padEnd(24, " ");
    process.stdout.write(`[${job.id}]${marker}  ${status}${job.command}\n`);
  }
}

// INPUT LOOP
reapJobsBeforePrompt();
rl.prompt();

rl.on("line", async (input: string) => {
  await handleInput(input);
  reapJobsBeforePrompt();
  rl.prompt();
});

// OPTIONAL: clean exit behavior
rl.on("SIGINT", () => {
  process.stdout.write("\n");
  process.exit(0);
});
