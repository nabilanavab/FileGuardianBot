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