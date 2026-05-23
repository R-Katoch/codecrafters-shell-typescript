import { tokenize } from "./tokenizer";
import type { ParsedCommand, Redirect } from '../../types';

export function parse(input: string): ParsedCommand {
  const tokens = tokenize(input);

  const redirects: Redirect[] = [];

  const command = tokens[0];

  const args: string[] = [];

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];

    // stdout overwrite
    if (token === ">") {
      redirects.push({
        stream: "stdout",
        mode: "write",
        target: tokens[++i],
      });

      continue;
    }

    // stdout append
    if (token === ">>") {
      redirects.push({
        stream: "stdout",
        mode: "append",
        target: tokens[++i],
      });

      continue;
    }

    // stderr overwrite
    if (token === "2>") {
      redirects.push({
        stream: "stderr",
        mode: "write",
        target: tokens[++i],
      });

      continue;
    }

    // stderr append
    if (token === "2>>") {
      redirects.push({
        stream: "stderr",
        mode: "append",
        target: tokens[++i],
      });

      continue;
    }

    args.push(token);
  }

  return {
    command,
    args,
    redirects,
  };
}