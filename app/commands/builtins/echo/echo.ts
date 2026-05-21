import type { Command, CommandContext } from '../../../types';

export class EchoCommand implements Command {
  readonly name = "echo";

  execute({ args }: CommandContext) {
    console.log(args.join(" "));
  }
}