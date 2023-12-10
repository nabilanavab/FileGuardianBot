
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

const { Api } = require("telegram");
const { userForward } = require("../helpers/forward");
const { LOG_FILE } = require("../../../config")

async function decryptSingle({client, code, userID}) {
    try{
        let data = await client.invoke(
            new Api.channels.GetMessages({
                channel: LOG_FILE.LOG_CHANNEL,
                id: [Number(code)]
            })
        )
        
        let jsonData = JSON.parse(
            data['messages'][0]['message'].split("\n\n")[0]
        )
        
        if (jsonData['setPassword']){
            // ask for password
            console.log("ask for password.. ");
        }

        await userForward({
            client: client,
            messageIds: [ data['messages'][0]['replyTo']['replyToMsgId'] ],
            toUser: userID,
            dropAuthor: jsonData['dropAuthor'] ? true : false,
            dropMediaCaptions: jsonData['dropMediaCaptions'] ? true : false,
            noforwards : jsonData['noforwards'] ? true : false
        })
        return true

    } catch ( error ){

        console.log(error);
        return false
    
    }
}

module.exports = decryptSingle;

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