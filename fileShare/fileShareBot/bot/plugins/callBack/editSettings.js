
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
const settingsCbHandler = require("./getSettings");
const { DATABASE } = require("../../../config");

/**
 * Handles callback queries related to the setting.
 * @param {object} options        - Options object.
 * @param {object} options.client - The Telegram Bot API client.
 * @param {object} options.update - The Telegram update object.
 * @returns {Promise<*>}          - A Promise that resolves with the edited message or
 *                                  false if there's an error.
 */

async function changeSettings({ client, update }) {
    try {
        // Decode callback data from base64
        let cbData = Buffer.from(update.data).toString('utf8');

        // Extract currentStatus either true or false [bool]
        // eg cb data will be like [!noForward|true]
        // first line extrack new Value and 2nd line remove ! from the front 
        let currentStatus = (cbData.split("|")[1] === "true");
        let updateProcess = cbData.split("|")[0].slice(1);

        // dropAuthor By defaylt it will be true
        if (updateProcess === "dropAuthor")
            currentStatus = !currentStatus;

        if (currentStatus){
            if (generateInfo[update.userId] &&
                generateInfo[update.userId][updateProcess] !== undefined) {
                    delete generateInfo[update.userId][String(updateProcess)];
            };
            if (DATABASE.MONGODB_URI)
                await extrasDbFunctions.changeData({
                    userID: update.userId,
                    key: updateProcess
                });
        } else {
            if (!generateInfo[update.userId]){
                generateInfo[update.userId] = {}
            };
            if (generateInfo[update.userId][String(updateProcess)] != !currentStatus) {
                    generateInfo[update.userId][updateProcess] = !currentStatus;
            };
            if (DATABASE.MONGODB_URI)
                await extrasDbFunctions.changeData({
                    userID: update.userId,
                    key: updateProcess,
                    value: !currentStatus
                });
        };

        await settingsCbHandler(
            { client: client, update: update}
        );

    } catch (error) {
        logger.log('error', `${file_name}: ${update.userId} : ${error}`);
        return false;
    }
}

module.exports = changeSettings;

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