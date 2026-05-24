import type { Command, CommandContext } from "../../../types";

export class CompleteCommand implements Command {
    readonly name = "complete";
    execute(context: CommandContext): void {}
}