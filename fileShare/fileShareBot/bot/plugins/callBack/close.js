
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

const logger = require("../../../logger");
const { Api } = require('telegram');

/**
 * Handles callback queries related to closing a message.
 * @param {object} options - Options object.
 * @param {object} options.client - The Telegram Bot API client.
 * @param {object} options.update - The Telegram update object.
 * @returns {Promise<*>} - A Promise that resolves with the result of deleting the message or false if there's an error.
 */

async function closeCbMessage({ client, update }) {
    try {
        // Send a callback answer to indicate closing
        // await client.invoke(new Api.messages.SetBotCallbackAnswer({
        //     message: "Closing...",
        //     alert: true,
        //     queryId: update.queryId
        // }));

        // Delete the original message
        return await client.deleteMessages(
            update.userId, [update.msgId], {}
        );

    } catch (error) {
        logger.log(`${file_name}: ${update.userId} : ${error}`);
        return false; // Return false in case of an error
    }
}


module.exports = closeCbMessage;

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