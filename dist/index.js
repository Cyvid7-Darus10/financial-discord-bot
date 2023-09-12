"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const openai_1 = __importDefault(require("openai"));
(0, dotenv_1.config)();
const client = new discord_js_1.Client({
    intents: ['Guilds', 'GuildMessages', 'MessageContent'],
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const IGNORE_PREFIX = '!';
client.on('messageCreate', async (message) => {
    if (message.author.bot)
        return;
    if (!message.content.startsWith(IGNORE_PREFIX))
        return;
    const msgContent = message.content;
    const command = msgContent.split(' ')[0].toLowerCase();
    const prompt = msgContent.slice(command.length + 1).toLowerCase();
    if (command === '!gpt') {
        const response = await openai.chat.completions
            .create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        })
            .catch((err) => {
            console.error("Couldn't create completion", err);
        })
            .finally(() => {
            console.log('Completed');
        });
        const responseText = response?.choices[0]?.message?.content;
        if (responseText) {
            message.channel.send(responseText);
        }
    }
});
client.login(process.env.BOT_TOKEN);
