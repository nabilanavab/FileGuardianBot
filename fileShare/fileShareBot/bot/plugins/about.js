

const { Button } = require("telegram/tl/custom/button");
const logger = require("../../logger");


module.exports = function(client){
    client.addEventHandler((update) => {
        if (update && update.message && update.message.message && 
                        update.message.message.toLowerCase() == "/about"){
            
            client.sendMessage(update.message.chatId, {
                message: "About this Telegram bot!",
                buttons: client.buildReplyMarkup([[
                    Button.url("button", "t.me/nabilanavab"),
                    Button.url("hey", "t.me/nabilanavab")
                ],[
                    Button.url("button", "t.me/nabilanavab"),
                    Button.url("hey", "t.me/nabilanavab")
                ]]
                ),
            });

        }
    });
}