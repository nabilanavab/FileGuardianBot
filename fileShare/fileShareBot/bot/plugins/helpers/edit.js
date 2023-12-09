

// This snippet helps to edit user messages, primarily aimed at addressing the flood issue.

const logger = require("../../../logger");
const { FloodWaitError,
    EditMessage } = require("telegram/errors/RPCErrorList");

/**
 * Asynchronous function to send edited reply messages to a log channel.
 *
 * @param {Object} params            - Parameters object containing client, editedText, and messageId.
 * @param {object} params.client     - The messaging client.
 * @param {string} params.editedText - The edited text of the reply message.
 * @param {number} params.messageId  - The ID of the original message being replied to.
 * @returns {Object}                 - A Promise that resolves once the edited reply message is sent.
 */

async function editReply({ client, chatId, editedText, editedBtn, messageId }) {
    // Edit and send the reply message to the log channel
    try {
        let editedMsg = await client.editMessage(
            chatId,
            {
                message: messageId,
                text: editedText,
                buttons: client.buildReplyMarkup(
                    editedBtn
                ),
                parseMode: "html"
            }
        );
        return editedMsg;
    } catch ( error ) {
        // Handle flood error
        if (error instanceof FloodWaitError) {
            await sleep(error.seconds);
            // Retry editing and sending the reply after waiting for the flood interval
            return editReply({ client, editedText, messageId });
        } else if (error instanceof EditMessage){
            return editReply({ client, editedText, messageId });
        } else {
            logger.log(`?Error @ editReplyInLog: ${error}`);
            return null;
        }
    }
}

module.exports = { editReply };
