import type { Command, CommandContext } from '../../../types';
import { CommandRegistry } from '../../../command-executer';

export class TypeCommand implements Command {
  readonly name = "type";

  constructor(private registry: CommandRegistry) {}

  execute({ args }: CommandContext) {
    const cmd = args[0];

    if (!cmd) return;

    if (this.registry.isBuiltin(cmd)) {
      console.log(`${cmd} is a shell builtin`);
    } else {
      console.log(`${cmd}: not found`);
    }
  }
}