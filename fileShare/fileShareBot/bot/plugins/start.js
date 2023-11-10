

const {Api} = require("telegram");

module.exports = function(client){
    client.addEventHandler((update) => {
            const chatID = Number(update.message.chatID);
            if (update.message.message.startsWith("/start")) {
                client.sendMessage(chatID, {
                    message: "Welcome to my Telegram bot!",
                });
            }
        }
    );
}

