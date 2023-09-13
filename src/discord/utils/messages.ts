import { EmbedBuilder, ColorResolvable } from 'discord.js';

/**
 * Template for success messages
 */
const success = () =>
    new EmbedBuilder()
        .setColor('Green' as ColorResolvable)
        .setTitle('Success')
        .setTimestamp();

/**
 * Template for error messages
 */
const error = () =>
    new EmbedBuilder()
        .setColor('Red' as ColorResolvable)
        .setTitle('Error')
        .setTimestamp();

export default {
    success,
    error,
};
