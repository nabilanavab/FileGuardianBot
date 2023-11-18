
const config = require("../config");
let logger = require("../logger");
const loader = require("./loader");
const { Api } = require('telegram');
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

            if ( config.CHANNEL_INFO.FORCE_SUB ) {
                try {
                    // checks whether an admin
                    await client.invoke(
                        new Api.channels.GetParticipant({
                            channel: config.CHANNEL_INFO.FORCE_SUB,
                            participant: botInfo.id
                        })
                    );

                    // getiing force subscribe url
                    let fullChannel = await client.invoke(
                        new Api.channels.GetFullChannel({
                            channel: Number(config.CHANNEL_INFO.FORCE_SUB)
                        })
                    );

                    if (fullChannel.chats[0].username) {
                        config.CHANNEL_INFO.FORCE_URL = `telegram.dog/${fullChannel.chats[0].username}`
                    } else if ( !config.CHANNEL_INFO.REQUEST_CHANNEL ) {
                        config.CHANNEL_INFO.FORCE_URL = fullChannel.fullChat.exportedInvite.link
                    }

                } catch (error) {
                    config.CHANNEL_INFO.FORCE_SUB = null;
                    logger.log('error', `Maybe B0t N0t Admin in UpdateChannel: ${error}`);
                    logger.log('error', 'So Removing Update Channel and Getting Start Bot');
                }
            }

            // checks whether b0t admin in l0g channel
            await client.invoke(
                new Api.channels.GetParticipant({
                    channel: config.LOG_FILE.LOG_CHANNEL,
                    participant: botInfo.id
                })
            );

            try {
                // checking log channel permission
                let fullChannel = await client.invoke(
                    new Api.channels.GetFullChannel({
                        channel: Number(config.CHANNEL_INFO.FORCE_SUB)
                    })
                );

                console.log(fullChannel);
            } catch (error) {
                logger.log('error', 'Bot dont have the required permission in log channel');
                logger.log('error', 'make admin with sendMessage permission...')
                logger.log('error', `Error in Log Channel : ${error}`)
            }

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
