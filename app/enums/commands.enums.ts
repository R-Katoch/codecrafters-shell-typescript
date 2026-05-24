export type BuiltinCommandName = "echo" | "exit" | "type" | "pwd" | "cd" | "complete" | "jobs";

export type CommandName = BuiltinCommandName;

export enum Command {
    echo = "echo",
    exit = "exit",
    type = "type",
    pwd = "pwd",
    cd = "cd",
    complete = "complete",
    jobs = "jobs"
}