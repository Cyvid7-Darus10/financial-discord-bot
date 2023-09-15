import { OpenAIService } from '../openai/openai.service';
import OpenAI from 'openai';

// Mock the method within the OpenAI class
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

describe('OpenAIService', () => {
    let openaiService: OpenAIService;

    beforeEach(() => {
        openaiService = new OpenAIService();
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

        const result = await openaiService.getResponse(mockPrompt);

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

        const result = await openaiService.getResponse(mockPrompt);

        expect(result).toBe(
            'Sorry, I encountered an error while processing your request.'
        );
    });

    it('should handle errors gracefully', async () => {
        const mockPrompt = 'Hello, AI!';
        mockCreate.mockRejectedValue(new Error('API error'));

        const result = await openaiService.getResponse(mockPrompt);

        expect(result).toBe(
            'Sorry, I encountered an error while processing your request.'
        );
    });
});
