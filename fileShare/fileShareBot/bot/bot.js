

const config = require("../config");
const loader = require("./loader")
let logger = require("../logger")
var { TelegramClient, errors } = require("telegram");
var { StringSession } = require("telegram/sessions");


(async () => {
    const client = new TelegramClient(
        new StringSession(""),
        config.BOT_INFO.API_ID,
        config.BOT_INFO.API_HASH,
        // https://github.com/gram-js/gramjs/issues/83
        { useWSS : true } 
    );

    function auth() {
        try {
            client.start({
                botAuthToken: config.BOT_INFO.API_TOKEN,
            });
        } catch (error) {
            if (error instanceof errors.FloodWaitError) {
                logger.log(`Error During Login: ${error}`);
                auth();
            }
        }
    }
    auth();

    // loads all files from plugins
    loader(client);

    // save bot client session
    client.session.save();

})();