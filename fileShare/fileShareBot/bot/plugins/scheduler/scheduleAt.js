

const cron = require('node-cron');
const { deleteMsg } = require("./deleteMsg");
const { logger } = require("../../../logger");

/**
 * @description
 * Schedule message deletion at a specific target time.
 * 
 * @param {Object} options            - Options for scheduling.
 * @param {number} options.targetTime - The timestamp representing the exact time when the message should be deleted.
 * @param {object} options.client     - The client instance.
 * @param {number} options.messageID  - The ID of the message to be deleted.
 * @param {number} options.chatID     - The ID of the chat or channel containing the message.
 * 
 * @returns {Promise<number|string>}  - A promise that resolves to 0 if the scheduling is successful,
 *                                      or an error message if there is an issue during scheduling.
 */

async function scheduleAt({ targetTime, client, messageID, chatID }) {
    try {
        // Schedule the task to be executed at the target time
        cron.schedule(
            new Date(targetTime),
            await deleteMsg({
                client: client,
                messageID: messageID,
                chatID: chatID
            })
        );
        return 0
    } catch (error) {
        logger.log('error', `${file_name}: ${update.userId} : ${error}`);
        return "errorDuringSchedulingMsg"
    }
}

module.exports = scheduleAt;