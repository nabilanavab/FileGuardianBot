


const config = require("../config")
const loader = require("./loader")
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

(async () => {
  
    const client = new TelegramClient(
        new StringSession(""),
        config.BOT_INFO.API_ID,
        config.BOT_INFO.API_HASH,
        // https://github.com/gram-js/gramjs/issues/83
        { useWSS : true } 
    );

    await client.start({
        botAuthToken: config.BOT_INFO.API_TOKEN,
    });

    console.log(client.session.save());

})();
