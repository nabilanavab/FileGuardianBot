
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

const deleteMsg = require("./deleteMsg");
const logger = require("../../../logger");
const { DATABASE } = require("../../../config");
const database = require("../../monGo/database");


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

async function scheduleAfter({ timeDur, client, messageID, chatID }) {
    try {
        // Schedule the task to be executed at the calculated target time
        setTimeout(async () => {
            await deleteMsg({
                client: client,
                messageID: messageID,
                chatID: chatID
            });
        }, timeDur*1000);

        
        // Calculate the target time by adding the duration to the current time
        const targetTime = new Date().getTime() + timeDur * 1000;

        if (DATABASE.MONGODB_URI) {
            await database.client
                .db(database.databaseName)
                .collection(database.scheduler)
                .insertOne({
                    targetTime: targetTime,
                    messageID : messageID,
                    chatID : chatID.value
                });
        }

        return targetTime
    } catch (error) {
        logger.log('error', `${file_name}: ${chatID} : ${error}`);
        return "errorDuringSchedulingMsg"
    }
}

module.exports = scheduleAfter;


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