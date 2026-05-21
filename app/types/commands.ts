export interface CommandContext {
  args: string[];
}

export interface Command {
  readonly name: string;

  execute(context: CommandContext): void;
}