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
 * Handles the event
 * @param client Custom client
 * @param event Event object
 */
export function handleEvent(client: GPTBotClient, event: Event) {
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
}

/**
 * Handles the command
 * @param client Custom client
 * @param interaction Command interaction
 */
export async function handleCommand(
    client: GPTBotClient,
    interaction: CommandInteraction
) {
    await interaction.deferReply();

    const { commandName } = interaction;
    const command = client.commands.get(commandName);

    if (!command)
        return await interaction.followUp({
            ephemeral: true,
            embeds: [messages.error().setDescription('Command not found.')],
        });

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

    try {
        await command.run({
            client,
            interaction: interaction as CommandInteraction,
        });
    } catch (error) {
        console.error(
            `An error occurred in '${command.builder.name}' command.\n${error}\n`
        );

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
}
