import { EmbedBuilder, ColorResolvable } from 'discord.js';

/**
 * Creates a template for success messages using the EmbedBuilder.
 * Sets the color to green, adds a title, and timestamps the message.
 *
 * @returns {EmbedBuilder} - A green-colored embed with "Success" as its title.
 */
const success = (): EmbedBuilder =>
    new EmbedBuilder()
        .setColor('Green' as ColorResolvable)
        .setTitle('Success')
        .setTimestamp();

/**
 * Creates a template for error messages using the EmbedBuilder.
 * Sets the color to red, adds a title, and timestamps the message.
 *
 * @returns {EmbedBuilder} - A red-colored embed with "Error" as its title.
 */
const error = (): EmbedBuilder =>
    new EmbedBuilder()
        .setColor('Red' as ColorResolvable)
        .setTitle('Error')
        .setTimestamp();

export default {
    success,
    error,
};
