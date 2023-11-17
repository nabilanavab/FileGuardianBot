

var { errors } = require("telegram");
const logger = require("../../logger");
const {isBatchUser} = require("./localDB/batchData");
const { generateInfo } = require("./localDB/generData");
const { LOG_FILE } = require("../../config");
const encrypt = require("../plugins/cryptoG/encrypt");
const editDict = require("../i18n/edtB10");


module.exports = async function(client){
    client.addEventHandler(async (update) => {
        if (update && update.message && !( update.message.message && 
                (update.message.message.toLowerCase().startsWith("/start") ||
                 update.message.message.toLowerCase().startsWith("/batch"))) &&
                    update.message.peerId.className === 'PeerUser' &&
                        !isBatchUser(update.message.chatId.value)){

            logger.log('info', `user ${update.message.chatId} generating new link..`)
            try {
                let getUserInfo = generateInfo[update.message.chatId];
                dot_message = await client.sendMessage(update.message.chatId, {
                    message : "."
                })
                await sleep(1000);
                await client.editMessage(update.message.chatId, {
                    message : dot_message.id,
                    text : ".."
                })
                await sleep(1000);
                let lang_code = await getLang(update.message.chatId);
                let translated = await translate({
                    text: "generate.message",
                    button: "generate.button",
                    asString : true,
                    langCode: lang_code
                });
                if (unicornMagicNumber) {
                    forwardMsg = await client.forwardMessages(
                        LOG_FILE.LOG_CHANNEL, {
                            messages : update.message.id,
                            dropAuthor : true,
                            noforwards: true,
                        }
                    )
                    messageInfo = `${forwardMsg[0].id}`
                } else {
                    messageInfo = `${update.message.id}|${update.message.chatId.value}`
                }
                code = await encrypt(messageInfo);

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
