import { Event } from '../structures/Event';

/**
 * Event module for the 'ready' event. This event is triggered when the bot has
 * successfully logged in and is ready to start its operations.
 *
 * The primary purpose of this event is to deploy the bot's commands to
 * Discord's servers and indicate that the bot is fully operational.
 */
export default new Event({
    // Name of the event, in this case 'ready', which signifies that the bot is ready for operations.
    name: 'ready',

    // The main function to execute when this event is triggered.
    run: async (client) => {
        // A log statement to notify that the bot is starting the command deployment process.
        console.log('Deploying commands');

        // Deploy the bot's commands to Discord's servers. The deployCommands method is
        // responsible for registering each command with Discord, allowing them to be
        // used in guilds where the bot is present.
        await client.deployCommands();

        // A log statement to indicate that all startup procedures are complete, and the bot
        // is now in a 'ready' state to handle user interactions.
        console.log('Ready');
    },
});
