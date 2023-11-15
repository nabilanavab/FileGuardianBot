

let logger = require("../../logger");
const settings = require("./callBack/settings")
const help = require("./callBack/help")

module.exports = async function(client){
    client.addEventHandler(async (update) => {
        if (update  && update.className == "UpdateBotCallbackQuery"){
            try {
                let data = Buffer.from(update.data).toString('utf8');
                
                if (data.startsWith("settings")) {
                    return settings.settingsHandler(update);
                } else if (data.startsWith("help")) {
                    return help.helpHandler(update);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
)}