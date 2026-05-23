import type { Command, CommandContext } from '../../../types';

export class PwdCommand implements Command {
  readonly name = "pwd";

  execute({ args, stdout }: CommandContext) {
    if (args.length > 0) {
      stdout.write("pwd: too many arguments\n");
      return;
    }
    stdout.write(process.cwd() + "\n");
  }
}