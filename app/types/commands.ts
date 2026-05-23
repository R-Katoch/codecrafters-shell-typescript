import type { CommandRegistry } from "../command-executer";
import type { CommandName } from "../enums";
import type { Redirect } from "./parser";
import type { Writable } from "stream";

export interface CommandContext {
  args: string[];
  stdout: Writable;
  redirects: Redirect[];
}

export interface Command {
  readonly name: CommandName;

  execute(context: CommandContext): void;
}

export type ExecutorContext = {
  registry: CommandRegistry;
};