
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

require('dotenv').config();
let lang_data = require('./bot/i18n/data');

global.OWNER = String("@nabilanavab");
global.unicornMagicNumber = false;
global.sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

class BOT_INFO {
    static API_ID = Number(process.env.API_ID);
    static API_HASH = String(process.env.API_HASH);
    static API_TOKEN = String(process.env.API_TOKEN);
}

class LANG_INFO {
    static DEFAULT_LANG = String(process.env.DEFAULT_LANG) === undefined || "eng";
    static MULTIPLE_LANG = process.env.MULTIPLE_LANG === 'false' ? false : true;
    static ENABLED_LANG = (
        this.MULTIPLE_LANG === false ? this.DEFAULT_LANG : lang_data.enabledLang
    );
}

class LOG_FILE {
    static CONSOLE_LOG = process.env.CONSOLE_LOG === 'false' ? false : true;
    static FILE_NAME = (
        process.env.LOG_FILE &&
        process.env.LOG_FILE.toLowerCase().endsWith('.log')
    ) ? process.env.LOG_FILE.toLowerCase() : false;
    static LOG_CHANNEL = Number(process.env.LOG_CHANNEL);
}

class CHANNEL_INFO {
    static FORCE_URL = null;
    static FORCE_SUB = Number(process.env.FORCE_SUB) ? Number(process.env.FORCE_SUB) : 0;
    static WELCOME_PIC = String(process.env.WELCOME_PIC);
    static REQUEST_URL = String(process.env.REQUEST_URL);
    static AUTO_APPROVAL = process.env.CONSOLE_LOG === 'true' ? true : false;
}

class SOURCE_INFO {
    static SOURCE_CODE = "https://github.com/nabilanavab";
    static OWNER_GITHUB = "https://github.com/nabilanavab";
    static OWNER_TELEGRAM = "https://telegram.dog/nabilanavab";
}

class DATABASE {
    static MONGODB_URI = String(process.env.MONGODB_URI)
}

// checks if all the mandatory variables are there
mandatoryVariables = ['API_ID', 'API_HASH', 'API_TOKEN', "LOG_CHANNEL"];

const missingVariables = mandatoryVariables.filter(
    (variable) => !process.env[variable]
);

if (!(missingVariables.length === 0)) {
    console.error(`Missing mandatory variables: ${missingVariables.join(', ')}`);
    process.exit(1);
}
// and stops program execution if all mandatory variables are not there

// Display Current Settings to Console
console.log(`currently supported languages: 
    ${JSON.stringify(LANG_INFO.ENABLED_LANG, null, 4)}`
);
console.log(`log file : ${LOG_FILE.FILE_NAME}`)


module.exports = {
    BOT_INFO, LANG_INFO, LOG_FILE,
    CHANNEL_INFO, DATABASE
};

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