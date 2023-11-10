
const client = require("./bot/bot")

client.addEventHandler(async (update) => {
    const chatID = Number(update.message.chatID);
     
    if (update.message.message.startsWith("/start")) {
      client.sendMessage(chatID, {
       message: "Welcome to my Telegram bot!",
     }); 
    }
 });