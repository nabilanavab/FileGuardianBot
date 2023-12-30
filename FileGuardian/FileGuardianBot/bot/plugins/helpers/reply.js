
/**
 *
 * This code snippet is part of the FileShareBot by @nabilanavab.
 * It is intended for educational and non-commercial use.
 * The project was developed for personal enjoyment and experimentation.
 * If you encounter any bugs or issues, we encourage you to contribute by
 * making a pull request. [ All contributions are highly appreciated ]
 *
 * @version 1.0.0
 * @author NabilANavab
 * @copyright 2023 ©️ nabilanavab
 * 
 */

const file_name = __dirname
const author = "@nabilanavab"

// This snippet sends reply messages to the log channel
// based on the need, primarily aimed at addressing the flood issue.

const { LOG_FILE } = require("../../../config");
const logger = require("../../../logger");
const { FloodWaitError } = require("telegram/errors/RPCErrorList");

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
        if (error instanceof FloodWaitError) {
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

/**
 * 
 * @license
 * FileShareBot is open-source software distributed under the MIT License.
 * Please see the LICENSE: file for more details.
 *
 * @repository
 * You can find the source code of this bot and contribute on GitHub: 
 * https://github.com/nabilanavab/filesharebot
 *
 * @author
 * Created with ❤️ by Your Name - Feel free to reach out for questions,
 * bug reports, or collaboration.
 * 
 *                                 Contact: https://telegram.me/nabilanavab
 * 
 */