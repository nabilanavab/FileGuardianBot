
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

// Import necessary modules
const logger = require("../../logger");
const { isBatchUser, batchCompleted } = require("./localDB/batchData");
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
const REQUESTED_USERS = require("./localDB/request");
const { limitHandler } = require("./helpers/limitHandler");


/**
 * Event handler to process messages, generating URLs for requests, excluding /start and /batch commands.
 *
 * @param {TelegramBot} client - The Telegram bot instance.
 * @returns {Promise<void>} - A Promise that resolves when the message processing is completed.
 */

const validCommands = [
    '/start', '/batch', '/addcaption', '/view',
    '/deletecaption', '/addbutton', '/deletebutton'
];
module.exports = async function (client) {
    client.addEventHandler(async (update) => {
        if (
            update?.message?.peerId?.className === 'PeerUser' && !update?.message?.out &&
            !validCommands.some(cmd => update?.message?.message?.toLowerCase()?.startsWith(cmd)) &&
            !isBatchUser(update.message.chatId.value)
        ) {
            if (batchCompleted.includes(update.message.chatId.value)){
                // even if the batch is completed it enters this func. and generate 
                // link for the last message as !isBatchUser(update.message.chatId.value) == true
                batchCompleted.pop(update.message.chatId.value)
                return
            }
            try {
                // Check for force subscription: If the user is required to subscribe forcefully
                if ( REQUESTED_USERS.includes(update.message.chatId.value) ){
                    await limitHandler({
                        client, userId: update.message.chatId.value, replyTo:update.message.replyTo
                    })
                } else {
                    console.log("here")
                    // Check for force subscription & time limit
                    await forceSub({ client, update })
                }

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
                    messageId: update.message.id,
                    fromUser: update.message.chatId
                });

                // Set some service message for later use
                let message = `
${getUserInfo && getUserInfo['caption'] ? `${getUserInfo['caption']}` : ""}

:: data ::
<pre><code class="language-js">{
    "userID"            : ${update.message.chatId},
    "messageID"         : ${forwardMsg[0][0]['id']},
    "setPassword"       : ${getUserInfo && getUserInfo['setPassword'] ? `\"${getUserInfo['setPassword']}\"` : false},
    "dropAuthor"        : ${getUserInfo && getUserInfo['dropAuthor'] === undefined ? false : true},
    "dropMediaCaptions" : ${getUserInfo && getUserInfo['dropMediaCaptions'] ? getUserInfo['dropMediaCaptions'] : false},
    "isAccesable"       : ${getUserInfo && getUserInfo['isAccesable'] ? getUserInfo['isAccesable'] : false},
    "noforwards"        : ${getUserInfo && getUserInfo['noforwards'] ? getUserInfo['noforwards'] : false},
    "duration"          : ${getUserInfo && getUserInfo['duration'] ? getUserInfo['duration'] : false},
    "button"            : ${getUserInfo && getUserInfo['button'] ? JSON.stringify(getUserInfo['button']) : false}
}</code></pre>
:: data ::

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
                    if ( key == "setPassword" )
                        data += `${value ? `<i>🔐 ${key}</i> : <spoiler>${value}</spoiler>` : ''}`;
                    else if ( key == "duration" )
                        data += `${value ? `<i>⏳ ${key} : ${value}</i>` : ''}`;
                    else 
                        data += `${value ? `<i>🟢 ${key}</i>` : ''}`;
                    data += " | "
                }
                data = data.slice(0, -3);

                translated = await translate({
                    text: !(getUserInfo && getUserInfo['setPassword'])
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
                    logger.log('error', `${file_name}: generate.js : ${update.message.chatId} : ${error}`);
                    await sleep(error.seconds);
                } else {
                    logger.log('error', `${file_name}: generate.js : ${update.message.chatId} : ${error}`);
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
