

const cron = require('node-cron');
const { deleteMsg } = require("./deleteMsg");
const { logger } = require("../../../logger");

/**
 * 
 * @description
 * Schedule message deletion at a specified time.
 * 
 * @param {Object} options           - Options for scheduling.
 * @param {number} options.timeDur   - Delete Message After timeDur sec
 * @param {object} options.client    - The client instance
 * @param {number} options.messageID - The ID of the message to be deleted.
 * @param {number} options.chatID    - The ID of the chat or channel containing the message.
 * 
 * @returns {Promise<number|string>} - A promise that resolves to 0 if the scheduling is successful,
 *                                     or an error message if there is an issue during scheduling.
 */

async function scheduleAt({ timeDur, client, messageID, chatID }) {
    try {
        // Calculate the target time by adding the duration to the current time
        const targetTime = new Date().getTime() + timeDur * 1000;
        
        // Schedule the task to be executed at the calculated target time
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