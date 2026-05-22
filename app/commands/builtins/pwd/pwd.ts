import type { Command, CommandContext } from '../../../types';

export class PwdCommand implements Command {
  readonly name = "pwd";

  execute({ args }: CommandContext) {
    if (args.length > 0) {
      console.error("pwd: too many arguments");
      return;
    }
    console.log(process.cwd());
  }
}