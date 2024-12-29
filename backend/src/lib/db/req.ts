import { StoredMessage } from '../api/message.js';
import sql from './db.js';

async function initDB() {
    await sql`
    CREATE TABLE IF NOT EXISTS messages (
        channel VARCHAR(36) NOT NULL CHECK (LENGTH(channel) >= 1 AND LENGTH(channel) <= 36),
        username VARCHAR(36) NOT NULL CHECK (LENGTH(username) >= 1 AND LENGTH(username) <= 36),
        body VARCHAR(512) NOT NULL CHECK (LENGTH(body) >= 1 AND LENGTH(body) <= 512),
        created_at TIMESTAMP NOT NULL
    );
  `;
}

async function resetDB() {
    await sql`DROP TABLE IF EXISTS messages;`;
}

/**
 * Fonction pour récupérer les messages d'un canal spécifique avec pagination.
 * @param {string} channelName - Nom du canal.
 * @param {number} page - Numéro de la page (0 pour la première page, 1 pour la deuxième, etc.).
 * @returns {Promise<Array>} - Liste des messages.
 */
async function getChannelMessages(channelName: string, page = 0) {
    const limit = 100;
    const offset = page * limit;

    try {
        const messages = await sql`
        SELECT channel, username, body,
                (created_at AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Paris' AS created_at
        FROM messages
        WHERE channel = ${channelName}
        ORDER BY created_at ASC
        LIMIT ${limit}
        OFFSET ${offset};
      `;
        return messages;
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        throw error;
    }
}


/**
 * Fonction pour insérer un message dans un canal donné.
 * @param {StoredMessage} param1 - Objet contenant les informations du message.
 * @returns {Promise<void>}
 */
async function insertChannelMessage({ channel, username, body, createdAt = new Date() }: StoredMessage) {
    console.log('Inserting message:', { channel, username, body, createdAt });
    try {
        await sql`
        INSERT INTO messages (channel, username, body, created_at)
        VALUES (${channel}, ${username}, ${body}, (${createdAt} AT TIME ZONE 'Europe/Paris'));
      `;
        console.log('Message inséré avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'insertion du message:', error);
        throw error;
    }
}


/**
 * Retrieves statistics about messages from the database.
 *
 * @remarks
 * This function queries the messages database to extract information
 * on the most active channels and a day-by-day message timeline.
 *
 * @returns An object containing:
 * - topChannels: A list of channels ordered by total message count (descending), limited to 100 entries.
 * - timeline: A list of dated channel message counts, aggregated by day and sorted in ascending date order.
 */
export async function getStats() {
    const topChannels = await sql`
        SELECT channel, COUNT(*)::int AS total_messages
        FROM messages
        GROUP BY channel
        ORDER BY total_messages DESC
        LIMIT 100;
    `;

    const timeline = await sql`
        SELECT channel,
               date_trunc('day', created_at) AS day,
               COUNT(*)::int AS message_count
        FROM messages
        GROUP BY channel, day
        ORDER BY day ASC;
    `;

    return { topChannels, timeline };
}

export {
    initDB,
    resetDB,
    getChannelMessages,
    insertChannelMessage,
};