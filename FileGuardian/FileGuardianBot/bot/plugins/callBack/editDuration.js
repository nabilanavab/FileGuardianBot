
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

const logger = require("../../../logger");
const { generateInfo } = require("../localDB/generData");
const { extrasDbFunctions } = require("../../monGo/extras");
const askDuration = require("./getDuration");
const { DATABASE } = require("../../../config");
const { Api } = require('telegram');

/**
 * Handles callback queries related to the message Duration setting.
 * @param {object} options        - Options object.
 * @param {object} options.client - The Telegram Bot API client.
 * @param {object} options.update - The Telegram update object.
 * @returns {Promise<*>}          - A Promise that resolves with the edited message or
 *                                  false if there's an error.
 */

async function setDuration({ client, update }) {
    try {
        // Decode callback data from base64
        let cbData = Buffer.from(update.data).toString('utf8');
        // Get the user's language code
        let langCode = await getLang(update.userId);

        // callBack will be like "~lang|{code}"
        let newTime = cbData.replace("$", "");

        if ( newTime === "duration|Done" ){

            const translated = await translate({text: `duration.already`, langCode: langCode});
            return await client.invoke(
                new Api.messages.SetBotCallbackAnswer({
                    alert: true,
                    queryId: BigInt(update.queryId.value),
                    message: translated.text,
                    // url: 'random string here',
                })
            );

        } else if ( newTime === "delete" ){

            if (generateInfo[update.userId] &&
                generateInfo[update.userId]['duration'] !== undefined)
                    delete generateInfo[update.userId]['duration'];
            
            if (DATABASE.MONGODB_URI)
                await extrasDbFunctions.changeData({
                    userID: update.userId,
                    key: 'duration'
                });

        } else {
            if (!generateInfo[update.userId])
                generateInfo[update.userId] = {}
            
            if (generateInfo[update.userId]['duration'] != newTime)
                generateInfo[update.userId]['duration'] = newTime;
            
            if (DATABASE.MONGODB_URI)
                await extrasDbFunctions.changeData({
                    userID: update.userId, key: 'duration', value: newTime
                });
            }

        return await askDuration(
            { client: client, update: update}
        );
        
    } catch (error) {
        logger.log('error', `${file_name}: ${update.userId} : ${error}`);
        return false;
    }
}

module.exports = setDuration;

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