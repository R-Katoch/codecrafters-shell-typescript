import type { Command, CommandContext } from "../../../types";

export class JobsCommand implements Command {
    readonly name = "jobs";

    execute(context: CommandContext): void {
    }
}
