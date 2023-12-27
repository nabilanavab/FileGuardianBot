
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

// Import necessary modules
const logger = require("../../logger");
const { isBatchUser } = require("./localDB/batchData");
const { generateInfo } = require("./localDB/generData");
const encrypt = require("../plugins/cryptoG/encrypt");
const getLang = require("../../bot/i18n/utils");
const translate = require("../../bot/i18n/t9n");
const { FloodWaitError } = require("telegram/errors/RPCErrorList");
const editDict = require("../../bot/i18n/edtB10");
const { forceSub } = require("./helpers/forceSub");
const forward = require("./helpers/forward");
const reply = require("./helpers/reply");
const edit = require("./helpers/edit");


// All messages, except /start or /batch, will be considered as a request &
// It will automatically generate a URL for that message
module.exports = async function (client) {
    client.addEventHandler(async (update) => {
        if (
            update && update.message && !(update.message.message &&
                (update.message.message.toLowerCase().startsWith("/start") ||
                    update.message.message.toLowerCase().startsWith("/batch"))) &&
            update.message.peerId.className === 'PeerUser' &&
            !isBatchUser(update.message.chatId.value)
        ) {
            logger.log('info', `user ${update.message.chatId} generating new link..`);

            try {
                // Check for force subscription: If the user is required to subscribe forcefully
                await forceSub({ client, update, checkLimit: true })

                // Retrieve user data from the local database to determine
                // if the link should be password protected or not, etc
                let getUserInfo = generateInfo[update.message.chatId];

                // Display a series of messages to enhance user experience
                dot_message = await client.sendMessage(
                    update.message.chatId, {
                        message : ".",
                        replyTo : update.message.id,
                        parseMode: "html"
                    }
                );
                // await sleep(500);

                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                // Forward the message to the log channel
                forwardMsg = await forward.logForward({
                    client: client,
                    messageIds: [update.message.id],
                    fromUser: update.message.chatId
                });

                // Set some service message for later use
                let message = `<pre><code class="language-js">{
    "userID"            : ${update.message.chatId},
    "messageID"         : ${forwardMsg[0][0]['id']},
    "setPassword"       : ${getUserInfo['setPassword'] ? `\"${getUserInfo['setPassword']}\"` : false},
    "dropAuthor"        : ${getUserInfo['dropAuthor'] === undefined ? false : true},
    "dropMediaCaptions" : ${getUserInfo['dropMediaCaptions'] ? getUserInfo['dropMediaCaptions'] : false},
    "isAccesable"       : ${getUserInfo['isAccesable'] ? getUserInfo['isAccesable'] : false},
    "noforwards"        : ${getUserInfo['noforwards'] ? getUserInfo['noforwards'] : false},
    "duration"          : ${getUserInfo['duration'] ? getUserInfo['duration'] : false}
}</code></pre>

<a href="tg://user?id=${update.message.chatId}">👤 viewProfile 👤</a>`;

                // Send the service message to the log channel
                replyMessage = await reply.sendReplyToLog({
                    client: client,
                    replyText: message,
                    MessageId: forwardMsg[0][0]['id']
                })

                // Obtain the message information
                messageInfo = `${replyMessage['id']}`

                // Encrypt the message information
                code = await encrypt({
                    text: messageInfo,
                    userID: update.message.chatId.value
                });

                let data = ""
                for (let [key, value] of Object.entries(getUserInfo)) {
                    if (key=="setPassword")
                        data += `${value ? `<i>🔐 ${key}</i> : <spoiler>${value}</spoiler>` : ''}`;
                    else 
                        data += `${value ? `<i>🟢 ${key}</i>` : ''}`;
                    data += " | "
                }
                data = data.slice(0, -3);

                translated = await translate({
                    text: !(getUserInfo['setPassword'] == undefined)
                        ? "generate.publLink" : "generate.privLink",
                    button: "generate.button",
                    asString: true,
                    langCode: lang_code
                });
                
                // Edit the button with the generated URL
                let newButton = await editDict({
                    inDict: translated.button,
                    value: `https://telegram.dog/${botInfo.username}?start=${code}`
                })
                newButton = await createButton({
                    button: newButton, order: '11'
                })

                // Edit the user's message with the final message and URL
                await edit.editReply({
                    client: client,
                    chatId: update.message.chatId,
                    messageId: dot_message.id,
                    editedText: translated.text + data,
                    editedBtn: newButton,
                    parseMode: "html"
                })
                return 0;

            } catch (error) {
                // Handle errors, including flood errors
                if (error instanceof FloodWaitError) {
                    logger.log("error", `${error.errorMessage} ?generate: ${error.seconds}`);
                    await sleep(error.seconds);
                } else {
                    logger.log("error", `?generate: ${error}`);
                }
            }
        }
    });
};

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