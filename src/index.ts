import { Client } from "discord.js";
import { config } from "dotenv";

config();

const client: Client = new Client({
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
