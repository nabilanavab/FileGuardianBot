

const config = require("../../config")
const fs = require('fs');
const langFloder = './languages';
const logger = require("../../logger")
const data = require("data")
const yaml = require('js-yaml');



fs.readdir(folderPath, (err, files) => {

    // supportedLang: save all langs name in languages folder
    // eg: supportedLang = ["eng", "mal", "hnd","arb"]

    if (err) {
        logger.log('error', `Error reading folder: ${err}`);
        process.exit(1);
    }

    if (!config.LANG_INFO.MULTIPLE_LANG){
        const supportedLang = config.LANG_INFO.DEFAULT_LANG
        return supportedLang;
    } else {
        const supportedLang = files.filter((fileName) => {
            // Get the language code from the file name
            const langCode = fileName.split('.')[0];
            // Filter only supported languages
            return langSupport[langCode] !== undefined;
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