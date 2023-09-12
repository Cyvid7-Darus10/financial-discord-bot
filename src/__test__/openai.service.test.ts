import OpenAI from 'openai';

const mockCreate = jest.fn() as jest.MockedFunction<
    typeof OpenAI.prototype.chat.completions.create
>;

jest.mock('openai', () => {
    return jest.fn().mockImplementation(() => {
        return {
            chat: {
                completions: {
                    create: mockCreate,
                },
            },
        };
    });
});

const { getResponseFromOpenAI } = require('../openai/openai.service');

describe('getResponseFromOpenAI', () => {
    let openaiMock;

    beforeEach(() => {
        openaiMock = new OpenAI();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return the AI response when successful', async () => {
        const mockPrompt = 'Hello, AI!';
        const mockResponse = {
            choices: [
                {
                    message: {
                        content: 'Hello, user!',
                    },
                },
            ],
        };

        mockCreate.mockResolvedValue(mockResponse as any);

        const result = await getResponseFromOpenAI(mockPrompt);

        expect(result).toBe('Hello, user!');
    });

    it('should return default message when no content is found', async () => {
        const mockPrompt = 'Hello, AI!';
        const mockResponse = {
            choices: [
                {
                    message: {},
                },
            ],
        };

        mockCreate.mockResolvedValue(mockResponse as any);

        const result = await getResponseFromOpenAI(mockPrompt);

        expect(result).toBe("Sorry, I couldn't generate a response.");
    });

    it('should handle errors gracefully', async () => {
        const mockPrompt = 'Hello, AI!';
        mockCreate.mockRejectedValue(new Error('API error'));

        const result = await getResponseFromOpenAI(mockPrompt);

        expect(result).toBe(
            'Sorry, I encountered an error while processing your request.'
        );
    });
});
