
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

const decrypt = require("../cryptoG/decrypt");
const decHandler = require("./decHandler");

async function checkDecCode({client, code, userID, replyTo}) {
    try {
        messageID = await decrypt({
            code: code, userID: userID
        });

        await decHandler({
            client: client, messageID: messageID.replace("batch:", ""),
            userID: userID, code: code, replyTo: replyTo 
        })
        return true

    } catch ( error ){
        let lang_code = await getLang(userID);
        let translated = await translate({
            text : 'settings.errorLink',
            button : 'settings.closeCB',
            langCode : lang_code,
            order: 1
        })

        await client.sendMessage(
            userID, {
                message: translated.text,
                buttons: translated.button,
                replyTo: replyTo
            }
        )
        return "💩" 
    }
}

module.exports = checkDecCode;

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