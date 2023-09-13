import { ClientEvents } from 'discord.js';

import GPTBotClient from '../discord.model';

export class Event {
    /**
     * Event name
     */
    name: keyof ClientEvents;

    /**
     * Runs the event
     */
    run: (client: GPTBotClient, ...eventArgs: any) => any;

    /**
     * Creates a new event
     * @param options Event options
     */
    constructor(options: NonNullable<Event>) {
        Object.assign(this, options);
    }
}
