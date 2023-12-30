
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
const { enabledLang } = require("../../i18n/data");
const { extrasDbFunctions } = require("../../monGo/extras");
const askLang = require("./getLang");
const { DATABASE } = require("../../../config");
const { Api } = require('telegram');

/**
 * Handles callback queries related to the language setting.
 * @param {object} options        - Options object.
 * @param {object} options.client - The Telegram Bot API client.
 * @param {object} options.update - The Telegram update object.
 * @returns {Promise<*>}          - A Promise that resolves with the edited message or
 *                                  false if there's an error.
 */

async function setLang({ client, update }) {
    try {
        // Decode callback data from base64
        let cbData = Buffer.from(update.data).toString('utf8');
        // Get the user's language code
        let langCode = await getLang(update.userId);

        // callBack will be like "~lang|{code}"
        let newLang = cbData.split("|")[1];

        if ( newLang === "Done" ){

            const translated = await translate({text: `lang.already`, langCode: langCode});
            return await client.invoke(
                new Api.messages.SetBotCallbackAnswer({
                    alert: true,
                    queryId: BigInt(update.queryId.value),
                    message: translated.text,
                    // url: 'random string here',
                })
            );

        } else {

            if (DATABASE.MONGODB_URI && enabledLang.hasOwnProperty(newLang)){
                await extrasDbFunctions.changeLang({
                    userID: update.userId,
                    lang: newLang
                })
            }

            await askLang(
                { client: client, update: update}
            );
        }
        
    } catch (error) {
        logger.log('error', `${file_name}: ${update.userId} : ${error}`);
        return false;
    }
}

module.exports = setLang;

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