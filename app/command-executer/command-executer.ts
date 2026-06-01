import type { ParsedCommand } from "../types";
import type { ExecutorContext } from "../types";

import { resolveFromPath } from "../helper/path-resolver";
import { runExternalCommand } from "../helper/external-comand";
import { createStderrStream, createStdoutStream } from "../helper/redirect";

export class CommandExecutor {
  constructor(private context: ExecutorContext) {}

  async execute(parsed: ParsedCommand) {
    const { command, args, redirects } = parsed;

    if (!command) {
      return;
    }

    const builtin = this.context.registry.get(command);

    const stdout = createStdoutStream(redirects);
    const stderr = createStderrStream(redirects);

    if (builtin) {
      builtin.execute({ args, stdout });
      return;
    }

    const executable = resolveFromPath(command);

    if (executable) {
      await runExternalCommand(executable, args, command, stdout, stderr);
      return;
    }

    console.log(`${command}: command not found`);
  }
}
