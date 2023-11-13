

const { Button } = require("telegram/tl/custom/button");
const logger = require("../../logger");
const getLang = require("../i18n/utils");
const translate = require("../i18n/t9n");
const { buttons } = require("telegram/client");
var { errors } = require("telegram");


module.exports = async function(client){
    client.addEventHandler(async (update) => {
        if (update && update.message && update.message.message && 
                        update.message.message.startsWith("/start")){
            
            try {
                let lang_code = await getLang(update.message.chatId);
                let translated = await translate({
                    text: 'start.message',
                    button: 'start.button.withChannel',
                    langCode: lang_code,
                });
                console.log(translated.button);
                client.sendMessage(update.message.chatId, {
                    message: translated.text,
                    buttons: client.buildReplyMarkup(
                        translated.button
                    ),
                });
                return 0;
            } catch (error) {
                if (error instanceof errors.FloodWaitError) {
                    // Handle FloodWaitError
                    // module.exports(client);
                }
            }
        }
    });
}