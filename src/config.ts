import { config as dotenvConfig } from 'dotenv'
dotenvConfig()

export const BOT_TOKEN = process.env.BOT_TOKEN
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY
