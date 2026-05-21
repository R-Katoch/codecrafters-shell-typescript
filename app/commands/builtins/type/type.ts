import type { Command, CommandContext } from '../../../types';
import { CommandRegistry } from '../../../command-executer';
import type { CommandName } from '../../../enums';
import { resolveFromPath } from '../../../helper';

export class TypeCommand implements Command {
  readonly name = "type";

  constructor(private registry: CommandRegistry) {}

  execute({ args }: CommandContext) {
    const cmd = args[0] as CommandName;
    if (!cmd) return;

    // 1. check builtin
    if (this.registry.get(cmd)) {
      console.log(`${cmd} is a shell builtin`);
      return;
    }

    // 2. check PATH
    const resolved = resolveFromPath(cmd);

    if (resolved) {
      console.log(`${cmd} is ${resolved}`);
    } else {
      console.log(`${cmd}: not found`);
    }
  }
}