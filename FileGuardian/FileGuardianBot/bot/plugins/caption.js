
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

const { extrasDbFunctions } = require("../monGo/extras");
const { DATABASE } = require("../../config");
const { generateInfo } = require("./localDB/generData");
const logger = require("../../logger");

/**
 * Event handler /addCaption in a private chat.
 *
 * @param {TelegramBot} client - The Telegram bot instance.
 * @returns {Promise<void>}    - A Promise that resolves when the event handling is completed.
 */

async function addCaption(client) {
    client.addEventHandler(async (update) => {
        if ( update?.message?.peerId?.className === 'PeerUser' && !update?.message?.out &&
            update?.message?.message?.startsWith("/addCaption")
        ) {
            try {
                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                let caption = update.message.message.replace('/addCaption ', '').substring(0, 200);

                if (caption !== "/addCaption"){
                    if ( DATABASE.MONGODB_URI ) {
                        await extrasDbFunctions.changeData({
                            userID: update.message.chatId,
                            key: "caption",
                            value: caption
                        })
                    }
                    if ( !generateInfo?.[update.message.chatId]?.['caption'] ){
                        generateInfo[update.message.chatId] = {}
                        generateInfo[update.message.chatId][caption] = caption;
                    }
                    translated = await translate({
                        text: "capButton.addedCap",
                        button: "settings.close",
                        langCode: lang_code
                    })
                    return await client.sendMessage(
                        update.message.chatId, {
                            message: translated.text + caption,
                            buttons: translated.button,
                            replyTo: update.message
                        }
                    )
                } else {
                    translated = await translate({
                        text: "capButton.checkSyntax",
                        button: "settings.close"
                    })
                    return await client.sendMessage(
                        update.message.chatId, {
                            message: translated.text,
                            buttons: translated.button,
                            replyTo: update.message
                        }
                    )
                }
            } catch (error) {
                logger.log('error', `${file_name} : ${update.message.chatId} : ${error}`);
            }
        }
    })
}

async function deleteCaption(client) {
    client.addEventHandler(async (update) => {
        if ( update?.message?.peerId?.className === 'PeerUser' && !update?.message?.out &&
            update?.message?.message?.startsWith("/deleteCaption")
        ) {
            try {
                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                if (generateInfo?.[update.message.chatId]?.['caption']){
                    delete generateInfo[update.message.chatId]['caption'];
                }
                if ( DATABASE.MONGODB_URI ) {
                    await extrasDbFunctions.changeData({
                        userID: update.message.chatId,
                        key: "caption",
                        deleteIt: true
                    })
                }
                translated = await translate({
                    text: "capButton.deletedCap",
                    button: "settings.close",
                    langCode: lang_code
                })
                return await client.sendMessage(
                    update.message.chatId, {
                        message: translated.text,
                        buttons: translated.button,
                        replyTo: update.message
                    }
                ) 
            } catch (error) {
                logger.log('error', `${file_name} : ${update.message.chatId} : ${error}`);
            }
        }
    })
}

async function viewCaption(client) {
    client.addEventHandler(async (update) => {
        if ( update?.message?.peerId?.className === 'PeerUser' && !update?.message?.out &&
            update?.message?.message?.startsWith("/viewCaption")
        ) {
            try {
                let caption = "none";
                if (generateInfo?.[update.message.chatId]?.['caption']){
                    caption = generateInfo[update.message.chatId]['caption']
                }
                return await client.sendMessage(
                    update.message.chatId, {
                        message: caption,
                        replyTo: update.message
                    }
                ) 
            } catch (error) {
                logger.log('error', `${file_name} : ${update.message.chatId} : ${error}`);
            }
        }
    })
}

async function captButton(client) {
    await addCaption(client);
    await viewCaption(client);
    await deleteCaption(client);
}

module.exports = captButton;


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
 **/