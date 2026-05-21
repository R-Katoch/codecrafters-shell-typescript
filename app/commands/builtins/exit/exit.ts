import type { Command } from '../../../types';

export class ExitCommand implements Command {
  readonly name = "exit";

  execute() {
    process.exit(0);
  }
}