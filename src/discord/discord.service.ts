import {
    Client,
    Collection,
    GatewayIntentBits,
    ApplicationCommandPermissionType,
    ApplicationCommandPermissions,
} from 'discord.js';
import path from 'path';
import requireAll from 'require-all';
import { handleEvent } from './utils/handlers';
import { Command } from './structures/Command';
import { Event } from './structures/Event';
import { BOT_TOKEN } from '../config';

/**
 * Custom client extended from Discord's base client. This client provides
 * tailored utilities for managing commands, events, and the bot's initialization.
 */
export default class GPTBotClient extends Client {
    /**
     * A collection of bot commands.
     */
    commands: Collection<string, Command> = new Collection();

    /**
     * List of developer IDs for privileged operations.
     */
    developers: string[];

    /**
     * Initializes the custom client with desired intents.
     */
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
            ],
        });
    }

    /**
     * Begins the bot's operations. It registers the events, commands,
     * and starts the login process.
     */
    async start() {
        try {
            this.developers = process.env.DEVELOPERS!.split(' ');
            await this.resolveModules();
            await this.login(BOT_TOKEN);
        } catch (error) {
            console.error('Error during start:', error);
        }
    }

    /**
     * Resolves and registers bot commands and events from their respective directories.
     * Uses the 'require-all' package to dynamically import commands and events.
     */
    async resolveModules() {
        try {
            const sharedSettings = {
                recursive: true,
                filter: /\w*.[tj]s/g,
            };

            // Load and register bot commands
            requireAll({
                ...sharedSettings,
                dirname: path.join(__dirname, '../discord/commands'),
                resolve: (x) => {
                    const command = x.default as Command;
                    // Ignore disabled commands
                    if (command.disabled) return;
                    if (command.permissions)
                        command.builder.setDefaultPermission(false);
                    const commandName = command.builder.name;
                    if (!commandName) {
                        console.warn(
                            'Name not found on command builder:',
                            command.builder
                        );
                        return;
                    }
                    console.log(`Command '${commandName}' registered.`);
                    this.commands.set(commandName, command);
                },
            });

            // Load and register bot events
            requireAll({
                ...sharedSettings,
                dirname: path.join(__dirname, '../discord/events'),
                resolve: (x) => {
                    const event = x.default as Event;
                    if (!event || !event.name) {
                        console.warn('Invalid event detected:', x);
                        return;
                    }
                    console.log(`Event '${event.name}' registered.`);
                    handleEvent(this, event);
                },
            });
        } catch (error) {
            console.error('Error during resolveModules:', error);
        }
    }

    /**
     * Deploys bot commands to the guild. Additionally, it configures
     * permission overwrites for commands that have specified permissions.
     * Useful when the bot is deployed to servers.
     */
    async deployCommands() {
        try {
            const guild = this.guilds.cache.get(process.env.GUILD_ID!)!;
            const commandsJSON = [...this.commands.values()].map((x) =>
                x.builder.toJSON()
            );
            const commandsCol = await guild.commands.set(commandsJSON);

            // Utility function to map role permissions to commands
            const getRoles = (name: string) => {
                const perms = this.commands.find((c) => c.builder.name === name)
                    ?.permissions;
                if (!perms) return null;
                return guild.roles.cache.filter(
                    (r) => r.permissions.has(perms) && !r.managed
                );
            };

            // Map developers to command permissions array
            const devArr: ApplicationCommandPermissions[] = this.developers.map(
                (x) => ({
                    id: x,
                    type: ApplicationCommandPermissionType.User,
                    permission: true,
                })
            );

            // Build a complete list of permissions for each command
            const fullPermissions = commandsCol.reduce((acc, command) => {
                const roles = getRoles(command.name);
                if (!roles) return acc;
                const localCommand = this.commands.get(command.name)!;
                const permissionsForRole: ApplicationCommandPermissions[] =
                    roles.map((role) => ({
                        id: role.id,
                        type: ApplicationCommandPermissionType.Role,
                        permission: true,
                    }));
                const finalPermissions = localCommand.onlyDev
                    ? devArr
                    : permissionsForRole;
                const mappedPermissions = finalPermissions.map((perm) => ({
                    id: command.id,
                    type: perm.type,
                    permission: perm.permission,
                    application_id: command.applicationId,
                    guild_id: command.guildId,
                }));
                return [...acc, ...mappedPermissions];
            }, []);

            // Apply all the permissions
            for (const commandPermission of fullPermissions) {
                await guild.commands.permissions.set({
                    command: commandPermission.id,
                    permissions: [commandPermission],
                    token: process.env.BOT_TOKEN,
                });
            }
        } catch (error) {
            console.error('Error during deployCommands:', error);
        }
    }
}
