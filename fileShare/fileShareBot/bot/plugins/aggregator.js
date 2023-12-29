
/**
 *
 * This code snippet is part of the FileShareBot by @nabilanavab.
 * It is intended for educational and non-commercial use.
 * The project was developed for personal enjoyment and experimentation.
 * If you encounter any bugs or issues, we encourage you to contribute by
 * making a pull request. [ All contributions are highly appreciated ]
 *
 * @version 1.0.0
 * @author NabilANavab
 * @copyright 2023 ©️ nabilanavab
 * 
 */

const file_name = __dirname
const author = "@nabilanavab"


const { batchDB, isBatchUser, insertDataById } = require("./localDB/batchData");
const logger = require("../../logger");

// Check if the user in batching files
module.exports = async function (client) {
    client.addEventHandler(async (update) => {
        if (
            update && update.message && update.message &&
            update.message.peerId.className === 'PeerUser' &&
            isBatchUser(update.message.chatId.value)
        ) {
            try {
                const item = batchDB.find(item => item.id === update.message.chatId.value);

                if ( item.type === "@batchMessage") {

                } else if ( item.type === "@batchChannel" ){
                    // public channel, 
                }
                 
                insertDataById(update.message.chatId.value, update.message.id)
                console.log(batchDB)
            } catch (error) {
                logger.log('error', `start.js :: ${file_name} : ${update.message.chatId} : ${error}`);
            }
        }
    });
}