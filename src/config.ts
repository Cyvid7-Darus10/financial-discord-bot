import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const APP_ID = process.env.APP_ID;
export const GUILD_ID = process.env.GUILD_ID;
export const OWNER_ID = process.env.OWNER_ID;
export const NODE_ENV = process.env.NODE_ENV;
