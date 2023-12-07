

let logger = require("../../logger");
const { DATABASE } = require("../../config");
const { CHANNEL_INFO } = require("../../config");
const { coreDbFunctions } = require("../monGo/core");
const { errors } = require("telegram/errors");
const { forceSub } = require("./helpers/forceSub");
const getLang = require("../i18n/utils");
const translate = require("../i18n/t9n");
const editDict = require("../i18n/edtB10");
const decrypt = require("./cryptoG/decrypt");


module.exports = async function(client){
    client.addEventHandler(async (update) => {
        if (update && update.message && update.message.message &&
                update.message.peerId.className === 'PeerUser' &&
                    update.message.message.toLowerCase().startsWith("/start")){

            logger.log('info', `user ${update.message.chatId} started bot`)
            try {

                // Check for force subscription: If the user is required to subscribe forcefully
                if (!await forceSub({ client, update })) {
                    return "notAUser";
                };

                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                // Add a new user to the database
                if (DATABASE.MONGODB_URI) {
                    await coreDbFunctions.isUserExist({
                        userID : update.message.chatId.value,
                        elseAdd : {
                            // "name" : username, slly many cany be added
                            // check isUserExist only (only minor update needed)
                            "lang" : lang_code
                        }
                    });
                }

                // Check if there is a start message from the user
                // If available, retrieve the code; otherwise, send a welcome message
                let haveCode = update.message.message.replace('/start ', '');
                if ( haveCode !== '/start' ) {
                    await decrypt({
                        code: haveCode,
                        userID: update.message.chatId
                    });
                    return "sendAllFiles";
                }

                // Retrieve translated text and button based on the user's language
                let translated = await translate({
                    text: 'start.message',
                    button: CHANNEL_INFO.FORCE_SUB
                    ? 'start.button.withChannel'
                    : 'start.button.withOutChannel',
                    langCode: lang_code,
                    order: CHANNEL_INFO.FORCE_SUB
                        ? "221" : "211", 
                });

                // If the user is a developer, include a welcome picture;
                // otherwise, send a text message
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
    })
}

