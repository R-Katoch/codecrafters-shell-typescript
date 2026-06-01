import type { CommandRegistry } from "../command-executer";
import type { CommandName } from "../enums";
import type { Writable } from "stream";

export interface CommandContext {
  args: string[];
  stdout: Writable;
}

export interface Command {
  readonly name: CommandName;

  execute(context: CommandContext): void;
}

export type ExecutorContext = {
  registry: CommandRegistry;
};
