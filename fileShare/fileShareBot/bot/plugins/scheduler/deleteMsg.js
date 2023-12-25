

const { logger } = require("../../../logger");

/**
 * @description
 * Delete a specific message from a chat or channel.
 * 
 * @param {Object} options           - Options for message deletion.
 * @param {object} options.client    - The client instance.
 * @param {number} options.messageID - The ID of the message to be deleted.
 * @param {number} options.chatID    - The ID of the chat or channel containing the message.
 * 
 * @returns {Promise|boolean} - A promise representing the result of the message deletion,
 *                              or `false` if there is an error during the deletion process.
 */

async function deleteMsg({ client, messageID, chatID }) {
    try{
        return await client.deleteMessages(
            chatID, [messageID], {}
        );
    } catch (error) {
        logger.log('error', `${file_name}: ${update.userId} : ${error}`);
        return false;
    }
}

module.exports = deleteMsg;