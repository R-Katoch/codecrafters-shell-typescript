import readline from "readline";

import { CommandRegistry } from "./command-executer";

import { EchoCommand } from "./commands";
import { ExitCommand } from "./commands";
import { TypeCommand } from "./commands";
import { PwdCommand } from "./commands";
import { CdCommand } from "./commands";

import { parse } from "./helper/parser/parser";
import { CommandExecutor } from "./command-executer";

const registry = new CommandRegistry();

registry.register(new EchoCommand());
registry.register(new ExitCommand());
registry.register(new TypeCommand(registry));
registry.register(new PwdCommand());
registry.register(new CdCommand());

const executor = new CommandExecutor({ registry });

// Commands available for tab completion
const builtins = ["echo", "exit", "type", "pwd", "cd"];
const pathExecutables = getPathExecutables();

const allCommands = [...new Set([...builtins, ...pathExecutables])];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (line: string) => {
    const hits = allCommands.map((h) => h + " ").filter((c) => c.startsWith(line));
    if (hits.length === 0) process.stdout.write("\x07");
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

import fs from "fs";
import path from "path";

function getPathExecutables(): string[] {
  const envPath = process.env.PATH || "";

  const dirs = envPath.split(":");

  const executables = new Set<string>();

  for (const dir of dirs) {
    try {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        executables.add(file);
      }
    } catch {
      // ignore invalid dirs
    }
  }

  return [...executables];
}