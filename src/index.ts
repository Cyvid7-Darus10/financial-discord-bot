import GPTBotClient from './discord/discord.service';

/**
 * Initialize the Discord bot service.
 */
const initDiscordService = async () => {
    // Instantiate the custom bot client.
    const client = new GPTBotClient();

    // Start the bot client.
    await client.start();
};

initDiscordService();
