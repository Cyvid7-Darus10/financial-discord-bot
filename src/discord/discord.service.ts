import { Client, Message } from 'discord.js';
import { getResponseFromOpenAI } from '../openai/openai.service';

export async function initDiscordService(token: string) {
    const client = new Client({
        intents: ['Guilds', 'GuildMessages', 'MessageContent'],
    });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user?.tag}!`);
    });

    client.on('messageCreate', async (message: Message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith('!')) return;

        const [command, ...args] = message.content.trim().split(/\s+/);
        const prompt = args.join(' ');

        if (command === '!gpt') {
            await message.channel.sendTyping();
            const responseText = await getResponseFromOpenAI(prompt);
            message.channel.send(responseText);
        }
    });

    await client.login(token);
}
