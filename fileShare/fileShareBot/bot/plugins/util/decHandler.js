
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
const { LOG_FILE } = require("../../../config");
const editDict = require("../../i18n/edtB10");
const logger = require("../../../logger");

async function decryptHandler({ client, messageID, userID, code, replyTo, massForward }) {
    try{
        let data = await client.invoke(
            new Api.channels.GetMessages({
                channel: LOG_FILE.LOG_CHANNEL,
                id: [Number(messageID)]
            })
        )
        
        jsonString = data['messages'][0]['message'].split("\n\n")[0];
        const jsonData = JSON.parse(`${jsonString}`);
        
        if (jsonData['setPassword']){
            let lang_code = await getLang(userID);

            let translated = await translate({
                text : 'settings.askPassword',
                button : 'settings.askPswdButon',
                asString : true,
                langCode : lang_code
            })

            let newButton = await editDict({
                inDict : translated.button,
                value : Number(messageID)
            })

            return await client.sendMessage(
                userID, {
                    message: translated.text,
                    buttons: client.buildReplyMarkup(
                        await createButton({
                            button : newButton
                        })
                    ),
                    parseMode: "html",
                    replyTo: replyTo
                }
            )
        }

        if ( jsonData['isAccesable'] ){
            let lang_code = await getLang(userID);

            let translated = await translate({
                text : 'settings.noAccess',
                button : 'settings.noAccessBtn',
                asString : true,
                langCode : lang_code
            })
            let newButton = await editDict({
                inDict : translated.button,
                value : `https://telegram.dog/${botInfo.username}?start=${code}`
            })
            return await client.sendMessage(
                userID, {
                    message: translated.text,
                    buttons: client.buildReplyMarkup(
                        await createButton({
                            button : newButton
                        })
                    ),
                    parseMode: "html",
                    replyTo: replyTo
                }
            ) 
        }

        await userForward({
            client: client,
            messageIds: [ data['messages'][0]['replyTo']['replyToMsgId'] ],
            toUser: userID,
            dropAuthor: jsonData['dropAuthor'] ? true : false,
            dropMediaCaptions: jsonData['dropMediaCaptions'] ? true : false,
            noforwards : jsonData['noforwards'] ? true : false,
            duration: jsonData['duration'] ? jsonData['duration'] : false,
            replyTo: replyTo,
            massForward: massForward
        })
        return true

    } catch ( error ){

        logger.log('error', `${file_name}: ${userID} : ${error}`);
        return false;
    
    }
}

module.exports = decryptHandler;

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