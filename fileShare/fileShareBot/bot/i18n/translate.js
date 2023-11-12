

const fs = require('fs');
const path = require('path');
constlogger = require("../../logger");


// language folder: with {lang_name}.json
const folderPath = './languages';


// loads all file to this file with lang_name 
// as Parsed JSON
fs.readdir(folderPath, (err, files) => {

    // Iterate through the list of files
    files.forEach((fileName) => {
        if (fileName.endsWith('.json')) {
            const filePath = path.join(folderPath, fileName);

            // Read and parse each JSON file
            fs.readFile(filePath, 'utf8', (readErr, data) => {
                if (readErr) {
                    logger.log("error", `Error reading JSON file ${fileName}: ${readErr}`);
                } else {
                try {
                    const jsonData = JSON.parse(data);
                    logger.log("error", `Parsed JSON from ${fileName}: ${jsonData}`);
                } catch (parseError) {
                    logger.log("error", `Error parsing JSON from ${fileName}: ${parseError}`);
                }
                }
            });
        }
    });
});


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

const maxClmnForButton = 2;


async function translate(
    text=null, button=null, asString=false,
    order=maxClmnForButton, langCode=null
) {
    let rtnText = text;
    let rtnButton = button;

    try {
        if (text !== null) rtnText = langCode[text];
        if (button !== null) rtnButton = langCode[text];
    } catch (error) {
        logger.log("error", `❌❌ can't find ${text} : ${error}`);
        if (text !== null) rtnText = eng[button];
        if (button !== null) rtnButton = eng[button];
    }

    // Return button as a String
    if (asString) return [rtnText, rtnButton];

    try {
        if (button !== null) rtnButton = await createButton({ btn: rtnButton, order });
    } catch (error) {
        logger.log("error", `🚫 ${__dirname}: ${error}`);
    }
    
    return [rtnText, rtnButton];
}




module.exports = translate;