import GPTBotClient from '../discord/discord.service';
import { getResponseFromOpenAI } from '../openai/openai.service';

jest.mock('../openai/openai.service');

describe('GPTBotClient', () => {
    let client: GPTBotClient;

    beforeEach(() => {
        client = new GPTBotClient();

        // Mock the instance methods you're going to test/spy on.
        client.start = jest.fn(client.start);
        client.resolveModules = jest.fn(client.resolveModules);
        client.login = jest.fn(client.login);

        (getResponseFromOpenAI as jest.Mock).mockResolvedValue(
            'Test response from OpenAI'
        );
    });

    it('should start the bot client', async () => {
        await client.start();
        expect(client.resolveModules).toHaveBeenCalled();
        expect(client.login).toHaveBeenCalledWith(process.env.BOT_TOKEN);
    });
});
