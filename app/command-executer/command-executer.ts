import type { ParsedCommand } from "../types";

import type { ExecutorContext } from "../types";

import { resolveFromPath } from "../helper/path-resolver";
import { runExternalCommand } from "../helper/external-comand";
import { createStdoutStream } from "../helper/redirect";
import type { BuiltinCommandName } from "../enums";

export class CommandExecutor {
  constructor(private context: ExecutorContext) {}

  async execute(parsed: ParsedCommand) {
    const { command, args, redirects } = parsed;

    if (!command) {
      return;
    }

    const builtin = this.context.registry.get(command as BuiltinCommandName);

    const stdout = createStdoutStream(redirects);
    if (builtin) {
      builtin.execute({
          args,
          stdout,
          redirects: []
      });

      return;
    }

    const executable = resolveFromPath(command);

    if (executable) {
      await runExternalCommand(executable, command, args);

      return;
    }

    console.log(`${command}: command not found`);
  }
}
