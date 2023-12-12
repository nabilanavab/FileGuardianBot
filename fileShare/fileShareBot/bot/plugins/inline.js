
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

const { Api } = require("telegram");
const logger = require("../../logger");
const { generateInfo } = require("./localDB/generData");
const { LOG_FILE } = require("../../config");

// Local database to store passwords for quick access and
// prevent flooding during frequent requests.
localCbMessageDataWhichSavePassword = {
    786: {
        "dataMessage" :785,
        "password" : "BismillahirRahmanirRaheem"
    }
}

module.exports = async function (client) {
    client.addEventHandler(async (update) => {
        if (update  && update.className == "UpdateBotInlineQuery"){
            try {
                let langCode = await getLang(update.userId);

                if (update.query.startsWith("get ")){
                    const [_, messageId, password] = update.query.split(/\s+/);

                    console.log(`${messageId} | ${password}`)
                    if (localCbMessageDataWhichSavePassword[Number(messageId)] === undefined){
                        let data = await client.invoke(
                            new Api.channels.GetMessages({
                                channel: LOG_FILE.LOG_CHANNEL,
                                id: [Number(messageId)]
                            })
                        );
                        let jsonData = JSON.parse(
                            data['messages'][0]['message'].split("\n\n")[0]
                        );
                        if (!jsonData['setPassword']){
                            return await client.invoke(
                                new Api.messages.SetInlineBotResults({
                                    queryId: BigInt(update.queryId.value),
                                    results: [
                                        // get message by id [but we need to add restriction]
                                        new Api.InputBotInlineResult({
                                            title: "This File Is Open For All, Use Link Directly",
                                            description: "This File Is Open For All, Use Link Directly",
                                            send_message: "channy.."
                                        })
                                    ]
                                })
                            );
                        };
                    localCbMessageDataWhichSavePassword[Number(messageId)]['dataMessage'] = 
                        [ data['messages'][0]['replyTo']['replyToMsgId'] ];
                    localCbMessageDataWhichSavePassword[Number(messageId)]['password'] =
                        jsonData['setPassword'];
                    }
                }

                if (generateInfo[update.userId] && 
                    generateInfo[update.userId]['setPassword'] &&
                        (update.query.match(/[A-Za-z0-9]/g)?.join('') || '') === ''){
                    let translated = await translate({
                        text: `settings.passworDlt`,
                        langCode: langCode
                    });

                    return await client.invoke(
                        new Api.messages.SetInlineBotResults({
                            queryId: BigInt(update.queryId.value),
                            results: [],
                            cacheTime: 0,
                            switchPm: new Api.InlineBotSwitchPM({
                                text: translated.text,
                                startParam: "password-Delete",
                            }),
                        })
                    )
                }

                if ( generateInfo[update.userId] && 
                    generateInfo[update.userId]['setPassword'] &&
                        generateInfo[update.userId]['setPassword'] === update
                            .query.match(/[A-Za-z0-9]/g)?.join('') || '' ){

                    let translated = await translate({
                        text: `settings.samePassword`,
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