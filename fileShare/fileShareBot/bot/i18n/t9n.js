

const fs = require('fs');
const path = require('path');
const logger = require("../../logger");
const button_trans = require("./ba10");


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

            // try below line or current running
            // localeData[languageCode] = require(filePath);
            const data = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(data);
            localeData[languageCode] = jsonData;

        } catch (parseError) {
            logger.log(
                `Error parsing JSON from ${file}: ${parseError.message}`
            );
        }
    });

    logger.log('All JSON files loaded:', localeData);

} catch (readDirError) {
    logger.error('Error reading folder:', readDirError.message);
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

async function translate({
    text=null, button=null, langCode=null, 
    asString=false, order=button_trans.maxClmnForButton
}) {
    let rtnText = text;
    let rtnButton = button;

    let langMsg = localeData[langCode];

    try {
        if (text){
            let keys = text.split('.');
            rtnText = langMsg;
            keys.forEach(key => {
                if (rtnText && rtnText[key]) {
                    rtnText = rtnText[key];
                } else {
                    rtnText = undefined;
                }
            })
        }
        if (button){
            let keys = button.split('.');
            rtnButton = langMsg;
            keys.forEach(key => {
                if (rtnButton && rtnButton[key]) {
                    rtnButton = rtnButton[key];
                } else {
                    rtnButton = undefined;
                }
            })
        }
    } catch (error) {
        logger.log("error", `❌❌ can't find ${text} : ${error}`);
        langMsg = localeData["eng"];
        if (text !== false){
            console.log(rtnText);
            keys = rtnText.split('.');
            rtnText = langMsg;
            keys.forEach(key => {
                if (rtnText && rtnText[key]) {
                    rtnText = rtnText[key];
                } else {
                    rtnText = undefined;
                }
            })
        }
        if (button !== false){
            keys = rtnText.split('.');
            rtnText = langMsg;
            keys.forEach(key => {
                if (rtnButton && rtnButton[key]) {
                    rtnButton = rtnButton[key];
                } else {
                    rtnButton = undefined;
                }
            })
        }
    }

    // Return button as a String
    if (asString) return [rtnText, rtnButton];

    try {
        if (button !== false) rtnButton = await createButton(
            { button: rtnButton }
        );
    } catch (error) {
        logger.log("error", `🚫 ${__dirname}: ${error}`);
    }

    return [rtnText, rtnButton];
}

module.exports = translate;