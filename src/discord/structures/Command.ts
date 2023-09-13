import { PermissionResolvable, CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import GPTBotClient from '../discord.model';

/**
 * Represents the arguments that a command function will receive when it's executed.
 */
export type CommandArgs = {
    /** The instance of the bot client. */
    client: GPTBotClient;

    /** The interaction data containing details of the executed command. */
    interaction: CommandInteraction;
};

/**
 * Represents the structure of a command.
 * It can either be a complete slash command builder or a subset that excludes subcommands.
 */
type CommandBuilder =
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

/**
 * Class representing a bot command.
 */
export class Command {
    /** Whether the command is disabled and shouldn't be executed. */
    disabled?: boolean;

    /** A list of permissions required for a user to execute this command. */
    permissions?: PermissionResolvable[];

    /** Indicates if the command can only be executed by developers. */
    onlyDev?: boolean;

    /** Defines the structure and details of the command. */
    builder: CommandBuilder;

    /**
     * The function to run when this command is executed.
     * @param args - The arguments containing client and interaction data.
     * @returns The result of the command execution.
     */
    run: (args: CommandArgs) => any;

    /**
     * Constructs a new command.
     * @param options - The properties and behaviors of the command.
     */
    constructor(options: NonNullable<Command>) {
        Object.assign(this, options);
    }
}
