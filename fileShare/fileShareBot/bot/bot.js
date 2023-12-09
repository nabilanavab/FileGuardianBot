
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

const file_name = __dirname
const author = "@nabilanavab"

const config = require("../config");
const logger = require("../logger");
const loader = require("./loader");
const { Api } = require('telegram');
const { TelegramClient, client } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { FloodWaitError } = require("telegram/errors/RPCErrorList");

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
                    } else {
                        const inviteLink = await client.invoke(
                            new Api.messages.ExportChatInvite({
                                peer : config.CHANNEL_INFO.FORCE_SUB,
                                title : OWNER,
                                requestNeeded: true
                            })
                        );
                        config.CHANNEL_INFO.FORCE_URL = inviteLink.link
                    }

                } catch (error) {
                    config.CHANNEL_INFO.FORCE_SUB = null;
                    logger.log('error', `Maybe B0t N0t Admin in UpdateChannel: ${error}`);
                    logger.log('error', 'So Removing Update Channel and Getting Start Bot');
                }
            }

            {
                try {
                    // checks whether b0t admin in l0g channel
                    let logPermissoin = await client.invoke(
                        new Api.channels.GetParticipant({
                            channel: config.LOG_FILE.LOG_CHANNEL,
                            participant: botInfo.id
                        })
                    );
                    if (!( logPermissoin && logPermissoin.participant && 
                        logPermissoin.participant.adminRights && 
                        logPermissoin.participant.adminRights.postMessages
                    )) {
                        logger.log('error', 'Bot Must be Admin in Log Channel..');
                        process.exit(1);
                    }
                } catch (error) {
                    logger.log('error', `Telegram API : ${error}`);
                    logger.log('error', `Error Message: ${error.message}`);
                    logger.log('info', "B0t must be Admin In Channel [with SendMessage permis.]")
                    process.exit(1);
                }
            }

        } catch (error) {
            
            if (error instanceof FloodWaitError) {

                logger.log('error', `Error During Login: ${error}`);
                await sleep(error.seconds * 1000)
                auth();

            } else {
                logger.log('error', `Error During Login: ${error}`);
            }
        }
    }
    auth();

    // loads all files from plugins
    loader(client);

    // save bot client session
    client.session.save();

})();

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