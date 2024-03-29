
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

const logger = require("../../../logger");
const { DATABASE } = require("../../../config");
const database = require("../../monGo/database");

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


async function deleteMsg({ client, messageID, chatID, frmDB=true}) {
    try{
        await client.deleteMessages(
            chatID, [messageID], {}
        );

        if ( frmDB && DATABASE.MONGODB_URI ) {
            await database.client
                .db(database.databaseName)
                .collection(database.scheduler)
                .deleteOne({
                    messageID : messageID
                });
        }
        return "messageDeleted"
    } catch (error) {
        logger.log('error', `${file_name}: ${chatID} : ${error}`);
        return false;
    }
}

module.exports = deleteMsg;


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