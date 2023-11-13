

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


async function getLang(userID){

    // try to get lang code from data.useLang (default : default_lang_code)
    var userLang = data.userLang[userID] === undefined ? config.LANG_INFO.DEFAULT_LANG : data.userLang[userID];

    if (supportedLang.includes(userLang) !== -1){
        return userLang;
    } else {
        return config.LANG_INFO.DEFAULT_LANG;
    }
}

module.exports = getLang;