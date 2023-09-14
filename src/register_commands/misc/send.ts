import path from 'path';
import axios from 'axios';
import fs from 'fs';

interface CommandData {
    name: string;
    // Other potential fields for CommandData...
}

const loadCommands = async (): Promise<CommandData[]> => {
    const commandsOut: CommandData[] = [];
    const commandsPath = path.join(
        __dirname,
        '..',
        '..',
        'discord',
        'commands'
    );

    console.log('Loading commands...');
    console.log('Commands path:', commandsPath);

    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'));

    for await (const file of commandFiles) {
        const { data } = await import(`${commandsPath}/${file}`);
        console.log('file', file);
        console.log('path', path.join(commandsPath, file));
        console.log('path', `${commandsPath}/${file}`);
        console.log(`Loading command: ${data.name}`);
        commandsOut.push(data);
    }

    return commandsOut;
};

export const register = async (
    appId: string,
    botToken: string,
    guildId?: string
): Promise<void> => {
    const commands = await loadCommands();
    const headers = {
        Authorization: `Bot ${botToken}`,
        'Content-Type': 'application/json',
    };

    const globalUrl = `https://discord.com/api/v8/applications/${appId}/commands`;
    const guildUrl = `https://discord.com/api/v8/applications/${appId}/guilds/${guildId}/commands`;
    const endpoint = guildId ? guildUrl : globalUrl;
    const cmdInfo = guildId ? 'Guild' : 'Global';

    axios
        .put(endpoint, JSON.stringify(commands), { headers })
        .then(() => console.log(`${cmdInfo} Commands registered.`))
        .catch((e) => console.log(e));
    return;
};
