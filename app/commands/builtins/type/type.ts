import type { Command, CommandContext } from '../../../types';
import { CommandRegistry } from '../../../command-executer';
import type { CommandName } from '../../../enums';
import { resolveFromPath } from '../../../helper';

export class TypeCommand implements Command {
  readonly name = "type";

  constructor(private registry: CommandRegistry) {}

  execute({ args, stdout }: CommandContext) {
    const cmd = args[0] as CommandName;
    if (!cmd) return;

    // 1. check builtin
    if (this.registry.get(cmd)) {
      stdout.write(`${cmd} is a shell builtin\n`);
      return;
    }

    // 2. check PATH
    const resolved = resolveFromPath(cmd);

    if (resolved) {
      stdout.write(`${cmd} is ${resolved}\n`);
    } else {
      stdout.write(`${cmd}: not found\n`);
    }
  }
}