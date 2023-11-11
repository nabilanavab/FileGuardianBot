

const { Button } = require("telegram/tl/custom/button");

module.exports = function(client, logger){
    client.addEventHandler((update) => {
        if (update && update.message && update.message.message && 
                        update.message.message.toLowerCase() == "/about"){
            
            client.sendMessage(update.message.chatId, {
                message: "About this Telegram bot!",
                buttons: client.buildReplyMarkup(
                        Button.url("button", "t.me/nabilanavab")
                    ),
            });

        }
    });
}