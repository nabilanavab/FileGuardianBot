
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

const file_name = __dirname + __filename
const author = "@nabilanavab"

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

async function editReply({ client, chatId, editedText, editedBtn, messageId}) {
    // Edit and send the reply message to the log channel
    try {
        let editedMsg = await client.editMessage(
            chatId,
            {
                message: messageId,
                text: editedText,
                buttons: editedBtn ?
                    client.buildReplyMarkup(editedBtn) : null,
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
        // } else if (error instanceof EditMessage){
        //     return editReply({ client, editedText, messageId });
        } else {
            logger.log('error', `${file_name}: ${chatId} : ${error}`);
            return null;
        }
    }
}

module.exports = { editReply };

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