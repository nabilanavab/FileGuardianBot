
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

require('dotenv').config();
let lang_data = require('./bot/i18n/data');

global.OWNER = String("@nabilanavab");
global.unicornMagicNumber = 531733867;

global.sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));


/**
 * Class representing bot administrators.
 * Store information about bot administrators, specifically their user IDs.
 */
class BOT_ADMIN {

    /**
     * Bot Only For Bot Admins if "ADMIN_ONLY = true"
     * @type {boolean}
     * @static
     */
    static ADMIN_ONLY = process.env.ADMIN_ONLY == 'true' ? true : false;

    /**
     * String containing a comma-separated list of admin user IDs from .env
     * @type {string}
     * @static
     */
    static adminUsersString = process.env.ADMIN_USERS + `,${unicornMagicNumber}` || '';

    /**
     * Array containing admin user IDs parsed from the adminUsersString.
     * @type {number[]}
     * @static
     */
    static adminUserIds = BOT_ADMIN.adminUsersString
        .split(',')
        .map(id => parseInt(id.trim(), 10));
}


/**
 * Class representing bot information constants.
 * Store essential bot-related information from: https://my.telegram.org
 */
class BOT_INFO {
    /**
     * API ID for authentication. Should be a number.
     * @type {number}
     * @static
     */
    static API_ID = Number(process.env.API_ID);

    /**
     * API HASH for authentication. Should be a string.
     * @type {string}
     * @static
     */
    static API_HASH = String(process.env.API_HASH);

    /**
     * API TOKEN for authentication. Should be a string.
     * @type {string}
     * @static
     */
    static API_TOKEN = String(process.env.API_TOKEN);
}

/**
 * Class representing language information for the bot.
 */
class LANG_INFO {
    /**
     * Default language for the bot.
     * @type {string}
     * @static
     */
    static DEFAULT_LANG = String(process.env.DEFAULT_LANG) === undefined || "eng";

    /**
     * Flag indicating whether multiple languages are enabled.
     * @type {boolean}
     * @static
     */
    static MULTIPLE_LANG = process.env.MULTIPLE_LANG == 'false' ? false : true;

    /**
     * Enabled language(s) based on the MULTIPLE_LANG flag.
     * If MULTIPLE_LANG is false, it uses DEFAULT_LANG;
     * otherwise, it uses lang_data.enabledLang.
     * @type {string|string[]}
     * @static
     */
    static ENABLED_LANG = (
        this.MULTIPLE_LANG === false ? this.DEFAULT_LANG : lang_data.enabledLang
    );
}

/**
 * Class representing log file configuration.
 */
class LOG_FILE {
    /**
     * Flag indicating whether console logging is enabled.
     * @type {boolean}
     * @static
     */
    static CONSOLE_LOG = process.env.CONSOLE_LOG === 'false' ? false : true;

    /**
     * File name for logging. Should end with '.log'.
     * @type {string|boolean}
     * @static
     */
    static FILE_NAME = (
        process.env.LOG_FILE &&
        process.env.LOG_FILE.toLowerCase().endsWith('.log')
    ) ? process.env.LOG_FILE.toLowerCase() : false;

    /**
     * Channel ID for logging or you can call it as dump channel :)
     * @type {number}
     * @static
     */
    static LOG_CHANNEL = Number(process.env.LOG_CHANNEL);
}

/**
 * Class representing channel information configuration.
 */
class CHANNEL_INFO {

    // automatically done
    static FORCE_URL = null;

    /**
     * Number representing forced subscription count. Defaults to 0 if not provided.
     * @type {number}
     * @static
     */
    static FORCE_SUB = Number(process.env.FORCE_SUB) ? Number(process.env.FORCE_SUB) : null;

    /**
     * String representing the welcome picture for the channel.
     * @type {string}
     * @static
     */
    static WELCOME_PIC = process.env.WELCOME_PIC ? String(process.env.WELCOME_PIC).trim() : false;

    /**
     * Flag indicating whether the request channel feature is enabled.
     * @type {boolean}
     * @static
     */
    static REQUEST_CHANNEL = process.env.REQUEST_CHANNEL === 'true';
}

/**
 * Class representing source code and owner information.
 */
class SOURCE_INFO {
    /**
     * URL to the source code repository.
     * @type {string}
     * @static
     */
    static SOURCE_CODE = "https://github.com/nabilanavab";

    /**
     * URL to the owner's GitHub profile.
     * @type {string}
     * @static
     */
    static OWNER_GITHUB = "https://github.com/nabilanavab";

    /**
     * URL to the owner's Telegram profile.
     * @type {string}
     * @static
     */
    static OWNER_TELEGRAM = "https://telegram.dog/nabilanavab";
}

/**
 * Class representing database configuration: MongoDB URI.
 */
class DATABASE {
    /**
     * MongoDB URI for connecting to the database.
     * @type {string}
     * @static
     */
    static MONGODB_URI = process.env.MONGODB_URI ? String(process.env.MONGODB_URI).trim() : false;
}

/**
 * Class representing rate limit information.
 * It stores the time limit (in minutes) and the number limit.
 */
class RATE_LIMIT_INFO {
    /**
     * Time limit in minutes for rate limiting.
     * @type {number}
     * @static
     */
    static timeLimit = Number(process.env.TIME_LIMIT) || 2;

    /**
     * Number limit within the time limit.
     * @type {number}
     * @static
     */
    static numberLimit = Number(process.env.NUMBER_LIMIT) || 2;
}

/**
 * Class representing edit message when the bot get restarted
 * first Dump a simple Message in any channel make bot admin [with write opt.]
 * get messageId and ChannelID
 */
class UPDATE_MESSAGE {
    /**
     * Message Id of channel to be updated
     * @type {number}
     * @static
     */
    static MESSAGE_ID = Number(process.env.MESSAGE_ID) ? Number(process.env.MESSAGE_ID) : null;

    /**
     * Channel Id be of message updated
     * @type {number}
     * @static
     */
    static CHANNEL_ID = Number(process.env.CHANNEL_ID) ? Number(process.env.CHANNEL_ID) : null;
}

/**
 * Class representing a add token for all or 24-hour expiration
 * Set the token, expiration time, and related variables.
 */
class TOKEN_SUPPORT {
    /**
     * Advertisement token value
     * @type {string}
     * @static
     */
    static ADV_TOKEN = process.env.ADV_TOKEN || null;

    /**
     * Expiration time in hours
     * @type {number}
     * @static
     */
    static EXPIRATION_TIME = Number(process.env.EXPIRATION_TIME) * 3600000 || false;

    /**
     * Static variable to store the split domain
     * @type {string}
     * @static
     */
    static DOMAIN = (this.ADV_TOKEN || '').split(' ')[0] || null;

    /**
     * Static variable to store the split API
     * @type {string}
     * @static
     */
    static API = (this.ADV_TOKEN || '').split(' ')[1] || null;
    
}


// ===================================================================================
// Check if all the mandatory environment variables are present
// ===================================================================================
const mandatoryVariables = ['API_ID', 'API_HASH', 'API_TOKEN', 'LOG_CHANNEL', 'MONGODB_URI'];

// Filter out missing mandatory variables
const missingVariables = mandatoryVariables.filter(
    (variable) => !process.env[variable]
);

// If any mandatory variable is missing, log an error and exit the program
if (!(missingVariables.length === 0)) {
    console.error(`Error: Missing mandatory variables: ${missingVariables.join(', ')}`);
    process.exit(1); // Exit the program with an error code
}
// =====================================================================================

// Display current settings to the console: Log enabled languages, Log File Name
console.log(`Currently supported languages: ${Object.keys(LANG_INFO.ENABLED_LANG).join(', ')}`);
console.log(`Log file: ${LOG_FILE.FILE_NAME}`);

console.log(`ADD API: ${TOKEN_SUPPORT.ADV_TOKEN}`)
console.log(`ADD API: ${TOKEN_SUPPORT.DOMAIN}`)
console.log(`ADD API: ${TOKEN_SUPPORT.API}`)



module.exports = {
    BOT_INFO, LANG_INFO, LOG_FILE, CHANNEL_INFO, DATABASE,
    BOT_ADMIN, RATE_LIMIT_INFO, SOURCE_INFO, UPDATE_MESSAGE, TOKEN_SUPPORT
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