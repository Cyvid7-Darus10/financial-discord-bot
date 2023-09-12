"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const client = new discord_js_1.Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'GuildMessageReactions',
        'GuildVoiceStates',
        'MessageContent',
    ],
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});
const IGNORE_PREFIX = '!';
client.on('messageCreate', (message) => {
    if (message.author.bot)
        return;
    if (!message.content.startsWith(IGNORE_PREFIX))
        return;
    const args = message.content.slice(IGNORE_PREFIX.length).trim().split(/ +/g);
    const command = args.shift()?.toLowerCase();
    if (command === 'gpt') {
        message.reply('Hello, world!, I am GPT Bot, I am here to help you!');
    }
});
client.login(process.env.BOT_TOKEN);
