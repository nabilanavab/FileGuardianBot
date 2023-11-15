


let logger = require("../../logger");
require("../i18n/utils").getLang;
require("../i18n/t9n").translate;
require("telegram/errors").errors;
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
            } catch {
                logger.log("error", `Error in ?batch: ${error}`);
            }
        }
    }
)}

