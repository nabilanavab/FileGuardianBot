
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

const file_name = __dirname + __filename
const author = "@nabilanavab"

const config = require("../config");
const logger = require("../logger");
const loader = require("./loader");
const { Api } = require('telegram');
const { TelegramClient, client } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { FloodWaitError } = require("telegram/errors/RPCErrorList");
const scheduleDB = require("./monGo/shdulFrmDb");
const { Button } = require("telegram/tl/custom/button");


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
            
            await client.invoke(
                new Api.bots.SetBotCommands({
                    scope: new Api.BotCommandScopeDefault({}),
                    langCode: "en",
                    commands: [
                        new Api.BotCommand({
                            command: "start",
                            description: "check if the bot is live.. 🤖"
                        }),
                        new Api.BotCommand({
                            command: "batch",
                            description: "Batch multiple files. 📁"
                        }),
                        new Api.BotCommand({
                            command: "addCaption",
                            description: "add custom caption ☕"
                        }),
                        new Api.BotCommand({
                            command: "deleteCaption",
                            description: "delete current caption 😆"
                        }),
                        new Api.BotCommand({
                            command: "addButton",
                            description: "add custion butttton 🥴"
                        }),
                        new Api.BotCommand({
                            command: "deleteButton",
                            description: "delete current button 🤕"
                        }),
                        new Api.BotCommand({
                            command: "view",
                            description: "view current button, caption 😵"
                        }),
                    ]
                })
            )

            try {
                if (config.UPDATE_MESSAGE.MESSAGE_ID && config.UPDATE_MESSAGE.CHANNEL_ID){
                    // Bot Restart Messsage 
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);
                    const day = String(now.getDate()).padStart(2, '0');

                    // Date in the format YYYY:Month:DD
                    const formattedDate = `${year} : ${month} : ${day}`;
                    // Time in the format HH:MM:SS AM/PM
                    const formattedTime = now.toLocaleTimeString();

                    await client.editMessage(
                        config.UPDATE_MESSAGE.CHANNEL_ID, {
                            message: config.UPDATE_MESSAGE.MESSAGE_ID,
                            text: `🔄 <b>Bot Restarted Successfully!</b>

🤖 <b>Bot Information:</b>
    - Bot Name      : <a href="https://telegram.dog/${botInfo.username}">${botInfo.firstName}</a>
    - Username      : @${botInfo.username}

📅 <b>Restart Details:</b>
    - Date                   : <code>${formattedDate}</code>
    - Time                   : <code>${formattedTime}</code>

👤 <b>Bot Management:</b>
    - Contact Owner : @nabilanavab
    - Powered By       : @ilovepdf_bot`,
                            buttons: client.buildReplyMarkup([[
                                    Button.url(text="✨ SOURCE CODE ✨", url="github.com/nabilanavab/fileGuardianBot")
                                ],[
                                    Button.url(text="👤 OWNED BY 👤", url="https://telegram.dog/nabilanavab"),
                                    Button.url(text="🤖 START BOT 🤖", url=`https://telegram.dog/${botInfo.username}`)
                                ]
                            ]),
                            noWebpage: true,
                            parseMode: "html",
                            media: new Api.InputMediaPhotoExternal(
                                { url: "https://graph.org/file/193ce6d1ff3062a38d7c1.jpg" }
                            )
                        }
                    )
                }
            } catch (error) {
                console.log(error)
            }

            if (config.DATABASE.MONGODB_URI)
                await scheduleDB(client);

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
    await loader(client);

    // save bot client session
    await client.session.save();

    console.log(`

 █████▒██▓ ██▓    ▓█████      ▄████   █    ██   ▄▄▄     ██▀███    ▓█████▄  ██▓ ▄▄▄       ███▄   █     ▄▄▄▄    ▒█████   ▄▄▄█████▓
▓██  ▒▓██▒▓██▒     ▓█   ▀     ██▒ ▀█▒ ██   ▓██▒▒████▄   ▓██ ▒ ██▒▒██▀ ██▌▓██▒▒████▄     ██ ▀█   █    ▓█████▄ ▒██▒  ██▒▓  ██▒ ▓▒
▒████ ░▒██▒▒██░    ▒███      ▒██░▄▄▄░▓██  ▒██░▒██  ▀█▄  ▓██ ░▄█ ▒░██   █▌▒██▒▒██  ▀█▄  ▓██  ▀█ ██▒   ▒██▒ ▄██▒██░  ██▒▒ ▓██░ ▒░
░▓█▒  ░░██░▒██░    ▒▓█  ▄    ░▓█  ██▓▓▓█  ░██░░██▄▄▄▄██ ▒██▀▀█▄  ░▓█▄   ▌░██░░██▄▄▄▄██ ▓██▒  ▐▌██▒   ▒██░█▀  ▒██   ██░░ ▓██▓ ░ 
░▒█░   ░██░░██████▒░▒████▒   ░▒▓███▀▒▒▒█████▓  ▓█   ▓██▒░██▓ ▒██▒░▒████▓ ░██░ ▓█   ▓██▒▒██░   ▓██░   ░▓█  ▀█▓░ ████▓▒░  ▒██▒ ░ 
▒ ░   ░▓  ░ ▒░▓  ░░░ ▒░ ░    ░▒   ▒ ░▒▓▒ ▒ ▒  ▒▒   ▓▒█░░ ▒▓ ░▒▓░ ▒▒▓  ▒ ░▓   ▒▒   ▓▒█░░ ▒░   ▒ ▒    ░▒▓███▀▒░ ▒░▒░▒░   ▒ ░░   
 ░      ▒ ░░ ░ ▒  ░ ░ ░  ░     ░   ░ ░░▒░ ░ ░   ▒   ▒▒ ░  ░▒ ░ ▒░ ░ ▒  ▒  ▒ ░  ▒   ▒▒ ░░ ░░   ░ ▒░   ▒░▒   ░   ░ ▒ ▒░     ░    
 ░ ░    ▒ ░  ░ ░      ░      ░ ░   ░  ░░░ ░ ░   ░   ▒     ░░   ░  ░ ░  ░  ▒ ░  ░   ▒      ░   ░ ░     ░    ░ ░ ░ ░ ▒    ░      
   ░      ░  ░   ░  ░         ░    ░           ░  ░   ░        ░     ░        ░  ░         ░     ░          ░ ░           
                                                                 ░                                        ░                   
        `)

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
