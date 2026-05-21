import { CommandRegistry } from './command-registry';

import { EchoCommand } from '../commands/builtins';

export function createCommandRegistry() {
  const registry = new CommandRegistry();

  registry.register(new EchoCommand());

  return registry;
}
