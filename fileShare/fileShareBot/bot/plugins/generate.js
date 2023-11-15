


let logger = require("../../logger");
const {isBatchUser} = require("./localDB/batchData")


module.exports = async function(client){
    client.addEventHandler(async (update) => {
        if (update && update.message &&
                update.message.peerId.className === 'PeerUser' &&
                    !isBatchUser(update.message.chatId.value)){

            logger.log('info', `user ${update.message.chatId} generating new link..`)
            try {
                console.log(update);
            } catch (error) {
                // this is just a comment 
            }
            }
        }
    )
}
