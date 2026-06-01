import { tokenize } from "./tokenizer";
import type { ParsedCommand, Redirect } from "../../types";

const REDIRECTS: Record<string, Omit<Redirect, "target">> = {
  ">":   { stream: "stdout", mode: "write"  },
  ">>":  { stream: "stdout", mode: "append" },
  "1>":  { stream: "stdout", mode: "write"  },
  "1>>": { stream: "stdout", mode: "append" },
  "2>":  { stream: "stderr", mode: "write"  },
  "2>>": { stream: "stderr", mode: "append" },
};

export function parse(input: string): ParsedCommand {
  const tokens = tokenize(input);
  const redirects: Redirect[] = [];
  const args: string[] = [];

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];

    const redirect = REDIRECTS[token];
    if (redirect !== undefined) {
      redirects.push({ ...redirect, target: tokens[++i] });
      continue;
    }

    args.push(token);
  }

  return {
    command: tokens[0],
    args,
    redirects,
  };
}
