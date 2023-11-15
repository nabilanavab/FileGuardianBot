


let logger = require("../../logger");
const {isBatchUser} = require("./localDB/batchData")


module.exports = async function(client){
    client.addEventHandler(async (update) => {
        if (update && update.message && !( update.message.message && 
                (update.message.message.toLowerCase().startsWith("/start") ||
                 update.message.message.toLowerCase().startsWith("/batch"))) &&
                    update.message.peerId.className === 'PeerUser' &&
                        !isBatchUser(update.message.chatId.value)){

            logger.log('info', `user ${update.message.chatId} generating new link..`)
            try {

                // todo: if user in defGenValue [direct generate url]

                let lang_code = await getLang(update.message.chatId);
                let translated = await translate({
                    text: "generate.message",
                    button: "generate.button",
                    langCode: lang_code,
                    order: 11
                });
                await client.sendMessage(update.message.chatId, {
                    message: translated.text,
                    buttons: client.buildReplyMarkup(
                        translated.button
                    ),
                    replyTo : update.message.id
                });
            } catch (error) {
                if (error instanceof errors.FloodWaitError) {
                    logger.log(
                        "error", `Error ${error.errorMessage} in ?generate: ${error.seconds}`
                    );
                    setTimeout(
                        module.exports(client), error.seconds
                    )
                } else {
                    logger.log("error", `Error in ?generate: ${error}`);
                }
            }
        }
    }
)}
