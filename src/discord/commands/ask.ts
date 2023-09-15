import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../structures/Command';
import { OpenAIService } from '../../openai/openai.service';
import { PlaidService } from '../../plaid/plaid.service';
import dayjs from 'dayjs';

/**
 * Discord command module to ask OpenAI's GPT model a question and receive an answer.
 * This command leverages the SlashCommandBuilder for ease of use and clarity.
 */
export default new Command({
    // Set up the command properties using SlashCommandBuilder.
    builder: new SlashCommandBuilder()
        .setName('ask')
        // Description provides context to users about what this command does.
        .setDescription('Ask a question and get a response from OpenAI.')
        .addStringOption((option) =>
            option
                // Specifies the option name that users should provide.
                .setName('sentence')
                // Describes the expected input for the user.
                .setDescription('The question to ask OpenAI.')
                // Ensure this option is always provided when the command is used.
                .setRequired(true)
        ),

    /**
     * The main function executed when the 'ask' command is triggered.
     *
     * @param {CommandInteraction} interaction - Represents the command interaction.
     */
    run: async ({ interaction }) => {
        // Retrieve the 'sentence' provided by the user during the command invocation.
        const sentenceOption = interaction.options.data.find(
            (opt) => opt.name === 'sentence'
        )?.value as string;

        // Check if the sentence option is present. If not, send a clarification message.
        if (!sentenceOption) {
            await interaction.followUp('No sentence provided.');
            return;
        }

        // Modify the sentenceOption to format the prompt for JSON structured output.
        const structuredPrompt = `${sentenceOption}. Please provide a response in the format: {"choice": "get_account_routing | get_transactions | check_balance | nothing", "extra_details": {"start_date": "start date if mentioned and format should be YYYY-MM-DD", "end_date": "end date if mentioned and format should be YYYY-MM-DD"}}. Please respond the json only. No need for explanation.`;
        const responseString = await new OpenAIService().getResponse(
            structuredPrompt
        );
        let parsedResponse;

        try {
            parsedResponse = JSON.parse(responseString);
        } catch (error) {
            console.error("Failed to parse OpenAI's response:", error);
            console.error("OpenAI's response:", responseString);
            await interaction.followUp(
                'Sorry, I encountered an error processing the response.'
            );
            return;
        }

        let plaidResult;
        const plaidService = new PlaidService();

        const { choice, extra_details } = parsedResponse;
        switch (choice) {
            case 'get_account_routing':
                plaidResult = await plaidService.getAccountDetails();
                break;

            case 'get_transactions':
                const { start_date, end_date } = extra_details;
                const currentDate = dayjs().format('YYYY-MM-DD');
                const oldStartDate = dayjs()
                    .subtract(30, 'day')
                    .format('YYYY-MM-DD');
                plaidResult = await plaidService.getTransactions(
                    start_date || oldStartDate,
                    end_date || currentDate
                );
                break;

            case 'check_balance':
                plaidResult = await plaidService.getAccountBalance();
                break;

            case 'get_item_details':
                plaidResult = await plaidService.getItemDetails();
                break;

            case 'get_accounts':
                plaidResult = await plaidService.getAccounts();
                break;

            default:
                // If none of the cases match, simply return the OpenAI's response.
                await interaction.followUp(`Unsupported action: ${choice}`);
                return;
        }

        const newPrompt = `Here is the response from Plaid: ${JSON.stringify(
            plaidResult
        )}. Please format it properly so the user can understand it.`;

        const newResponseString = await new OpenAIService().getResponse(
            newPrompt
        );

        await interaction.followUp(newResponseString);
    },
});
