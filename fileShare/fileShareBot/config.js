
require('dotenv').config();
let lang_data = require('lang/data');


var OWNER = String("@nablanavab");

class BOT_INFO {
    static API_ID = Number(process.env.API_ID);
    static API_HASH = String(process.env.API_HASH);
    static API_TOKEN = String(process.env.API_TOKEN);
}

class LANG_INFO {
    static DEFAULT_LANG = String(process.env.DEFAULT_LANG) ?? "eng";
    static MULTIPLE_LANG = process.env.MULTIPLE_LANG === 'false' ? false : true;
    static ENABLED_LANG = this.MULTIPLE_LANG === fasle ? this.DEFAULT_LANG : lang_data.enabledLang;
}

class CHANNEL_INFO {
    static FORCE_SUB = Number(process.env.FORCE_SUB);
    static REQUEST_SUPPORT = Number(process.env.REQUEST_SUPPORT);
}


// checks if all the mandatory variables are there
mandatoryVariables = ['API_ID', 'API_HASH', 'API_TOKEN'];

const missingVariables = mandatoryVariables.filter(
    (variable) => !process.env[variable]
);

if (!(missingVariables.length === 0)) {
    console.error(`Missing mandatory variables: ${missingVariables.join(', ')}`);
    process.exit(1);
}
// and stops program execution if all mandatory variables are not there

// consol.log language info..
console.log(`currently supported languages: ${ENABLED_LANG}`);

module.exports = { BOT_INFO, CHANNEL_INFO};