
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

const file_name = __filename
const author = "@nabilanavab"

const { batchDB, isBatchUser, deleteBatchUser } = require("../localDB/batchData");
const logger = require("../../../logger");
const { Api } = require("telegram");

/**
 * Handles callback queries related to batch functions
 * @param {object} options        - Options object.
 * @param {object} options.client - The Telegram Bot API client.
 * @param {object} options.update - The Telegram update object.
 * @returns {Promise<*>}          - A Promise that resolves with the edited message or
 *                                  false if there's an error.
 */

async function batchManager({ client, update }) {
    try {
        // Decode callback data from base64
        let cbData = Buffer.from(update.data).toString('utf8');
        // Get the user's language code
        let langCode = await getLang(update.userId);

        if ( cbData === "@cancelBatch" ){
            deleteBatchUser('id', update.userId.value);

            const translated = await translate({
                text: "batch.procCancel",
                button: "batch.canceled",
                langCode: langCode
            })
            return await client.editMessage(
                update.userId, {
                    message: update.msgId,
                    text: translated.text,
                    buttons: client.buildReplyMarkup(translated.button),
                    parseMode: "html",
                }
            );
        }

        if (isBatchUser(update.userId.value)){
            const translated = await translate({
                text: "batch.inProgress",
                langCode: langCode
            })

            return await client.invoke(
                new Api.messages.SetBotCallbackAnswer({
                    alert: true,
                    queryId: BigInt(update.queryId.value),
                    message: translated.text,
                    // url: 'random string here',
                })
            );
        } else {
            const translated = await translate({
                text : cbData === "@batchChannel" ?
                    "batch.sendFisrtMsg" : "batch.sendMessage",
                button: "batch.cancel",
                langCode: langCode
            })

            batchDB.push({
                "id" : update.userId.value,
                "userData" : [],
                "type" : cbData === "@batchChannel" ? "@batchChannel" : "@batchMessage",
                "forwardFrom" : cbData === "@batchChannel" ? null : "id"
            });

            await client.sendMessage(
                update.userId, {
                    message: translated.text,
                    buttons: translated.button
                }
            )
            return await client.invoke(
                new Api.messages.SetBotCallbackAnswer({
                    alert: true,
                    queryId: BigInt(update.queryId.value),
                    message: "",
                    // url: 'random string here',
                })
            );
        }
    } catch (error) {
        logger.log('error', `${file_name}\batchCB: ${update.userId} : ${error}`);
        return false
    }
}


module.exports = batchManager;

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