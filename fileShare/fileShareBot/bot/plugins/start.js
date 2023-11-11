

const { Button } = require("telegram/tl/custom/button");
const sendMessage = require("../handler")

module.exports = function(client){
    client.addEventHandler((update) => {
        if (update && update.message && update.message.message && 
                        update.message.message.startsWith("/start")){
            
            sendMessage(
                client=client, chatId=update.message.chatId,
                message=`${update.message.message}`,
            );
        }
    });
}