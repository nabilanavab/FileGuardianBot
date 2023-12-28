
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

const database = require("./database");
const scheduleAt = require("../plugins/scheduler/scheduleAt");

async function scheduleDB( client ) {
    try {
        let result = await this.client.db(this.databaseName)
            .collection(this.scheduler)
            .find({ targetTime: { $exists: true } })
            .toArray();

        for ( const time of result ){
            await scheduleAt({
                targetTime: result.targetTime,      // time at which its get deleted
                client: client,                     // bot instance
                messageID: result.messageID,        // id of message to be deleted
                chatID: result.chatID,              // chat id where the message exists
            })
        }
    } catch ( error ) {
        
    }
}

module.exports = scheduleDB;


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