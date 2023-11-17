


let logger = require("../../logger");
require("../i18n/utils").getLang;
require("../i18n/t9n").translate;
require("telegram/errors").errors;
require("../i18n/edtB10").editDict;
const {isBatch, isBatchUser} = require("./localDB/batchData")


module.exports = async function(client){
    client.addEventHandler(async (update) => {
        if (update && update.message && update.message.message &&
            update.message.peerId.className === 'PeerUser' &&
                    update.message.message.toLowerCase().startsWith("/batch")){
            
            logger.log('info', `user ${update.message.chatId} started batching`)
            try {
                let lang_code = await getLang(update.message.chatId);
                if (!isBatchUser(update.message.chatId.value)) {
                    isBatch.push(
                        { "id" : update.message.chatId.value }
                    );
                    let translated = await translate({
                        text: "batch.new",
                        langCode: lang_code
                    });
                    await client.sendMessage(
                        update.message.chatId, {
                            message: translated.text,
                            replyTo: update.message.id
                        }
                    );
                } else {
                    let translated = await translate({
                        text: "batch.current",
                        langCode: lang_code
                    });
                    await client.sendMessage(
                        update.message.chatId, {
                            message: translated.text,
                            replyTo: update.message.id
                        }
                    );
                }
                return 0;
            } catch (error) {
                if (error instanceof errors.FloodWaitError) {
                    logger.log(
                        "error", `Error ${error.errorMessage} in ?batch: ${error.seconds}`
                    );
                    setTimeout(
                        module.exports(client), error.seconds
                    )
                } else {
                    logger.log("error", `Error in ?batch: ${error}`);
                }
            }
        }
    }
)}

