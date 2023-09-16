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
        const currentDate = dayjs().format('YYYY-MM-DD');
        const structuredPrompt = `
        Given the capabilities of the PlaidService:
        1. 'get_transactions' - Fetch transactions for a specified date range from a user's linked bank account.
        2. 'get_account_routing' - Retrieve account and routing numbers for checking and savings accounts.
        3. 'check_balance' - Fetch real-time account balances.
        4. 'get_item_details' - Obtain specific details about a bank item, such as the institution and billed products.
        5. 'get_accounts' - Access high-level details about all accounts linked with a bank item.
        
        Considering the current date as: ${currentDate},
        
        Review the user's input: '${sentenceOption}'. 
        
        If the statement appears unrelated or out of context concerning Plaid transactions, provide an immediate human-readable response to clarify or guide the user. 
        
        Otherwise, indicate the appropriate action by responding with a JSON structure in this format: {\"choice\": \"get_account_routing | get_transactions | check_balance | get_item_details | get_accounts | 
        \", \"extra_details\": {\"start_date\": \"If specified, format: YYYY-MM-DD; otherwise, return null\", \"end_date\": \"If specified, format: YYYY-MM-DD; otherwise, return null\"}}.
        `;

        const responseString = await new OpenAIService().getResponse(
            structuredPrompt
        );
        let parsedResponse;

        try {
            parsedResponse = JSON.parse(responseString);
        } catch (error) {
            console.error("Failed to parse OpenAI's response:", error);
            console.error("OpenAI's response:", responseString);
            await interaction.followUp(responseString || 'No response.');
            return;
        }

        let plaidResult;
        const plaidService = new PlaidService();

        const { choice, extra_details } = parsedResponse;
        console.log('Choice:', choice);
        console.log('Extra details:', extra_details);
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
                console.error(
                    `Unsupported action: ${choice}. OpenAI's response:`,
                    responseString
                );
                await interaction.followUp(responseString);
                return;
        }

        const newPrompt = `
        You're an assistant well-versed in the realm of finance. Your primary task is to demystify and elucidate financial details, making them comprehensible to all, irrespective of their financial acumen. 
        Given this context, examine the raw financial data provided: ${JSON.stringify(
            plaidResult
        )}. Transform this data into a succinct, clear message, steering clear of complex jargon. 
        For further context, consider that the user's initial query or input was: "${sentenceOption}".
        Please respond accordingly.
        `;

        console.log('New prompt:', newPrompt);

        const newResponseString = await new OpenAIService().getResponse(
            newPrompt
        );

        await interaction.followUp(newResponseString);
    },
});
