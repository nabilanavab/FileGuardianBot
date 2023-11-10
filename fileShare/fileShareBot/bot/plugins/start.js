

const { Button } = require("telegram/tl/custom/button");

module.exports = function(client){
    client.addEventHandler((update) => {
        if (update && update.message && update.message.message && 
                        update.message.message.startsWith("/start")){
            
            const markup = client.buildReplyMarkup(Button.inline("Start")); 
            client.sendMessage(update.message.chatId, {
                message: "Welcome to my Telegram bot!",
                buttons: markup,
                // replyMarkup: 
            });

        }
    });
}