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

export function createStderrStream(
  redirects: Redirect[]
) {
  const redirect = redirects.find(
    (r) => r.stream === "stderr"
  );

  if (!redirect) {
    return process.stderr;
  }

  return fs.createWriteStream(redirect.target, {
    flags: redirect.mode === "append" ? "a" : "w",
  })
}