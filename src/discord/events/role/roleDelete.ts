import { Event } from '../../structures/Event';

/**
 * Event module for the 'roleDelete' event. This event is triggered whenever
 * a role within a guild is deleted.
 *
 * Redeploying commands after a role is deleted ensures that any command permissions
 * or dependencies related to the deleted role are updated and remain consistent
 * within the bot's command access controls.
 */
export default new Event({
    // The event's name, 'roleDelete', signifies that a role within the guild has been deleted.
    name: 'roleDelete',

    /**
     * The main function that gets executed when the 'roleDelete' event is triggered.
     *
     * @param {GPTBotClient} client - The instance of our custom Discord bot client.
     */
    run: async (client) => {
        // Redeploy the bot's commands when a role is deleted.
        // This ensures that command access controls remain consistent, especially
        // for any commands that might have had specific permissions or dependencies
        // related to the deleted role.
        await client.deployCommands();
    },
});
