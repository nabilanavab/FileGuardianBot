
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
const config = require("../../../config");
const { Api } = require('telegram');
const getLang = require("../../../bot/i18n/utils");
const translate = require("../../../bot/i18n/t9n");
const editDict = require("../../../bot/i18n/edtB10");
const { limitHandler, timeLimitError } = require("./limitHandler");


// Define a custom error class that extends the built-in Error class
class userNotJoined extends Error {
    constructor(message, code) {
        // Call the constructor of the parent class (Error)
        super(message);

        // Set the name of the error for identification
        this.name = 'userNotJoined';
    }
}

/**
 * Handles the force subscription logic based on the provided configuration.
 * @param {Object} params        - Parameters for the force subscription logic.
 * @param {Object} params.client - The Gram.js Client 
 * @param {Object} params.update - Object containing information about new message instance.
 * @returns {Promise}            - A promise that resolves with the result of the force subscription operation.
 * @throws {timeLimitError}      - Thrown if a time limit error occurs during the operation.
 * @throws {userNotJoined}       - Thrown if the user is not joined and a force subscription is attempted.
 */

const forceSub = async ({ client, update, checkLimit=false, haveCode=false }) => {
    try{
        // Check if force subscription and request URL are both disabled
        if (!config.CHANNEL_INFO.FORCE_SUB){
            // Time limit checking
            if (checkLimit){
                await limitHandler({
                    client: client,
                    userId: update.message.chatId.value,
                    replyTo: update.message.id
                })
            }
            return true;
        }

        // If force subscription is enabled, attempt to get participant information
        if (config.CHANNEL_INFO.FORCE_SUB) {
            const result = await client.invoke(
                new Api.channels.GetParticipant({
                    channel: config.CHANNEL_INFO.FORCE_SUB,
                    participant: update.message.chatId.value
                })
            );

            // Time limit checking
            if (checkLimit){
                await limitHandler({
                    client: client,
                    userId: update.message.chatId.value
                })
            }

            return result;
        }

    } catch (error) {

        if (error instanceof timeLimitError) {
            throw error;
        } else {
            let lang_code = await getLang(update.message.chatId);
            let translated = await translate({
                text: 'force.message',
                button: 'force.button',
                langCode: lang_code,
                asString: true
            });

            let newButton = await editDict({
                inDict : translated.button,
                value : [
                    config.CHANNEL_INFO.FORCE_URL,
                    haveCode.length > 8 ?
                        `https://telegram.dog/${botInfo.username}?start=${haveCode}` : "=refresh"
                ]
            })
            newButton = await createButton({
                button : newButton,
                order : '11'
            })

            await client.sendMessage(update.message.chatId, {
                message: translated.text,
                buttons: client.buildReplyMarkup(
                    newButton
                ),
                replyTo: update.message.id
            });

            logger.log('error', `${file_name}: ${update.message.chatId.value} : ${error}`);
            throw new userNotJoined("USER_NOT_JOINED")
        }
    }
};

module.exports = { forceSub };

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