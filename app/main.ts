import { createInterface } from "readline";
import { CommandRegistry } from './command-executer';

import { EchoCommand } from './commands';
import { ExitCommand } from './commands';
import { TypeCommand } from "./commands";
import { PwdCommand } from "./commands";
import { CdCommand } from "./commands";
import { resolveFromPath, runExternalCommand, tokenize } from "./helper";
import type { CommandName } from "./enums";

const registry = new CommandRegistry();

registry.register(new EchoCommand());
registry.register(new ExitCommand());
registry.register(new TypeCommand(registry));
registry.register(new PwdCommand());
registry.register(new CdCommand());

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

// TODO: Uncomment the code below to pass the first stage
rl.prompt();
rl.on("line", async (input: string) => {
  await handleInput(input);
  rl.prompt();
});


export async function handleInput(input: string) {
  const [commandName, ...args] = tokenize(input);

  // 1. builtin
  const builtin = registry.get(commandName as CommandName);

  if (builtin) {
    await builtin.execute({ args });
    return;
  }

  // 2. external executable
  const executable = resolveFromPath(commandName);

  if (executable) {
    await runExternalCommand(executable, commandName, args);
    return;
  }

  // 3. not found
  console.log(`${commandName}: command not found`);
}