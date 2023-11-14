

let logger = require("../../logger");
const { DATABASE } = require("../../config");
var { CHANNEL_INFO } = require("../../config");
const { coreDbFunctions } = require("../monGo/core");


module.exports = async function(client){
    client.addEventHandler(async (update) => {
        if (update && update.message && update.message.message &&
                    update.message.message.toLowerCase().startsWith("/start")){

            logger.log('info', `user ${update.message.chatId} started bot`)
            try {
                let lang_code = await getLang(update.message.chatId);
                if (DATABASE.MONGODB_URI) {
                    let userData = await coreDbFunctions.isUserExist({
                        userID : update.message.chatId.value,
                        elseAdd : {
                            // "name" : username, slly many cany be added
                            // check isUserExist only (only minor update needed)
                            "lang" : lang_code
                        }
                    });
                }
                let translated = await translate({
                    text: 'start.message',
                    button: CHANNEL_INFO.FORCE_SUB
                        ? 'start.button.withChannel'
                        : 'start.button.withOutChannel',
                    langCode: lang_code,
                    order: CHANNEL_INFO.FORCE_SUB
                        ? "221" : "211", 
                });

                if (!CHANNEL_INFO.WELCOME_PIC){
                    await client.sendMessage(update.message.chatId, {
                        message: translated.text,
                        buttons: client.buildReplyMarkup(
                            translated.button
                        ),
                    });
                } else {
                    await client.sendMessage(update.message.chatId, {
                        message: translated.text,
                        file: CHANNEL_INFO.WELCOME_PIC,
                        buttons: client.buildReplyMarkup(
                            translated.button
                        ),
                    })
                }
                return 0;
            } catch (error) {
                console.log(error);
                // just for edu. purpose not needed in /start
                if (error instanceof errors.FloodWaitError) {
                    logger.log(
                        "error", `Error ${error.errorMessage} in ?start: ${error.seconds}`
                    );
                    setTimeout(
                        module.exports(client), error.seconds
                    )
                } else {
                    logger.log("error", `Error in ?start: ${error}`);
                }
            }
        }
    });
}

