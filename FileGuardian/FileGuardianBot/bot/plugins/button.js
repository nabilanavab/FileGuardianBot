
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
 * Parse and validate the given text into the expected format.
 * @param {string} text - The text to be parsed and validated.
 * @returns {Object|boolean} - An object with key-value pairs if the format is valid, or false otherwise.
 */

async function parseAndValidateText(text) {
    try{
        // Split lines, then split each line into key and value, and create an object
        const keyValuePairs = text.split('\n')
            .map(line => line.split(':').map(item => item.trim()))
            .filter(([key, value]) => key && value)
            .reduce((obj, [key, value]) => ({ ...obj, [`${key}`]: `${value}` }), {});

        if (Object.keys(keyValuePairs).length === 0)
            return false

        // Check if "order" exists in the object
        if ('order' in keyValuePairs) {
            const orderValue = parseInt(keyValuePairs['order'], 10);

            // Check if "order" value is a valid number
            if (!isNaN(orderValue)) {
                // Remove "order" from the object
                delete keyValuePairs['order'];

                // Return the object without "order"
                return keyValuePairs;
            }
        }
        return keyValuePairs;

    } catch ( error ) {
        // Return false if the pattern does not match
        return false;
    }
}


/**
 * Asynchronous function to handle the addition of buttons based on specific Telegram commands.
 * @param {TelegramClient} client - The Telegram client instance.
 * @returns {Promise<void>}       - A promise that resolves once the button is added or an error occurs.
 */

async function addButton(client) {
    client.addEventHandler(async (update) => {
        if ( update?.message?.peerId?.className === 'PeerUser' && !update?.message?.out &&
            update?.message?.message?.startsWith("/add_button")
        ) {
            try {
                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                let button = update.message.message.replace('/add_button ', '');

                if (button !== "/add_button" && await parseAndValidateText(button)){
                    if ( DATABASE.MONGODB_URI ) {
                        await extrasDbFunctions.changeData({
                            userID: update.message.chatId,
                            key: "button", value: await parseAndValidateText(button) 
                        })
                    }

                    generateInfo[update.message.chatId]['button'] = await parseAndValidateText(button);

                    translated = await translate({
                        text: "capButton.addedBut",
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
 * Asynchronous function to handle the deletion of buttons based on specific Telegram commands.
 * @param {TelegramClient} client - The Telegram client instance.
 * @returns {Promise<void>}       - A promise that resolves once the button is deleted or an error occurs.
 */

async function deleteButton(client) {
    client.addEventHandler(async (update) => {
        if ( update?.message?.peerId?.className === 'PeerUser' && !update?.message?.out &&
            update?.message?.message?.startsWith("/delete_button")
        ) {
            try {
                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                if (generateInfo?.[update.message.chatId]?.['button']){
                    delete generateInfo[update.message.chatId]['button'];
                
                    if ( DATABASE.MONGODB_URI ) {
                        await extrasDbFunctions.changeData({
                            userID: update.message.chatId,
                            key: "button",
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


async function genButtonUrl(button){
    for (const key in button) {
        if (Object.prototype.hasOwnProperty.call(button, key)) {
            if (!button[key].startsWith("http://") && !button[key].startsWith("https://")) {
                button[key] = 'https://' + button[key];
            }
        }
    }
    return button
}

/**
 * Asynchronous function to handle requests to view the current button associated with a user's account.
 * @param {TelegramClient} client - The Telegram client instance.
 * @returns {Promise<void>}       - A promise that resolves once the button is displayed or an error occurs.
 */

async function view(client) {
    client.addEventHandler(async (update) => {
        if ( update?.message?.peerId?.className === 'PeerUser' && !update?.message?.out &&
            update?.message?.message?.startsWith("/view")
        ) {
            try {
                let button = null;
                if (generateInfo?.[update.message.chatId]?.['button']){
                    button = generateInfo[update.message.chatId]['button']
                }

                let caption = "none";
                if (generateInfo?.[update.message.chatId]?.['caption']){
                    caption = generateInfo[update.message.chatId]['caption']
                }

                if ( button !== null ){
                    button = await genButtonUrl(
                        generateInfo[update.message.chatId]['button']
                    );
                    button = await createButton({
                        button : button,
                        order : generateInfo[update.message.chatId]['button']['order']
                    })
                }

                return await client.sendMessage(
                    update.message.chatId, {
                        message: caption,
                        buttons: button === null ? null: client.buildReplyMarkup(button),
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
 * Function to set up event handlers for adding, viewing, and deleting buttons.
 * @param {TelegramClient} client - The Telegram client instance.
 * @returns {Promise<void>}       - A promise that resolves once all event handlers are set up or an error occurs.
 */

async function captButton(client) {
    await view(client);
    await addButton(client);
    await deleteButton(client);
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