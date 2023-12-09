
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

const config = require("../../config")
const fs = require('fs');
const path = require('path');
const logger = require("../../logger");
const data = require("./data");

let supportedLang = []
const langFolder = path.join(__dirname, 'languages');

fs.readdir(langFolder, (err, files) => {
    // supportedLang: save all langs name in languages folder
    // eg: supportedLang = ["eng", "mal", "hnd","arb"]

    if (err) {
        logger.log('error', `Error reading folder: ${err}`);
        process.exit(1);
    }

    if (!config.LANG_INFO.MULTIPLE_LANG){
        supportedLang.push(config.LANG_INFO.DEFAULT_LANG);
        return supportedLang;
    } else {
        supportedLang = files.map((fileName) => {
            // Get the language code from the file name
            const langCode = fileName.slice(0, -5); // Remove the last 5 characters (".json")
            // Filter only supported languages
            return data.enabledLang[langCode] !== undefined ? langCode : null;
        }).filter(
            (langCode) => langCode !== null
        );
    }
    console.log('Supported Languages:', supportedLang);
});


getLang = async function(userID){

    // try to get lang code from data.useLang (default : default_lang_code)
    var userLang = data.userLang[userID] === undefined ?
        config.LANG_INFO.DEFAULT_LANG : data.userLang[userID];

    if (supportedLang.includes(userLang)){
        return userLang;
    } else {
        return config.LANG_INFO.DEFAULT_LANG;
    }
}

module.exports = getLang;

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