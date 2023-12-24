
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


const { LANG_INFO } = require("../../../config");
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

async function changeLang({ client, update }) {
    try {
        // Get the user's language code
        let langCode = await getLang(update.userId);
        
        const langDict = {};
    
        for (const langKey in enabledLang) {
            const langNames = enabledLang[langKey];
    
            // Check if the current language key is the user's language
            const langCode = langKey === userLang;
    
            // Use tick emoji for the second value of the key if it's the user's language
            const key = langCode ? `${langNames[0]} ✔️` : langNames[1];
    
            // Add the key-value pair to the dictionary
            langDict[key] = langKey;
        }

        newButton = await createButton({
            button: langDict,
            order: 332
        })
    
        return ;

    } catch (error){

    }
}


module.exports = changeLang

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