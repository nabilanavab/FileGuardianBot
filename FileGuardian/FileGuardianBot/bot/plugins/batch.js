
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

// Import necessary modules
let logger = require("../../logger");
const getLang = require("../../bot/i18n/utils");
const translate = require("../../bot/i18n/t9n");
const errors = require("telegram/errors");
const { isBatchUser } = require("./localDB/batchData");
const { forceSub } = require("./helpers/forceSub");
const REQUESTED_USERS = require("./localDB/request");
const { limitHandler } = require("./helpers/limitHandler");


/**
 * Adds an event handler to process batch-related messages (in a private chat).
 *
 * @param {TelegramBot} client - The Telegram bot instance.
 * @returns {Promise<number>} - A Promise that resolves to 0 after processing the batch-related message.
 * @throws {Error} - Throws an error if an exception occurs during the message processing, including FloodWaitError.
 */

module.exports = async function (client) {
    client.addEventHandler(async (update) => {
        if (
            update && update.message && update.message.message &&
            update.message.peerId.className === 'PeerUser' && !(update.message.out) &&
            ( update.message.message.toLowerCase().startsWith("/batch"))
        ) {
            try {
                if (isBatchUser(update.message.chatId)){
                    // if userin isBatchUser means send request or joined chat
                } else if ( REQUESTED_USERS.includes(update.message.chatId.value) ){
                    await limitHandler({
                        client, userId: update.message.chatId, replyTo:update.message.replyTo
                    })
                } else {
                    // Check for force subscription & time limit
                    await forceSub({ client, update })
                }

                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                let translated = await translate({
                    text: "batch.new", button: "batch.newButton",
                    langCode: lang_code, order: 21
                });
                await client.sendMessage(
                    update.message.chatId, {
                        message: translated.text,
                        buttons: translated.button,
                        parseMode: "html"
                    }
                );
                await client.deleteMessages(
                    update.message.chatId, [update.message.id], {}
                )

                return 0;
            } catch (error) {
                // Handle errors, including flood errors
                if (error instanceof errors.FloodWaitError) {
                    logger.log('error', `${file_name}: ${update.message.chatId} : ${error}`);
                    setTimeout(
                        module.exports(client), error.seconds
                    )
                } else {
                    logger.log('error', `${file_name}\batch.js ${update.message.chatId} : ${error}`);
                }
            }
        }
    });
}

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
