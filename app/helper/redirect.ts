import fs from "fs";

import type { Redirect } from "../types";

export function createStdoutStream(
  redirects: Redirect[]
) {
  const redirect = redirects.find(
    (r) => r.stream === "stdout"
  );

  if (!redirect) {
    return process.stdout;
  }

  return fs.createWriteStream(redirect.target, {
    flags: redirect.mode === "append" ? "a" : "w",
  });
}