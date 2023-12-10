
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

const logger = require("../../../logger");
const { Api } = require('telegram');

async function closeCbMessage({ client, update }) {
    try {

        await client.invoke(new Api.messages.SetBotCallbackAnswer({
            message: "closing.. ",
            // alert: true,
            queryId: update.queryId
        }));

        let deleteMessage = await client.deleteMessages(
            update.userId, [update.msgId], {}
        )
        return deleteMessage

    } catch ( error ){

        logger.log(`${file_name}: ${update.userId} : ${error.message}`);
        return fasle

    }
}

module.exports = closeCbMessage;

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