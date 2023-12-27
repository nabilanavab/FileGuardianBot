
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

// Import necessary modules
let logger = require("../../logger");
const getLang = require("../../bot/i18n/utils");
const translate = require("../../bot/i18n/t9n");
const errors = require("telegram/errors");
const { isBatch, isBatchUser } = require("./localDB/batchData");
const { forceSub } = require("./helpers/forceSub");


// Check if the user sent a /batch (in a private chat)
module.exports = async function (client) {
    client.addEventHandler(async (update) => {
        if (
            update && update.message && update.message.message &&
            update.message.peerId.className === 'PeerUser' &&
            update.message.message.toLowerCase().startsWith("/batch")
        ) {
            logger.log('info', `user ${update.message.chatId} started batching`)
            try {
                // Check for force subscription & time limit
                await forceSub({ client, update, checkLimit:true })

                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                if (!isBatchUser(update.message.chatId.value)) {
                    // If the user is not currently in the batch process
                    // or workflow, add them to the process
                    isBatch.push(
                        { "id": update.message.chatId.value }
                    );
                    let translated = await translate({
                        text: "batch.new",
                        langCode: lang_code
                    });
                    await client.sendMessage(
                        update.message.chatId,
                        {
                            message: translated.text,
                            replyTo: update.message.id
                        }
                    );
                } else {
                    // If the user is already in the batch process,
                    // Make an Option to remove them from the process
                    let translated = await translate({
                        text: "batch.current",
                        langCode: lang_code
                    });
                    await client.sendMessage(
                        update.message.chatId,
                        {
                            message: translated.text,
                            replyTo: update.message.id
                        }
                    );
                }
                return 0;
            } catch (error) {
                // Handle errors, including flood errors
                if (error instanceof errors.FloodWaitError) {
                    logger.log(
                        "error", `Error ${error.errorMessage} in ?batch: ${error.seconds}`
                    );
                    setTimeout(
                        module.exports(client), error.seconds
                    )
                } else {
                    logger.log("error", `Error in ?batch: ${error}`);
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