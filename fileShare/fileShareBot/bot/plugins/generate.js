

const logger = require("../../logger");
const {isBatchUser} = require("./localDB/batchData");
const { generateInfo } = require("./localDB/generData");
const { LOG_FILE } = require("../../config");
const encrypt = require("../plugins/cryptoG/encrypt");
const getLang = require("../../bot/i18n/utils");
const translate = require("../../bot/i18n/t9n");
const errors = require("telegram/errors");
const editDict = require("../../bot/i18n/edtB10");
const { forceSub } = require("./helpers/forceSub");


module.exports = async function(client){
    client.addEventHandler(async (update) => {
        if (
            // All messages, except /start or /batch, will be considered as a request &
            // It will automatically generate a URL for that message

            update && update.message && !( update.message.message && 
                (update.message.message.toLowerCase().startsWith("/start") ||
                 update.message.message.toLowerCase().startsWith("/batch"))) &&
                    update.message.peerId.className === 'PeerUser' &&
                        !isBatchUser(update.message.chatId.value)
        ){

            logger.log('info', `user ${update.message.chatId} generating new link..`)
            try {
                // Check for force subscription: If the user is required to subscribe forcefully
                if (!await forceSub({ client, update })) {
                    return "notAUser";
                };

                // Retrieve user data from the local database to determine
                // if the link should be password protected or not, etc
                let getUserInfo = generateInfo[update.message.chatId];

                // Note: As the creator of this project, 'nabilanavab,' is highly interested
                // in enhancing user experience, consider this aspect in implementation.
                // [ useless in practice ]
                dot_message = await client.sendMessage(
                    update.message.chatId, {
                    message : "."
                })
                await sleep(500);
                await client.editMessage(
                    update.message.chatId, {
                    message : dot_message.id,
                    text : ".."
                })
                await sleep(500);

                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);
                
                // Retrieve translated text and button based on the user's language
                let translated = await translate({
                    text: "generate.message",
                    button: "generate.button",
                    asString : true,
                    langCode: lang_code
                });
                
                // Forward the message to the log channel
                forwardMsg = await client.forwardMessages(
                    LOG_FILE.LOG_CHANNEL,
                    {
                        messages : update.message.id,
                        fromPeer : update.message.chatId,
                        // noforwards: true,
                    }
                )

                console.log(forwardMsg[0][0]['id']);
                // Set some service message for later use
                replyMessage = await client.sendMessage(
                    LOG_FILE.LOG_CHANNEL,
                    {
                        message: 'hey tyhere',
                        replyTo: forwardMsg[0][0]['id']
                    }
                )
                messageInfo = `:${replyMessage[0][0]['id']}`

                code = await encrypt({
                    text: messageInfo,
                    userID: update.message.chatId.value
                });

                let newButton = await editDict({
                    inDict : translated.button,
                    value : `https://telegram.dog/${botInfo.username}?start=${code}`
                })
                newButton = await createButton({
                    button : newButton, order : '11'
                })

                await client.editMessage(update.message.chatId, {
                    message: dot_message.id,
                    text: translated.text,
                    buttons: client.buildReplyMarkup(
                        newButton
                    ),
                    replyTo : update.message.id
                });

            } catch (error) {
                if (error instanceof errors.FloodWaitError) {
                    logger.log(
                        "error", `${error.errorMessage} ?generate: ${error.seconds}`
                    );
                    setTimeout(
                        module.exports(client), error.seconds
                    )
                } else {
                    logger.log("error", `?generate: ${error}`);
                }
            }
        }
    }
)}
