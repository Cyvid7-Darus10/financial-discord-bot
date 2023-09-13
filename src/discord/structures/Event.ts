import { ClientEvents } from 'discord.js';
import GPTBotClient from '../discord.service';

/**
 * Class representing an event handler for the bot.
 */
export class Event {
    /**
     * Specifies the type of event this handler responds to.
     * For instance, "message", "guildCreate", etc.
     */
    name: keyof ClientEvents;

    /**
     * The function to execute when the specified event is emitted.
     *
     * @param client - The instance of the bot client emitting the event.
     * @param eventArgs - The set of arguments provided by the emitted event.
     * @returns The result of the event handling process.
     */
    run: (client: GPTBotClient, ...eventArgs: any) => any;

    /**
     * Constructs a new event handler.
     *
     * @param options - Defines the properties and behavior of the event handler.
     */
    constructor(options: NonNullable<Event>) {
        Object.assign(this, options);
    }
}
