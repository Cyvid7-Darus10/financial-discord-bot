import { Event } from '../../structures/Event';

/**
 * Event module for the 'roleCreate' event. This event is triggered whenever
 * a new role within a guild is created.
 *
 * Redeploying commands after a role is created ensures that the bot's commands
 * remain consistent and up-to-date with regards to any new roles, especially if
 * some commands have specific interactions, permissions, or dependencies related
 * to the newly created role.
 */
export default new Event({
    // The event's name, 'roleCreate', signifies that a new role within the guild has been created.
    name: 'roleCreate',

    /**
     * The main function that gets executed when the 'roleCreate' event is triggered.
     *
     * @param {GPTBotClient} client - The instance of our custom Discord bot client.
     */
    run: async (client) => {
        // Redeploy the bot's commands when a new role is created.
        // This ensures that command interactions, permissions, or dependencies
        // related to the newly created role are taken into account and the bot's
        // command access controls remain up-to-date.
        await client.deployCommands();
    },
});
