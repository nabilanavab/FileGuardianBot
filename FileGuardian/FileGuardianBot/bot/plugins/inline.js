
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
const { userForward } = require("./helpers/forward");
const { duration } = require("moment");

// Local database to store passwords for quick access and
// prevent flooding during frequent requests.
var localCbMessageDataWhichSavePassword = {
    786: {
        "id" :785,
        "password" : "BismillahirRahmanirRaheem"
    }
}

module.exports = async function (client) {
    client.addEventHandler(async (update) => {
        if (update  && update.className == "UpdateBotInlineQuery"){
            try {
                let langCode = await getLang(update.userId);

                if (update.query.startsWith("get")){
                    try {
                        let [_, messageId, password] = update.query.split(/\s+/);
                        if (messageId == undefined || password == undefined)
                            error = error;
                        
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
                                                send_message: "chammy.."
                                            })
                                        ]
                                    })
                                );
                            }
                            localCbMessageDataWhichSavePassword[Number(messageId)] = {
                                'id' : jsonData['messageID'],
                                'password' : jsonData['setPassword'],
                                'dropAuthor' : !jsonData['dropAuthor'],
                                'dropMediaCaptions' : jsonData['dropMediaCaptions'],
                                'noforwards' : jsonData['noforwards'],
                                'isAccesable' : jsonData['isAccesable'],
                                'duration' : jsonData[duration]
                            }
                        }

                        if (localCbMessageDataWhichSavePassword[Number(messageId)]['isAccesable']){
                            let translated = await translate({
                                text: `settings._noAccess`, langCode: langCode
                            })

                            return await client.invoke(
                                new Api.messages.SetInlineBotResults({
                                    queryId: BigInt(update.queryId.value),
                                    results: [],
                                    cacheTime: 0,
                                    switchPm: new Api.InlineBotSwitchPM({
                                        text: translated.text,
                                        startParam: "waste"
                                    }),
                                })
                            )
                        }

                        if(password === localCbMessageDataWhichSavePassword[Number(messageId)]['password']){
                            await userForward({
                                client: client,
                                messageIds: [localCbMessageDataWhichSavePassword[Number(messageId)]['id']],
                                toUser: update.userId,
                                dropAuthor: localCbMessageDataWhichSavePassword[Number(messageId)]['dropAuthor'],
                                dropMediaCaptions: localCbMessageDataWhichSavePassword[Number(messageId)]['dropMediaCaptions'],
                                noforwards: localCbMessageDataWhichSavePassword[Number(messageId)]['noforwards'],
                                isAccesable: localCbMessageDataWhichSavePassword[Number(messageId)]['isAccesable'],
                                duration: localCbMessageDataWhichSavePassword[Number(messageId)]['duration']
                            })
                        }
                        return

                    } catch (error) {
                        let translated = await translate({
                            text: `settings.enterPass`, langCode: langCode
                        })

                        return await client.invoke(
                            new Api.messages.SetInlineBotResults({
                                queryId: BigInt(update.queryId.value),
                                results: [],
                                cacheTime: 0,
                                switchPm: new Api.InlineBotSwitchPM({
                                    text: translated.text,
                                    startParam: "waste"
                                }),
                            })
                        )
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