

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
const { generateInfo } = require("../localDB/generData");
const translate = require("../../i18n/t9n");
const { createButton } = require("../../i18n/ba10");

/**
 * Handles callback queries related to the help command.
 * @param {object} options        - Options object.
 * @param {object} options.client - The Telegram Bot API client.
 * @param {object} options.update - The Telegram update object.
 * @returns {Promise<*>}          - A Promise that resolves with the edited message or
 *                                  false if there's an error.
 */

async function settingsCbHandler({ client, update }) {
    try {
        // Get the user's language code
        let langCode = await getLang(update.userId);

        let translated = await translate({
            text: `settings.message`,
            button: `settings.button`,
            langCode: langCode,
            asString: true,
            order: 2211
        });

        let newButton = {};
        if (!generateInfo[update.userId]){
            generateInfo[update.userId] = {}
        };

        for (let [key, value] of Object.entries(translated.button)) {
            if (value.startsWith(":password")){
                let replacementValue = generateInfo[update.userId]['setPassword'];

                let replacementKey = (replacementValue !== undefined)
                    ? "🔐 " + key : "🔓 " + key;
                
                if (replacementValue){
                    value = `:password ${replacementValue}`
                }
                
                newButton[replacementKey] = value;
            
            } else {
                "!{name} : corresponts to generateInfo[user][name]"
                let modifiedValue = value.replace("!", "");
                let replacementValue = generateInfo[update.userId][modifiedValue];

                let replacementKey = (!value.startsWith("!"))
                    ? key : ( replacementValue == true )
                        ? "✅ " + key + " ✅"
                        : "☑️ " + key + " ☑️";
                
                if (replacementValue){
                    value = `${value}|true`
                } else {
                    value = `${value}|false`
                }

                newButton[replacementKey] = value;
            }
        }

        newButton = await createButton({
            button: newButton,
            order: 2211
        })
        return await client.editMessage(
            update.userId, {
                message: update.msgId,
                text: translated.text,
                buttons: client.buildReplyMarkup(newButton),
                parseMode: "html",
            }
        );
        
    } catch (error) {
        logger.log('error', `${file_name}: ${update.userId} : ${error}`);
        return false;
    }
}

module.exports = settingsCbHandler;

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