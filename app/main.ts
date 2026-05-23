import readline from "readline";

import { CommandRegistry } from "./command-executer";

import { EchoCommand } from "./commands";
import { ExitCommand } from "./commands";
import { TypeCommand } from "./commands";
import { PwdCommand } from "./commands";
import { CdCommand } from "./commands";

import { parse } from "./helper/parser/parser";
import { CommandExecutor } from "./command-executer";
import { getAllCommands } from "./helper";

const registry = new CommandRegistry();

registry.register(new EchoCommand());
registry.register(new ExitCommand());
registry.register(new TypeCommand(registry));
registry.register(new PwdCommand());
registry.register(new CdCommand());

const executor = new CommandExecutor({ registry });

let tabPressedOnce = false;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (line: string) => {
    const allCommands = getAllCommands();

    const hits = allCommands.filter((h) => h.startsWith(line)).sort();

    // no match → bell only
    if (hits.length === 0) {
      process.stdout.write("\x07");
      return [[], line];
    }

    // SINGLE match → autocomplete + space (GY5 requirement)
    if (hits.length === 1) {
      return [[hits[0] + " "], line];
    }

    // MULTIPLE matches → return list only (WH6 requirement)
    return [hits, line];
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
