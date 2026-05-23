import type { Command, CommandContext } from "../../../types";

export class EchoCommand implements Command {
  readonly name = "echo";

  execute({ args, stdout }: CommandContext) {
    stdout.write(args.join(" ") + "\n");
  }
}