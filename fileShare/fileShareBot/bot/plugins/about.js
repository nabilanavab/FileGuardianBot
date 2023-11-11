

const { Button } = require("telegram/tl/custom/button");

module.exports = function(client){
    client.addEventHandler((update) => {
        if (update && update.message && update.message.message && 
                        update.message.message.toLowerCase() == "/about"){
            
            const markup = client.buildReplyMarkup(Button.inline("about")); 
            client.sendMessage(update.message.chatId, {
                message: "About this Telegram bot!",
                buttons: markup,
                // replyMarkup: 
            });

        }
    });
}