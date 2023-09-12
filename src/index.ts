import { initDiscordService } from './discord/discord.service';
import { BOT_TOKEN } from './config';

async function main() {
    try {
        // Initialize the Discord service
        await initDiscordService(BOT_TOKEN as string);

        console.log('Bot is up and running!');
    } catch (error) {
        console.error('Failed to start the bot:', error);
    }
}

main();
