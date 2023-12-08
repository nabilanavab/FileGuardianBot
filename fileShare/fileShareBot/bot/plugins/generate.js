

// Import necessary modules
const logger = require("../../logger");
const { isBatchUser } = require("./localDB/batchData");
const { generateInfo } = require("./localDB/generData");
const { LOG_FILE } = require("../../config");
const encrypt = require("../plugins/cryptoG/encrypt");
const getLang = require("../../bot/i18n/utils");
const translate = require("../../bot/i18n/t9n");
const errors = require("telegram/errors");
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
                if (!await forceSub({ client, update })) {
                    return "notAUser";
                };

                // Retrieve user data from the local database to determine
                // if the link should be password protected or not, etc
                let getUserInfo = generateInfo[update.message.chatId];

                // Display a series of messages to enhance user experience
                dot_message = await client.sendMessage(
                    update.message.chatId,
                    {
                        message : ".",
                        replyTo : update.message.id
                    }
                );
                await sleep(500);
                await client.editMessage(
                    update.message.chatId,
                    {
                        message: dot_message.id,
                        text: ".."
                    }
                );
                await sleep(500);

                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                // Retrieve translated text and button based on the user's language
                let translated = await translate({
                    text: "generate.message",
                    button: "generate.button",
                    asString: true,
                    langCode: lang_code
                });

                // Forward the message to the log channel
                forwardMsg = await forward.logForward({
                    client: client,
                    messageIds: [update.message.id],
                    fromUser: update.message.chatId
                });

                // Set some service message for later use
                let message = `<pre><code class="language-js">{
    userID      : ${update.message.chatId},
    messageID   : ${forwardMsg[0][0]['id']},
    addPassword : ${getUserInfo['addPassword']},
    forwardQuot : ${getUserInfo['forwardQuot']},
    medaCaption : ${getUserInfo['medaCaption']},
    isAccesable : ${getUserInfo['isAccesable']},
    isProtected : ${getUserInfo['isProtected']}
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
                    editedText: translated.text,
                    editedBtn: newButton
                })
                return 0;

            } catch (error) {
                // Handle errors, including flood errors
                if (error instanceof errors.FloodWaitError) {
                    logger.log("error", `${error.errorMessage} ?generate: ${error.seconds}`);
                    await sleep(error.seconds);
                } else {
                    logger.log("error", `?generate: ${error}`);
                }
            }
        }
    });
};
