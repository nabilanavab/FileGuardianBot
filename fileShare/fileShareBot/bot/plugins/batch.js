


let logger = require("../../logger");
const getLang = require("../../bot/i18n/utils");
const translate = require("../../bot/i18n/t9n");
const errors = require("telegram/errors");
const editDict = require("../../bot/i18n/edtB10");
const {isBatch, isBatchUser} = require("./localDB/batchData");
const { forceSub } = require("./helpers/forceSub");


module.exports = async function(client){
    client.addEventHandler(async (update) => {
        if (
            // Check if the user sent a /batch (in a private chat)
            update && update.message && update.message.message &&
                update.message.peerId.className === 'PeerUser' &&
                    update.message.message.toLowerCase().startsWith("/batch")
        ){
            
            logger.log('info', `user ${update.message.chatId} started batching`)
            try {
                // Check for force subscription: If the user is required to subscribe forcefully
                if (!await forceSub({ client, update })) {
                    return "notAUser";
                };

                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                if (!isBatchUser(update.message.chatId.value)) {
                    // If the user is not currently in the batch process
                    // or workflow, add them to the process
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
                    // If the user is already in the batch process,
                    // Make an Option to remove them from the process
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

