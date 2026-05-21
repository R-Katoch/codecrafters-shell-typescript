import { createInterface } from "readline";
import { CommandRegistry } from './command-executer';

import { EchoCommand } from './commands';
import { ExitCommand } from './commands';
import type { CommandContext } from "./types";
import { TypeCommand } from "./commands/builtins/type/type";

const registry = new CommandRegistry();

registry.register(new EchoCommand());
registry.register(new ExitCommand());
registry.register(new TypeCommand(registry));

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

// TODO: Uncomment the code below to pass the first stage
rl.prompt();
rl.on("line", (input: string) => {
  handleInput(input);
  rl.prompt();
});


export function handleInput(input: string) {
  const [commandName, ...args] = input.split(" ");

  const command = registry.get(commandName);

  if (!command) {
    console.log(`${commandName}: command not found`);
    return;
  }

  command.execute({ args } as CommandContext);
}