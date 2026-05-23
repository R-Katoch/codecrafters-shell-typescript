import { createInterface } from "readline";
import { CommandRegistry } from './command-executer';

import { EchoCommand } from './commands';
import { ExitCommand } from './commands';
import { TypeCommand } from "./commands";
import { PwdCommand } from "./commands";
import { CdCommand } from "./commands";
import { resolveFromPath, runExternalCommand, tokenize } from "./helper";
import type { CommandName } from "./enums";
import { parse } from "./helper/parser/parser";
import { CommandExecutor } from "./command-executer";

const registry = new CommandRegistry();

registry.register(new EchoCommand());
registry.register(new ExitCommand());
registry.register(new TypeCommand(registry));
registry.register(new PwdCommand());
registry.register(new CdCommand());

const executor = new CommandExecutor({
  registry,
});

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

// TODO: Uncomment the code below to pass the first stage
rl.prompt();

rl.on("line", async (input: string) => {
  const parsed = parse(input);

  await executor.execute(parsed);

  rl.prompt();
});