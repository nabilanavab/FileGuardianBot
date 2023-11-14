


let logger = require("../../logger");
require("../i18n/utils").getLang;
require("../i18n/t9n").translate;
require("telegram/errors").errors;
const {isBatch, isBatchUser} = require("./localDB/batchData")

module.exports = async function(client){
    client.addEventHandler(async (update) => {
        if (update && update.message && update.message.message &&
                    update.message.message.toLowerCase().startsWith("/batch")){
            
            logger.log('info', `user ${update.message.chatId} started batching`)
            try {
                if (!isBatchUser(update.message.chatId.value)) {
                    isBatch.push(
                        { "id" : update.message.chatId.value }
                    )
                    await client.sendMessage(
                        update.message.chatId, {
                            message: "creating new batch",
                            replyToMsgId: update.message
                        }
                    );
                } else {
                    await client.sendMessage(
                        update.message.chatId, {
                            message: "currently one batch process is going on",
                            replyToMsgId: update.message
                        }
                    );
                } }catch {
                    logger.log("error", `Error in ?batch: ${error}`);
                }
            }
        }
    )
}

