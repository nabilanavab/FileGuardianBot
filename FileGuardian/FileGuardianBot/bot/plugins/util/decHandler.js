
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

const { Api } = require("telegram");
const { userForward } = require("../helpers/forward");
const { LOG_FILE } = require("../../../config");
const editDict = require("../../i18n/edtB10");
const logger = require("../../../logger");


/**
 * Decrypts a message and handles various scenarios, such as setting a password,
 * granting or denying access, and forwarding messages to the user.
 *
 * @param {Object} params               - The parameters object.
 * @param {TelegramBot} params.client   - The Telegram bot instance.
 * @param {number} params.messageID     - The ID of the message to decrypt.
 * @param {number} params.userID        - The ID of the user to whom the decrypted message will be sent.
 * @param {string} params.code          - The decryption code.
 * @param {number} params.replyTo       - The ID of the message to reply to.
 * @param {boolean} params.massForward  - Indicates whether to perform a mass forward.
 * @returns {Promise<boolean>}          - A Promise that resolves to true if the decryption and handling are successful, false otherwise.
 * @throws {Error}                      - Throws an error if an exception occurs during the decryption and handling process.
 */

async function decryptHandler({ client, messageID, userID, code, replyTo, massForward }) {
    try{
        let data = await client.invoke(
            new Api.channels.GetMessages({
                channel: LOG_FILE.LOG_CHANNEL,
                id: [Number(messageID)]
            })
        )
        
        let jsonString = data['messages'][0]['message'].split(":: data ::")[1];
        let caption = data['messages'][0]['message'].split(":: data ::")[0];
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

        const messageIds = !massForward ?
            [ data['messages'][0]['replyTo']['replyToMsgId'] ] : 
            jsonData['batchInfo']['userData']
        
        let replyMarkup = false
        if (jsonData['button']){
            replyMarkup = await createButton({
                button: jsonData['button']
            })
        }

        await userForward({
            client: client,
            messageIds: messageIds,
            toUser: userID,
            dropAuthor: jsonData['dropAuthor'] ? true : false,
            dropMediaCaptions: jsonData['dropMediaCaptions'] ? true : false,
            noforwards : jsonData['noforwards'] ? true : false,
            duration: jsonData['duration'] ? jsonData['duration'] : false,
            replyTo: replyTo,
            massForward: !massForward ? false :
                [
                    jsonData['batchInfo']['forwardFrom'] == "id" ?
                        jsonData['userID'] : Number(jsonData['batchInfo']['forwardFrom']),
                    jsonData['batchInfo']['type']
                ],
            caption: caption != "" ? caption : false,
            replyMarkup: replyMarkup ? replyMarkup: false
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