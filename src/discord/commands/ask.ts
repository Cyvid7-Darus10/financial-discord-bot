import { getResponseFromOpenAI } from '../../openai/openai.service';
import { globalHandler } from '../handler';

export const data = {
    name: 'ask',
    type: 1,
    description: 'Ask a question and get a response from OpenAI.',
    options: [
        {
            type: 3, // 3 is for STRING type according to Discord API
            name: 'sentence',
            description: 'The question to ask OpenAI.',
            required: true,
        },
    ],
};

const action = async (body: any) => {
    const sentenceOption = body.data.options?.find(
        (opt: any) => opt.name === 'sentence'
    )?.value;

    if (!sentenceOption) {
        return {
            content: 'No sentence provided.',
        };
    }

    const openAIResponse = await getResponseFromOpenAI(sentenceOption);

    if (!openAIResponse) {
        return {
            content: "Sorry, I couldn't generate a response.",
        };
    }

    return {
        content: openAIResponse,
    };
};

export const handler = async (event: any) => {
    await globalHandler(event, action);
};
