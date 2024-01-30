
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
 * Asynchronous function to handle the addition of captions based on specific Telegram commands.
 * @param {TelegramClient} client - The Telegram client instance.
 * @returns {Promise<void>}       - A promise that resolves once the caption is added or an error occurs.
 */

async function addCaption(client) {
    client.addEventHandler(async (update) => {
        if (
            update?.message?.peerId?.className === 'PeerUser' &&
            !update?.message?.out &&
            update?.message?.message?.startsWith("/add_caption")
        ) {
            try {
                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                let caption = update.message.message.replace('/add_caption ', '').substring(0, 100);

                if (caption !== "/add_caption"){
                    if ( DATABASE.MONGODB_URI ) {
                        await extrasDbFunctions.changeData({
                            userID: update.message.chatId,
                            key: "caption",
                            value: caption
                        })
                    }

                    generateInfo[update.message.chatId]['caption'] = caption;

                    translated = await translate({
                        text: "capButton.addedCap",
                        button: "settings.closeCB",
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
                        button: "settings.closeCB",
                        langCode: lang_code
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


/**
 * Asynchronous function to handle the deletion of captions based on specific Telegram commands.
 * @param {TelegramClient} client - The Telegram client instance.
 * @returns {Promise<void>}       - A promise that resolves once the caption is deleted or an error occurs.
 */

async function deleteCaption(client) {
    client.addEventHandler(async (update) => {
        if (
            update?.message?.peerId?.className === 'PeerUser' &&
            !update?.message?.out &&
            update?.message?.message?.startsWith("/delete_caption")
        ) {
            try {
                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                if (generateInfo?.[update.message.chatId]?.['caption']){
                    generateInfo[update.message.chatId]['caption'] = false;
                
                    if ( DATABASE.MONGODB_URI ) {
                        await extrasDbFunctions.changeData({
                            userID: update.message.chatId,
                            key: "caption",
                            deleteIt: true
                        })
                    }
                }

                translated = await translate({
                    text: "capButton.deletedCap",
                    button: "settings.closeCB",
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


/**
 * Function to set up event handlers for adding, and deleting captions.
 * @param {TelegramClient} client - The Telegram client instance.
 * @returns {Promise<void>}       - A promise that resolves once all event handlers are set up or an error occurs.
 */

async function captButton(client) {
    await addCaption(client);
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