import {
    CommandInteraction,
    GuildMember,
    GuildTextBasedChannel,
    TextChannel,
} from 'discord.js';

import GPTBotClient from '../discord.model';
import { Event } from '../structures/Event';
import messages from './messages';

/**
 * Registers an event handler for a specific bot event.
 * Any exception thrown inside the event will be caught and logged to the console.
 *
 * @param client - The custom Discord bot client.
 * @param event - The event object defining the name and the handler function.
 */
export const handleEvent = (client: GPTBotClient, event: Event) => {
    const avoidException = async (...args: any) => {
        try {
            await event.run(client, ...args);
        } catch (error) {
            console.error(
                `An error occurred in '${event.name}' event.\n${error}\n`
            );
        }
    };

    client.on(event.name, avoidException);
};

/**
 * Processes the command represented by a given interaction.
 * It ensures the command exists, verifies permissions, and handles exceptions.
 *
 * @param client - The custom Discord bot client.
 * @param interaction - The interaction representing the command to process.
 */
export const handleCommand = async (
    client: GPTBotClient,
    interaction: CommandInteraction
) => {
    await interaction.deferReply();

    const { commandName } = interaction;
    const command = client.commands.get(commandName);

    // If the command doesn't exist, inform the user and exit.
    if (!command)
        return await interaction.followUp({
            ephemeral: true,
            embeds: [messages.error().setDescription('Command not found.')],
        });

    // Check if the user has required permissions to execute the command.
    if (
        command.permissions &&
        command.permissions.some(
            (p) => !(interaction.member as GuildMember).permissions.has(p)
        ) &&
        !client.developers.includes(interaction.user.id)
    )
        return await interaction.followUp({
            ephemeral: true,
            embeds: [
                messages
                    .error()
                    .setDescription(
                        'You do not have permission to run this command.'
                    ),
            ],
        });

    // Attempt to execute the command.
    try {
        await command.run({
            client,
            interaction: interaction as CommandInteraction,
        });
    } catch (error) {
        console.error(
            `An error occurred in '${command.builder.name}' command.\n${error}\n`
        );

        // Inform the user about the error.
        return await interaction.followUp({
            ephemeral: true,
            embeds: [
                messages
                    .error()
                    .setDescription(
                        'An error occurred, please try again later.'
                    ),
            ],
        });
    }
};
