export type Redirect = {
  stream: "stdout" | "stderr";
  mode: "write" | "append";
  target: string;
};

export type ParsedCommand = {
  command: string;
  args: string[];
  redirects: Redirect[];
  background: boolean;
};
