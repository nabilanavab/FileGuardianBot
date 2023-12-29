
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

const config = require("../../../config");
const { Api } = require("telegram");
const REQUESTED_USERS = require("../localDB/request");

/**
 * Handles callback queries related to the refresh join button.
 * @param {object} options        - Options object.
 * @param {object} options.client - The Telegram Bot API client.
 * @param {object} options.update - The Telegram update object.
 * @returns {Promise<*>}          - A Promise that resolves with the edited message or
 *                                  false if there's an error.
 */

async function refreshPage({ client, update }) {
    
    // Get the user's language code
    let langCode = await getLang(update.userId);

    try {
        if ( !REQUESTED_USERS.includes(BigInt(update.userId)) ){
            const result = await client.invoke(
                new Api.channels.GetParticipant({
                    channel: config.CHANNEL_INFO.FORCE_SUB,
                    participant: update.userId
                })
            );
        
            if (result.kicked)
                throw "userBanned"
        }

        // Translate message and buttons based on the new page
        let translated = await translate({
            text: 'help.0.message',
            button: 'help.0.button',
            langCode: langCode,
            order: 2121
        });

        // Edit the original message with the translated text and buttons
        return await client.editMessage(
            update.userId, {
                message: update.msgId,
                text: translated.text,
                buttons: client.buildReplyMarkup(translated.button),
                parseMode: "html",
            }
        );

    } catch (error) {
        const translated = await translate({text: `force.fool`, langCode: langCode});
        return await client.invoke(
            new Api.messages.SetBotCallbackAnswer({
                alert: true,
                queryId: BigInt(update.queryId.value),
                message: translated.text,
                // url: 'random string here',
            })
        );
    }
}

module.exports = refreshPage;

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