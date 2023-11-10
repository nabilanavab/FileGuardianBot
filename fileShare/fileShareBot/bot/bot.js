

const config = require("../config")
const loader = require("./loader")
var { TelegramClient } = require("telegram");
var { StringSession } = require("telegram/sessions");


(async () => {
    const client = new TelegramClient(
        new StringSession(""),
        config.BOT_INFO.API_ID,
        config.BOT_INFO.API_HASH,
        // https://github.com/gram-js/gramjs/issues/83
        { useWSS : true } 
    );

    client.start({
        botAuthToken: config.BOT_INFO.API_TOKEN,
    });

    client.addEventHandler((update) => {
        console.log("Received new Update");
        console.log(update);
    });
    // client.addEventHandler();

    console.log(client)
    // loader.moduleLoader(client);
    console.log(client.session.save());

})();