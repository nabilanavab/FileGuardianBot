


const config = require("../config")
const loader = require("./loader")
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

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

loader.moduleLoader();

console.log(client.session.save());

