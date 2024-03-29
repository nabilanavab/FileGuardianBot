

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

const file_name = __dirname + __filename
const author = "@nabilanavab"

let logger = require("../../logger");
const { CHANNEL_INFO } = require("../../config");
const REQUESTED_USERS = require("./localDB/request");
const { coreDbFunctions } = require("../monGo/core");
const { DATABASE } = require("../../config");
const { extrasDbFunctions } = require("../monGo/extras");
const approveChatJoinRequest = require("./util/acceptUser");

/**
 * Event handler to process chat invite requester updates for the bot's force subscription channel.
 *
 * @param {TelegramBot} client - The Telegram bot instance.
 * @returns {Promise<void>} - A Promise that resolves when the event handling is completed.
 */

module.exports = async function (client) {
    client.addEventHandler(async (update) => {
        if ( 
            update &&
            update.className === "UpdateBotChatInviteRequester" &&
           "-100" + update.peer.channelId.value == CHANNEL_INFO.FORCE_SUB
        ) {
            try {
                if ( !CHANNEL_INFO.AUTO_APPROVE ){

                    if (!REQUESTED_USERS.includes(update.userId.value)) {
                        REQUESTED_USERS.push(update.userId.value);
                    }

                    if( DATABASE.MONGODB_URI ){
                        newuser = await coreDbFunctions.isUserExist({
                            userID: update.userId.value,
                            elseAdd: {
                                // "name" : username, slly many cany be added
                                // check isUserExist only (only minor update needed)
                                "requested": true
                            }
                        });
                        if (newuser != "newuser"){
                            await extrasDbFunctions.changeData({
                                userID: update.userId.value,
                                key: "requested",
                                value: true
                            });
                        }
                    }

                } else {
                    try {
                        await approveChatJoinRequest(update.userId.value);
                    } catch (error) {
                        
                        if (!REQUESTED_USERS.includes(update.userId.value)) {
                            REQUESTED_USERS.push(update.userId.value);
                        }

                        if( DATABASE.MONGODB_URI ){
                            newuser = await coreDbFunctions.isUserExist({
                                userID: update.userId.value,
                                elseAdd: {
                                    // "name" : username, slly many cany be added
                                    // check isUserExist only (only minor update needed)
                                    "requested": true
                                }
                            });
                            if (newuser != "newuser"){
                                await extrasDbFunctions.changeData({
                                    userID: update.userId.value,
                                    key: "requested",
                                    value: true
                                });
                            };
                        }
                    }
                }
            } catch (error) {
                logger.log('error', `${file_name} : request.js : ${update.userId.value} : ${error}`);
            }
        }
    })
}


/**
 * 
 * @license
 * FileShareBot is open-source software distributed under the MIT License.
 * Please see the LICENSE: file for more details.
 *
 * @repository
 * You can find the source code of this bot and contribute on GitHub: 
 * https://github.com/nabilanavab/filesharebot
 *
 * @author
 * Created with ❤️ by Your Name - Feel free to reach out for questions,
 * bug reports, or collaboration.
 * 
 *                                 Contact: https://telegram.me/nabilanavab
 * 
 */