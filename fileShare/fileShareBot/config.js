
require('dotenv').config();

class BOT_INFO {
    static OWNER = String("@nablanavab")
    
    static API_ID = Number(process.env.API_ID);
    static API_HASH = String(process.env.API_HASH);
    static API_TOKEN = String(process.env.API_TOKEN);
}

class CHANNEL_INFO {
    static FORCE_SUB = Number(process.env.FORCE_SUB);
    static REQUEST_SUPPORT = Number(process.env.REQUEST_SUPPORT);
}

module.exports = { BOT_INFO, CHANNEL_INFO };