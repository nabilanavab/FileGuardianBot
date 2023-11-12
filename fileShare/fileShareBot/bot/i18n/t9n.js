

const fs = require('fs');
const path = require('path');
const logger = require("../../logger");
const button_trans = require("./ba10")


// language folder: with {lang_name}.json
const langFolder = path.join(__dirname, 'languages');

const localeData = {};

fs.readdir(langFolder, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    process.exit(1);
  }

  // Iterate through the list of files
  files.forEach((fileName) => {
    if (fileName.endsWith('.json')) {
      const filePath = path.join(langFolder, fileName);
      const langCode = path.basename(filePath, '.json');

      // Read and parse each JSON file
      try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        localeData[langCode] = jsonData; // Store the data with the language code as the key
        console.log(`Loaded JSON from ${fileName} with language code ${langCode}`);
      } catch (parseError) {
        console.error(`Error parsing JSON from ${fileName}:`, parseError);
      }
    }
  });
  console.log('All JSON files loaded:', localeData);
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

async function translate(
    text=null, button=null, asString=false,
    order=button_trans.maxClmnForButton, langCode=null
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
        if (button !== null) rtnButton = await createButton(
            { button: rtnButton }
        );
    } catch (error) {
        logger.log("error", `🚫 ${__dirname}: ${error}`);
    }

    return [rtnText, rtnButton];
}

module.exports = translate;