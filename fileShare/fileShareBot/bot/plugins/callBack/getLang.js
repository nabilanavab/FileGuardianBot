
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
const data = require("../../i18n/data");
const translate = require("../../i18n/t9n");
const { createButton } = require("../../i18n/ba10");

/**
 * Handles callback queries for changing Language
 * @param {object} options        - Options object.
 * @param {object} options.client - The Telegram Bot API client.
 * @param {object} options.update - The Telegram update object.
 * @returns {Promise<*>}          - A Promise that resolves with the edited message or
 *                                  false if there's an error.
 */

const maxClmnForButton = 3;

async function askLang({ client, update }) {
    try {
        // Get the user's language code
        let langCode = await getLang(update.userId);

        let translated = await translate({
            text: `lang.select`,
            button: `lang.back`,
            langCode: langCode,
            asString: true
        })
        
        let langDict = {};

        const numElements = Object.keys(data.enabledLang).length;

        for (let langKey in data.enabledLang) {
            const langNames = data.enabledLang[langKey];

            // Check if the current language key is the user's language
            const isUserLang = langKey === userLang;

            // Use tick emoji for the second value of the key if it's the user's language
            const key = isUserLang ? `${langNames[0]} ✔️` : langNames[1];
            const langKey = isUserLang ? `~lang|Done` : langNames[1];

            // Add the key-value pair to the dictionary
            langDict[key] = `~lang|${langKey}`;
        }

        langDict = { ...langDict, ...translated.button };

        // Create a number based on the variable maxLen
        let order = Array.from(
            { length: Math.ceil(numElements / maxClmnForButton) + 1 },
            (_, i, arr) => i === arr.length - 1 ?
                Math.ceil(numElements % maxClmnForButton) : Math.ceil(numElements / maxClmnForButton)
        );
        // we need to add one back button also
        order = Number(order.join('') + '1');

        newButton = await createButton({
            button: langDict,
            order: order
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

module.exports = askLang;

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