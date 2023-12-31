
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

const fs = require('fs');
const path = require('path');
const logger = require("../../logger");
const button_trans = require("./ba10");
const { createButton } = require("../i18n/ba10")

const langFolder = path.join(__dirname, 'languages');
const localeData = {};

try {
    // Read all files in the directory
    const files = fs.readdirSync(langFolder);

    // Filter files to include only JSON files
    const jsonFiles = files.filter(
        file => path.extname(file).toLowerCase() === '.json'
    );

    jsonFiles.forEach(file => {
        const languageCode = path.basename(file, '.json');
        const filePath = path.join(langFolder, file);

        try {
            localeData[languageCode] = require(filePath);
            // const data = fs.readFileSync(filePath, 'utf8');
            // const jsonData = JSON.parse(data);
            // localeData[languageCode] = jsonData;
        } catch (parseError) {
            logger.log(
                'error', `Error parsing JSON from ${file}: ${parseError.message}`
            )
        }
    });

} catch (readDirError) {
    logger.error("error", `Error reading folder: ${readDirError.message}`);
    process.exit(1);
}

/**
* This function Helps to prevent flood wait errors for all the messages.
*
* @param {number} chatId        - users chat_id
* @param {string} message       - message to user
* @param {boolean} asString     - return as string else button will be buttons
* @param {number} order         - max no.of columns in butoon
* @param {number} langCode
*
* @returns {Array}              - return translated text, or button
*
* @throws {Error} 
*
* @example
* translate(chatID, message, button)
*/

translate = async function({
    text=null, button=null, langCode=null, 
    asString=false, order=button_trans.maxClmnForButton
}) {
    let rtnText, rtnButton = null;
    langMsg = localeData[langCode] ?? localeData["eng"] ;
    
    if (text) {
        try {
            let keys = text.split('.');
            rtnText = langMsg;
            keys.forEach(key => {
                if (rtnText && rtnText[key]) {
                    rtnText = rtnText[key];
                } else {
                    rtnText = undefined;
                }
            })
        } catch (error) {
            logger.log("error", `❌❌ can't find ${text} : ${error}`);
            rtnText = localeData["eng"];
            keys.forEach(key => {
                if (rtnText && rtnText[key]) {
                    rtnText = rtnText[key];
                } else {
                    rtnText = undefined;
                }
            })
        }
    }
    if (button){
        try {
            let keys = button.split('.');
            rtnButton = langMsg;
            keys.forEach(key => {
                if (rtnButton && rtnButton[key]) {
                    rtnButton = rtnButton[key];
                } else {
                    rtnButton = undefined;
                }
            })
        } catch (error) {
            logger.log("error", `❌❌ can't find ${button} : ${error}`);
            rtnButton = localeData["eng"];
            keys.forEach(key => {
                if (rtnButton && rtnButton[key]) { rtnButton = rtnButton[key];
                } else { rtnButton = undefined; }
            })
        }
    }
    if (asString) {
        return {
            text: rtnText, button: rtnButton
        };
    }

    try {
        rtnButton = button ? await createButton(
            { button: rtnButton, order: order }
        ) : rtnButton;
    } catch (error) {
        logger.log("error", `🚫 ${__dirname}: ${error}`);
    }

    return {
        text: rtnText, button: rtnButton
    };
}

module.exports = translate;

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