import { Client } from 'discord.js';
import { initDiscordService } from '../discord/discord.service';
import { getResponseFromOpenAI } from '../openai/openai.service';

jest.mock('discord.js');
jest.mock('../openai/openai.service');

describe('initDiscordService', () => {
    let mockClientInstance: any;
    let mockMessageInstance: any;

    beforeEach(() => {
        mockClientInstance = {
            on: jest.fn(),
            login: jest.fn(),
        };
        mockMessageInstance = {
            author: { bot: false },
            content: '!gpt test',
            channel: { sendTyping: jest.fn(), send: jest.fn() },
        };
        (Client as any).mockImplementation(() => mockClientInstance);
        (getResponseFromOpenAI as jest.Mock).mockResolvedValue(
            'Test response from OpenAI'
        );
    });

    it('should log in the client with the provided token', async () => {
        await initDiscordService('test-token');
        expect(mockClientInstance.login).toHaveBeenCalledWith('test-token');
    });

    it('should respond to a valid !gpt command', async () => {
        await initDiscordService('test-token');

        // Simulate the 'messageCreate' event
        const messageCreateCallback = mockClientInstance.on.mock.calls.find(
            (call) => call[0] === 'messageCreate'
        )[1];
        await messageCreateCallback(mockMessageInstance);

        expect(mockMessageInstance.channel.send).toHaveBeenCalledWith(
            'Test response from OpenAI'
        );
    });
});
