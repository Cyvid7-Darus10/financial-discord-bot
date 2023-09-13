import { PermissionResolvable, CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import GPTBotClient from '../discord.model';

/** Arguments for command */
export type CommandArgs = {
    /**
     * Client
     */
    client: GPTBotClient;

    /**
     * Interaction
     */
    interaction: CommandInteraction;
};

type CommandBuilder =
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

export class Command {
    /**
     * If true, disables the command
     */
    disabled?: boolean;

    /**
     * Required permissions to run the command
     */
    permissions?: PermissionResolvable[];

    /**
     * If true, only developers can run the command
     */
    onlyDev?: boolean;

    /**
     * Slash command builder
     */
    builder: CommandBuilder;

    /**
     * Runs the command
     */
    run: (args: CommandArgs) => any;

    /**
     * Creates a new command
     * @param options Command options
     */
    constructor(options: NonNullable<Command>) {
        Object.assign(this, options);
    }
}
