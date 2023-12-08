

// This snippet sends reply messages to the log channel
// based on the need, primarily aimed at addressing the flood issue.

const { LOG_FILE } = require("../../../config");
const logger = require("../../../logger");
const errors = require("telegram/errors");

/**
 * Asynchronous function to send reply messages to a log channel.
 *
 * @param {Object} params           - Parameters object containing client, replyText, and originalMessageId.
 * @param {object} params.client    - The messaging client.
 * @param {string} params.replyText  - The text of the reply message.
 * @param {number} params.MessageId - The ID of the original message being replied to.
 * @returns {Object}                - A Promise that resolves once the reply message is sent.
 */

async function sendReplyToLog({ client, replyText, MessageId }) {
    // Send a reply message to the log channel
    try {
        let replyMsg = await client.sendMessage(
            LOG_FILE.LOG_CHANNEL,
            {
                message: replyText,
                replyTo: MessageId,
                parseMode: "html"
            }
        );
        return replyMsg;
    } catch (error) {
        // Handle flood error
        if (error instanceof errors.FloodError) {
            await sleep(error.seconds);
            // Retry sending the reply after waiting for the flood interval
            return sendReplyToLog({ client, replyText, originalMessageId });
        } else {
            logger.log(`?Error @ sendReplyToLog: ${error}`);
            return null;
        }
    }
}

module.exports = { sendReplyToLog };
