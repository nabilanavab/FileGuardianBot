
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
const { DATABASE, LOG_FILE } = require("../../config");
const { CHANNEL_INFO } = require("../../config");
const { coreDbFunctions } = require("../monGo/core");
const { FloodWaitError } = require("telegram/errors/RPCErrorList");
const { forceSub } = require("./helpers/forceSub");
const getLang = require("../i18n/utils");
const translate = require("../i18n/t9n");
const decrypt = require("./cryptoG/decrypt");
const { Api } = require("telegram");
const { userForward } = require("./helpers/forward");


// Define welcome message
module.exports = async function (client) {
    client.addEventHandler(async (update) => {
        if (update && update.message && update.message.message &&
            update.message.peerId.className === 'PeerUser' &&
            update.message.message.toLowerCase().startsWith("/start")
        ) {
            logger.log('info', `user ${update.message.chatId} started bot`)
            
            try {
                // Check for force subscription & time limit
                await forceSub({ client, update })

                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                // Add a new user to the database
                if (DATABASE.MONGODB_URI) {
                    await coreDbFunctions.isUserExist({
                        userID: update.message.chatId.value,
                        elseAdd: {
                            // "name" : username, slly many cany be added
                            // check isUserExist only (only minor update needed)
                            "lang": lang_code
                        }
                    });
                }

                // Check if there is a start message from the user
                // If available, retrieve the code; otherwise, send a welcome message
                let haveCode = update.message.message.replace('/start ', '');
                if (haveCode !== '/start') {
                    const code = await decrypt({
                        code: haveCode,
                        userID: update.message.chatId
                    });
                    if(!isNaN(Number(code))){
                        // If the result is a valid number and not NaN
                        let data = await client.invoke(
                            new Api.channels.GetMessages({
                                channel: LOG_FILE.LOG_CHANNEL,
                                id: [Number(code)]
                            })
                        )
                        await userForward({
                            client: client,
                            messageIds: [ data['messages'][0]['replyTo']['replyToMsgId'] ],
                            toUser: update.message.chatId
                        })
                    }
                    return "sendAllFiles";
                }

                // Retrieve translated text and button based on the user's language
                let translated = await translate({
                    text: 'start.message',
                    button: CHANNEL_INFO.FORCE_SUB
                        ? 'start.button.withChannel'
                        : 'start.button.withOutChannel',
                    langCode: lang_code,
                    order: CHANNEL_INFO.FORCE_SUB
                        ? "221" : "211",
                });

                // If the user is a developer, include a welcome picture;
                // otherwise, send a text message
                if (!CHANNEL_INFO.WELCOME_PIC) {
                    await client.sendMessage(
                        update.message.chatId, {
                            message: translated.text,
                            buttons: client.buildReplyMarkup(
                                translated.button
                            ),
                        }
                    );
                } else {
                    await client.sendMessage(
                        update.message.chatId, {
                            message: translated.text,
                            file: CHANNEL_INFO.WELCOME_PIC,
                            buttons: client.buildReplyMarkup(
                                translated.button
                            ),
                        }
                    )
                }
                return 0;

            } catch (error) {
                // Handle errors, including flood errors
                if (error instanceof FloodWaitError) {
                    logger.log(
                        "error", `Error ${error.errorMessage} in ?start: ${error.seconds}`
                    );
                    setTimeout(
                        module.exports(client), error.seconds
                    )
                } else {
                    logger.log("error", `Error in ?start: ${error}`);
                }
            }
        }
    })
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