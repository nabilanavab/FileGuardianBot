
const config = require("../config");
let logger = require("../logger");
const loader = require("./loader");
var { TelegramClient, errors, client } = require("telegram");
var { StringSession } = require("telegram/sessions");

global.botInfo = null;

(async () => {
    const client = new TelegramClient(
        new StringSession(""),
        config.BOT_INFO.API_ID,
        config.BOT_INFO.API_HASH,
        // https://github.com/gram-js/gramjs/issues/83
        { useWSS : true } 
    );

    async function auth() {
        try {
            await client.start({
                botAuthToken: config.BOT_INFO.API_TOKEN,
            });

            botInfo = await client.getMe();
        } catch (error) {
            if (error instanceof errors.FloodWaitError) {
                logger.log(`Error During Login: ${error}`);
                await sleep(error.seconds * 1000)
                auth();
            } else {
                logger.log(`Error During Login: ${error}`);
            }
        }
    }
    auth();

    // loads all files from plugins
    loader(client);

    // save bot client session
    client.session.save();

})();
