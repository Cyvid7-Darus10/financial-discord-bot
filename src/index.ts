import { Client, Message } from 'discord.js'
import { config } from 'dotenv'
import OpenAI from 'openai'

config()

const client: Client = new Client({
    intents: ['Guilds', 'GuildMessages', 'MessageContent'],
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`)
})

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const IGNORE_PREFIX = '!'

client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return
    if (!message.content.startsWith(IGNORE_PREFIX)) return

    await message.channel.sendTyping()

    const sendTypingInterval = setInterval(async () => {
        await message.channel.sendTyping()
    }, 5000)

    const msgContent = message.content
    const command: string = msgContent.split(' ')[0].toLowerCase()
    const prompt: string = msgContent.slice(command.length + 1).toLowerCase()

    if (command === '!gpt') {
        const response = await openai.chat.completions
            .create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content:
                            'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            })
            .catch((err) => {
                console.error("Couldn't create completion", err)
            })
            .finally(() => {
                console.log('Completed')
            })

        const responseText = response?.choices[0]?.message?.content

        if (responseText) {
            message.channel.send(responseText)
        } else {
            message.channel.send(
                `Sorry, I don't know what to say. I'm having trouble thinking of a response.`
            )
        }
    }

    clearInterval(sendTypingInterval)
})

client.login(process.env.BOT_TOKEN)
