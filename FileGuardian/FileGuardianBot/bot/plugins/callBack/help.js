
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

/**
 * Handles callback queries related to the help command.
 * @param {object} options        - Options object.
 * @param {object} options.client - The Telegram Bot API client.
 * @param {object} options.update - The Telegram update object.
 * @returns {Promise<*>}          - A Promise that resolves with the edited message or
 *                                  false if there's an error.
 */

async function helpCbHandler({ client, update }) {
    try {
        // Decode callback data from base64
        let cbData = Buffer.from(update.data, 'base64').toString('utf8');

        // Extract the new page from callback data
        let newPage = cbData.split("|")[1];

        // Get the user's language code
        let langCode = await getLang(update.userId);

        // Translate message and buttons based on the new page
        let translated = await translate({
            text: `help.${newPage}.message`,
            button: `help.${newPage}.button`,
            langCode: langCode,
            order: newPage==0 ? 2121 : 2
        });

        // Edit the original message with the translated text and buttons
        return await client.editMessage(
            update.userId, {
                message: update.msgId,
                text: translated.text,
                buttons: client.buildReplyMarkup(translated.button),
                parseMode: "html",
            }
        );

    } catch (error) {
        logger.log(`${file_name}: ${update.userId} : ${error}`);
        return false;
    }
}

module.exports = helpCbHandler;

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