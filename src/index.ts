import { Client } from 'discord.js'
import { config } from 'dotenv'

config()

const client: Client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'GuildMessageReactions',
        'GuildVoiceStates',
        'MessageContent',
    ],
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`)
})

const IGNORE_PREFIX = '!'

client.on('messageCreate', (message) => {
    if (message.author.bot) return
    if (!message.content.startsWith(IGNORE_PREFIX)) return

    const args = message.content.slice(IGNORE_PREFIX.length).trim().split(/ +/g)
    const command = args.shift()?.toLowerCase()

    if (command === 'gpt') {
        message.reply('Hello, world!, I am GPT Bot, I am here to help you!')
    }
})

client.login(process.env.BOT_TOKEN)
