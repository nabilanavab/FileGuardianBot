
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

const database = require("../monGo/database");

/**
 * This FUnction Helps you to get stat of your bot
 * 
 * @param { TelegramBot } client - your bot instance
 * @returns { Promise<void> }    - A Promise that resolves when the event handling is completed.
 */

module.exports = async function (client) {
    client.addEventHandler(async (update) => {
        if (
            update?.message?.peerId?.className === 'PeerUser' &&
            !update?.message?.out &&
            update?.message?.message?.toLowerCase()?.startsWith("/stat")
        ) {
            try {

                let totalUsers = await database.client.db(database.databaseName).collection(
                    database.userCollection).countDocuments();
                
                await client.sendMessage(
                    update.message.chatId, {
                        message: `total users : ${totalUsers}`
                    }
                )
            } catch (error) {
                
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
