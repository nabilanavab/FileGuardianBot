

require("../../logger").logger;
require("../i18n/utils").getLang;
require("../i18n/t9n").translate;
require("telegram/errors").errors;
require("../../config").CHANNEL_INFO;
// require("./localDB/batchData").checkUserExists;

module.exports = async function(client){
    client.addEventHandler(async (update) => {
        if (update && update.message && update.message.message &&
                    update.message.message.toLowerCase().startsWith("/batch")){
            
            // if (!checkUserExists(update.message.chatId.value)){

            // }
            






                    }
                }
    )
            }

