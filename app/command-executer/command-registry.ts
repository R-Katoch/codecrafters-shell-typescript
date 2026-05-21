import type { Command } from '../types';

export class CommandRegistry {
  private commands = new Map<string, Command>();

  register(command: Command) {
    this.commands.set(command.name, command);
  }

  resolve(name: string): Command | undefined {
    return this.commands.get(name);
  }

  get(name: string) {
    return this.commands.get(name);
  }

  isBuiltin(name: string): boolean {
    return this.commands.has(name);
  }
}
