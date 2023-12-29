
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

const file_name = __filename
const author = "@nabilanavab"

const logger = require("../../../logger");
const { generateInfo } = require("../localDB/generData");
const translate = require("../../i18n/t9n");
const { createButton } = require("../../i18n/ba10");

/**
 * Handles callback queries for changing message delete Duration
 * @param {object} options        - Options object.
 * @param {object} options.client - The Telegram Bot API client.
 * @param {object} options.update - The Telegram update object.
 * @returns {Promise<*>}          - A Promise that resolves with the edited message or
 *                                  false if there's an error.
 */

async function askDuration({ client, update }) {
    try {
        // Get the user's language code
        let langCode = await getLang(update.userId);

        let translated = await translate({
            text: `duration.message`,
            button: `duration.button`,
            langCode: langCode,
            asString: true
        })
        
        let langDict = {}, index = 0;

        // Check if user's preferred duration is set in generateInfo
        const currentDuration = generateInfo[update.userId]?.duration;

        // Iterate through translated.button using duration as the variable name
        for (let durationKey in translated.button) {
            const durationNames = translated.button[durationKey].replace("$", "");

            if (index === 0 && !currentDuration) {

                langDict[`🟢 ${durationKey} 🟢`] = `$${durationNames}`;

            } else {
                
                // Check if the current duration key is the user's preferred duration
                const isUserDuration = currentDuration === durationNames;

                // Use tick emoji for the second value of the key if it's the user's preferred duration
                const key = isUserDuration ? `🟢 ${durationKey} 🟢` : `${durationKey}`;
                
                if (durationNames != "!set") langDict[key] = `$${durationNames}`;
                else langDict[key] = durationNames;
                    
            }

            index++;
        }

        newButton = await createButton({
            button: langDict,
            order: 33331
        })
    
        return await client.editMessage(
            update.userId, {
                message: update.msgId,
                text: translated.text,
                buttons: client.buildReplyMarkup(newButton),
                parseMode: "html",
            }
        );

    } catch (error){
        logger.log('error', `${file_name}: ${update.userId} : ${error}`);
        return false;
    }
}

module.exports = askDuration;

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