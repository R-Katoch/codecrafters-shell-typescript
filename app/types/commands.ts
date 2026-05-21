import type { CommandName } from "../enums";

export interface CommandContext {
  args: string[];
}

export interface Command {
  readonly name: CommandName;

  execute(context: CommandContext): void;
}