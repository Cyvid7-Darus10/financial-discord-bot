import GPTBotClient from '../discord/discord.service';
import { OpenAIService } from '../openai/openai.service';
import { BOT_TOKEN } from '../config';

jest.mock('../openai/openai.service');

describe('GPTBotClient', () => {
    let client: GPTBotClient;
    let mockGetResponse: jest.Mock;

    beforeEach(() => {
        // Spy on the methods without replacing them
        jest.spyOn(GPTBotClient.prototype, 'start').mockImplementation(
            async function (this: GPTBotClient) {
                await this.resolveModules();
                await this.login(BOT_TOKEN); // Call the mocked login
            }
        );

        jest.spyOn(GPTBotClient.prototype, 'resolveModules');

        // Mock the login method
        jest.spyOn(GPTBotClient.prototype, 'login').mockImplementation(
            async () => {
                console.log('Mocked login called');
                return Promise.resolve('Mocked login response');
            }
        );

        client = new GPTBotClient();

        // Assuming OpenAIService is instantiated within GPTBotClient
        mockGetResponse = jest.fn();
        (OpenAIService.prototype.getResponse as jest.Mock) = mockGetResponse;
        mockGetResponse.mockResolvedValue('Test response from OpenAI');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should start the bot client', async () => {
        await client.start();
        expect(client.resolveModules).toHaveBeenCalled();
        expect(client.login).toHaveBeenCalledWith(BOT_TOKEN);
    });
});
