import type { Command, CommandContext } from "../../../types";

export class CompleteCommand implements Command {
  readonly name = "complete";

  execute(context: CommandContext): void {
    const { args, stdout } = context;

    if (args[0] === "-p") {
      stdout.write(`${this.name}: ${args[1]}: no completion specification\n`);
    }
  }
}
