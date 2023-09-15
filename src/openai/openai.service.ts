import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config';

export class OpenAIService {
    private openai: OpenAI;

    constructor(apiKey: string = OPENAI_API_KEY) {
        this.openai = new OpenAI({ apiKey });
    }

    /**
     * Retrieves a completion response from OpenAI's GPT-4 model for the given prompt.
     *
     * @param {string} prompt - The question or statement for which we seek AI's response.
     * @returns {Promise<string>} - AI's response or an error message in case of failure.
     */
    async getResponse(prompt: string): Promise<string> {
        try {
            // Construct and send the chat request to OpenAI.
            const response = await this.openai.chat.completions.create({
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

            // Extract the response from OpenAI's reply or use a fallback message.
            return (
                response?.choices[0]?.message?.content ||
                "Sorry, I couldn't generate a response."
            );
        } catch (error) {
            // Handle any errors during the API call, log them, and send an appropriate user-friendly error message.
            console.error("Couldn't create completion", error);
            return 'Sorry, I encountered an error while processing your request.';
        }
    }
}
