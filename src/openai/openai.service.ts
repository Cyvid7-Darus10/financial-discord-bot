import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function getResponseFromOpenAI(prompt: string): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
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
        });

        return (
            response?.choices[0]?.message?.content ||
            "Sorry, I couldn't generate a response."
        );
    } catch (error) {
        console.error("Couldn't create completion", error);
        return 'Sorry, I encountered an error while processing your request.';
    }
}
