import { Role } from 'discord.js';
import { Event } from '../../structures/Event';

/**
 * Event module for the 'roleUpdate' event. This event is triggered whenever
 * a role within a guild is updated.
 *
 * The primary aim of this event is to detect changes in role permissions and
 * subsequently redeploy the bot's commands if necessary. Redeploying commands
 * ensures that any updates to the permissions of roles in Discord are instantly
 * reflected in the bot's command access controls.
 */
export default new Event({
    // The event's name, in this case, 'roleUpdate', indicating that a role
    // within the guild has been updated.
    name: 'roleUpdate',

    /**
     * The main function that gets executed when the 'roleUpdate' event is triggered.
     *
     * @param {GPTBotClient} client - The instance of our custom Discord bot client.
     * @param {Role} oldRole - The role's data before the update.
     * @param {Role} newRole - The role's data after the update.
     */
    run: async (client, oldRole: Role, newRole: Role) => {
        // Compare the permissions of the role before and after the update.
        // If there's a change in the permissions, it could potentially affect
        // which commands certain roles can access.
        if (oldRole.permissions !== newRole.permissions) {
            // If the permissions have indeed changed, trigger the deployment of commands
            // to ensure that any command permission dependencies are instantly updated
            // in line with the changes to the role's permissions.
            await client.deployCommands();
        }
    },
});
