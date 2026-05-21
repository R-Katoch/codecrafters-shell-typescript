import type { CommandName } from '../enums';
import type { Command } from '../types';

export class CommandRegistry {
  private commands = new Map<CommandName, Command>();

  register(command: Command) {
    this.commands.set(command.name, command);
  }

  resolve(name: CommandName): Command | undefined {
    return this.commands.get(name);
  }

  get(name: CommandName) {
    return this.commands.get(name);
  }

  isBuiltin(name: CommandName): boolean {
    return this.commands.has(name);
  }
}
