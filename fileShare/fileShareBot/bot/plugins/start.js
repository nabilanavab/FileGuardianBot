

const { Button } = require("telegram/tl/custom/button");
const logger = require("../../logger");


module.exports = function(client){
    client.addEventHandler((update) => {
        if (update && update.message && update.message.message && 
                        update.message.message.startsWith("/start")){
            
            logger.log('info', `${__dirname} : ${update.message.message.chatId}`)
            try {
                client.sendMessage(update.message.chatId, {
                    message: "Welcome to my Telegram bot!",
                    buttons: client.buildReplyMarkup(Button.inline("Start")),
                });
                return 0;
            } catch (error) {
                logger.log('error', `${__dirname} : ${error}`)
                this.function(client);
            }

        }
    });
}