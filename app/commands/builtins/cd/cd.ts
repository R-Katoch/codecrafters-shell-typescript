import type { Command, CommandContext } from '../../../types';

export class CdCommand implements Command {
    readonly name = 'cd';
    execute({ args }: CommandContext) {
        if (args.length === 0) {
            // No arguments, change to home directory
            const homeDir = process.env.HOME || process.env.USERPROFILE; // For Windows compatibility
            if (homeDir) {
                process.chdir(homeDir);
            } else {
                console.error('cd: HOME environment variable is not set');
            }
        } else if (args.length === 1) {
            // Change to the specified directory
            try {
                process.chdir(args[0]);
            } catch (err) {
                console.log(`cd: ${args[0]}: No such file or directory`);
            }
        } else {
            console.error('cd: too many arguments');
        }
    }
}