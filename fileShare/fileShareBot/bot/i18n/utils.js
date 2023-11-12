

const config = require("../../config")
const fs = require('fs');
const path = require('path');
const logger = require("../../logger");
const data = require("./data");



const langFolder = path.join(__dirname, 'languages');

fs.readdir(langFolder, (err, files) => {

    // supportedLang: save all langs name in languages folder
    // eg: supportedLang = ["eng", "mal", "hnd","arb"]

    if (err) {
        logger.log('error', `Error reading folder: ${err}`);
        process.exit(1);
    }

    let supportedLang = []
    if (!config.LANG_INFO.MULTIPLE_LANG){
        supportedLang.push(config.LANG_INFO.DEFAULT_LANG);
        return supportedLang;
    } else {
        supportedLang = files.filter((fileName) => {
            // Get the language code from the file name
            const langCode = fileName.split('.')[0];
            // Filter only supported languages
            return supportedLang[langCode] !== undefined;
        });
    }
    
    console.log('Supported Languages:', supportedLang);

});


async function getLang(userID){

    var userLang = data.userLang[userID] || config.LANG_INFO.DEFAULT_LANG;
    if (supportedLang.inclues(userLang) !== -1){
        return userLang;
    } else {
        return config.LANG_INFO.DEFAULT_LANG;
    }
}

module.exports = getLang;