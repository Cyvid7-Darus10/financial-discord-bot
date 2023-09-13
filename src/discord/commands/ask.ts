import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../structures/Command';
import { getResponseFromOpenAI } from '../../openai/openai.service';

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

        // Interact with the OpenAI API to get a response based on the user's sentence.
        // The `getResponseFromOpenAI` function is responsible for querying OpenAI
        // and returning the response.
        const openAIResponse = await getResponseFromOpenAI(sentenceOption);

        // If there's no valid response from OpenAI, inform the user.
        if (!openAIResponse) {
            await interaction.followUp(
                "Sorry, I couldn't generate a response."
            );
            return;
        }

        // Send the response from OpenAI back to the user as a follow-up to their query.
        await interaction.followUp(openAIResponse);
    },
});
