import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
export const PLAID_SECRET = process.env.PLAID_SECRET;
