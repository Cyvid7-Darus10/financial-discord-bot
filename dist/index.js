"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const client = new discord_js_1.Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildMessageReactions",
        "GuildVoiceStates",
    ],
});
client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});
client.login(process.env.BOT_TOKEN);
