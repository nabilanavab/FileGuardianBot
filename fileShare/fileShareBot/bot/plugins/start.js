

const logger = require("../../logger");
const getLang = require("../i18n/utils");
const translate = require("../i18n/t9n");
var { errors } = require("telegram/errors");
var { CHANNEL_INFO } = require("../../config")


module.exports = async function(client){
    client.addEventHandler(async (update) => {
        if (update && update.message && update.message.message && 
                        update.message.message.toLowerCase().startsWith("/start")){

            logger.log('info', `user ${update.message.chatId} started bot`)
            try {
                let lang_code = await getLang(update.message.chatId);
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

