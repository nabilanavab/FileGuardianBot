

const { Button } = require("telegram/tl/custom/button");
const logger = require("../../logger");


module.exports = function(client){
    client.addEventHandler((update) => {
        if (update && update.message && update.message.message && 
                        update.message.message.startsWith("/start")){
            
            logger.log('info', `${update.message.message.chatId}: bot started`)
            const markup = client.buildReplyMarkup(Button.inline("Start")); 
            client.sendMessage(update.message.chatId, {
                message: "Welcome to my Telegram bot!",
                buttons: markup,
                // replyMarkup: 
            });
            return 0;
        }
    });
}