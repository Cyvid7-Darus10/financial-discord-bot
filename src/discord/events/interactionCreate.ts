import { Interaction } from 'discord.js';
import { Event } from '../structures/Event';
import { handleCommand } from '../utils/handlers';

/**
 * Event module for the 'interactionCreate' event. This event is triggered whenever
 * a new interaction, like a slash command, is initiated in a guild where the bot is present.
 *
 * The primary purpose of this event is to detect command interactions and handle
 * them using the bot's defined command handlers.
 */
export default new Event({
    // Name of the event, in this case 'interactionCreate', which signifies that a new
    // interaction has been created on Discord.
    name: 'interactionCreate',

    /**
     * The primary function to execute when the 'interactionCreate' event is triggered.
     *
     * @param {GPTBotClient} client - The instance of our custom Discord bot client.
     * @param {Interaction} interaction - The interaction object provided by Discord.js,
     * which contains details about the type of interaction and its context.
     */
    run: async (client, interaction: Interaction) => {
        // Check if the initiated interaction is specifically a command.
        // There could be other types of interactions like button clicks or message components,
        // but for this event, we're specifically interested in command interactions.
        if (interaction.isCommand()) {
            // If the interaction is identified as a command, delegate the responsibility
            // of handling this command to the 'handleCommand' utility function.
            // This function presumably processes the command, checks for permissions,
            // and executes the appropriate response/actions based on the command's logic.
            await handleCommand(client, interaction);
        }
    },
});
