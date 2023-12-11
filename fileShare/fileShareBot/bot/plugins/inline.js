
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

const { Api } = require("telegram");
const logger = require("../../logger");

module.exports = async function (client) {
    client.addEventHandler(async (update) => {
        if (update  && update.className == "UpdateBotInlineQuery"){
            try {
                let langCode = await getLang(update.userId);

                let translated = await translate({
                    text: `settings.setPassword`,
                    langCode: langCode
                });

                return await client.invoke(
                    new Api.messages.SetInlineBotResults({
                        queryId: BigInt(update.queryId.value),
                        results: [],
                        cacheTime: 0,
                        switchPm: new Api.InlineBotSwitchPM({
                            text: `${translated.text} ${update.query
                                .match(/[A-Za-z0-9]/g)?.join('') || ''}`,
                            startParam: `password${update.query
                                .match(/[A-Za-z0-9]/g)?.join('') || ''}`,
                        }),
                    })
                )
            } catch (error) {
                logger.log('error', `${file_name}: ${update.userId} : ${error}`);
                let langCode = await getLang(update.userId);

                let translated = await translate({
                    text: `settings.bigPassword`,
                    langCode: langCode
                });

                return await client.invoke(
                    new Api.messages.SetInlineBotResults({
                        queryId: BigInt(update.queryId.value),
                        results: [],
                        cacheTime: 0,
                        switchPm: new Api.InlineBotSwitchPM({
                            text: translated.text,
                            startParam: "password",
                        }),
                    })
                )
            }
        }
    })
}

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