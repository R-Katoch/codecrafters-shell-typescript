import type { Command, CommandContext } from "../../../types";

type CompletionSpec = {
  type: "command";
  command: string;
};

export class CompleteCommand implements Command {
  readonly name = "complete";

  // command -> completion spec
  private static completions = new Map<string, CompletionSpec>();

  execute(context: CommandContext): void {
    const { args, stdout } = context;

    // complete -p
    if (args[0] === "-p") {
      const target = args[1];

      // print all
      if (!target) {
        for (const [cmd, spec] of CompleteCommand.completions) {
          stdout.write(`complete -C ${spec.command} ${cmd}\n`);
        }

        return;
      }

      // print single
      const spec = CompleteCommand.completions.get(target);

      if (!spec) {
        stdout.write(`${this.name}: ${target}: no completion specification\n`);

        return;
      }

      stdout.write(`complete -C ${spec.command} ${target}\n`);

      return;
    }

    // complete -C <completion_command> <target_command>
    if (args[0] === "-C") {
      const completionCommand = args[1];

      const targetCommand = args[2];

      if (!completionCommand || !targetCommand) {
        stdout.write(`${this.name}: usage: complete -C <command> <target>\n`);

        return;
      }

      CompleteCommand.completions.set(targetCommand, {
        type: "command",
        command: completionCommand,
      });

      return;
    }

    stdout.write(`${this.name}: unsupported option\n`);
  }

  static getCompletion(command: string): CompletionSpec | undefined {
    return CompleteCommand.completions.get(command);
  }
}
