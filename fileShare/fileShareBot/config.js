
require('dotenv').config();




var OWNER = String("@nablanavab");

class BOT_INFO {
    static API_ID = Number(process.env.API_ID);
    static API_HASH = String(process.env.API_HASH);
    static API_TOKEN = String(process.env.API_TOKEN);
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

module.exports = { BOT_INFO, CHANNEL_INFO};