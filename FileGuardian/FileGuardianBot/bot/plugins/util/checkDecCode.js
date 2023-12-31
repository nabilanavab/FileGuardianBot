
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

const decrypt = require("../cryptoG/decrypt");
const decHandler = require("./decHandler");

/**
 * Checks and processes a decryption code, then invokes the decryption handler.
 *
 * @param {Object} params - The parameters object.
 * @param {TelegramBot} params.client - The Telegram bot instance.
 * @param {string} params.code - The decryption code to check.
 * @param {number} params.userID - The ID of the user making the request.
 * @param {number} params.replyTo - The ID of the message to reply to.
 * @returns {Promise<boolean|string>} - A Promise that resolves to true if the decryption and handling are successful,
 *   or a string ("💩") representing an error if decryption or handling fails.
 */

async function checkDecCode({client, code, userID, replyTo}) {
    try {
        messageID = await decrypt({
            code: code, userID: userID
        });

        await decHandler({
            client: client, userID: userID, code: code, replyTo: replyTo,
            messageID: messageID.startsWith("batch:") ? messageID.replace("batch:", ""): messageID,
            massForward: messageID.startsWith("batch:") ? true : false
        })
        return true

    } catch ( error ){
        let lang_code = await getLang(userID);
        let translated = await translate({
            text : 'settings.errorLink',  order: 1,
            button : 'settings.closeCB', langCode : lang_code,
        })

        await client.sendMessage(
            userID, {
                message: translated.text,
                buttons: translated.button,
                replyTo: replyTo
            }
        )
        return "💩" 
    }
}

module.exports = checkDecCode;

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