import readline from "readline";

import { CommandRegistry } from "./command-executer";

import { EchoCommand } from "./commands";
import { ExitCommand } from "./commands";
import { TypeCommand } from "./commands";
import { PwdCommand } from "./commands";
import { CdCommand } from "./commands";

import { parse } from "./helper/parser/parser";
import { CommandExecutor } from "./command-executer";
import { allCommands } from "./helper";

const registry = new CommandRegistry();

registry.register(new EchoCommand());
registry.register(new ExitCommand());
registry.register(new TypeCommand(registry));
registry.register(new PwdCommand());
registry.register(new CdCommand());

const executor = new CommandExecutor({ registry });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (line: string) => {
    const hits = allCommands.map((h) => h + " ").filter((c) => c.startsWith(line));
    if (hits.length === 0 || hits.length > 1) process.stdout.write("\x07");
    return [hits.length ? hits : [], line];
  },
  prompt: "$ ",
});

// EXECUTION
async function handleInput(input: string) {
  const parsed = parse(input);
  await executor.execute(parsed);
}

// INPUT LOOP
rl.prompt();

rl.on("line", async (input: string) => {
  await handleInput(input);
  rl.prompt();
});

// OPTIONAL: clean exit behavior
rl.on("SIGINT", () => {
  process.stdout.write("\n");
  process.exit(0);
});
