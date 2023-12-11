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
const { DATABASE } = require("../../../config");
const editDict = require("../../i18n/edtB10");
const translate = require("../../i18n/t9n");

async function setPassword({ client, update, haveCode }) {
    try {
        let password = haveCode.replace("password", "");

        let lang_code = await getLang(update.message.chatId);

        if (password == ''){
            let translated = await translate({
                text: 'settings.samePassword',
                button: 'settings.closeCB',
                langCode: lang_code
            });
            await client.sendMessage(
                update.message.chatId, {
                    message: translated.text,
                    buttons: client.buildReplyMarkup(
                        translated.button
                    )
                }
            )
        } else {
            if(!generateInfo[update.message.chatId])
                generateInfo[update.message.chatId] = {}

            if (password == '-Delete'){
                delete generateInfo[update.message.chatId]['setPassword']
                if (DATABASE.MONGODB_URI){
                    await extrasDbFunctions.changeData({
                        userID: update.message.chatId,
                        key: 'setPassword'
                    });
                }
            } else {
                generateInfo[update.message.chatId]['setPassword'] = password
                if (DATABASE.MONGODB_URI){
                    await extrasDbFunctions.changeData({
                        userID: update.message.chatId,
                        key: 'setPassword',
                        value: password
                    });
                }

                let translated = await translate({
                    text : 'settings.passUpdated',
                    button : 'settings.passUpdCB',
                    asString : true,
                    langCode : lang_code
                });
                let newButton = await editDict({
                    inDict : translated.button,
                    value : `:${password}`
                })
                await client.sendMessage(update.message.chatId, {
                    message: translated.text,
                    buttons: client.buildReplyMarkup(
                        await createButton({
                            button : newButton, order : '11'
                        })
                    )
                });
            }
        }

        return await client.deleteMessages(
            update.message.chatId,
            [update.message],
            {}
        );

    } catch (error) {

        logger.log('error', `${file_name}: ${update.userId} : ${error}`);
        return false

    }
}

module.exports = setPassword;

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