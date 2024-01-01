
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


const { batchDB, isBatchUser, getData, deleteBatchUser, batchCompleted,
        insertDataById, insertForwardFromById } = require("./localDB/batchData");
const logger = require("../../logger");
const { generateInfo } = require("./localDB/generData");
const encrypt = require("./cryptoG/encrypt");
const reply = require("./helpers/reply");
const editDict = require("../../bot/i18n/edtB10");
const edit = require("./helpers/edit");
const { Api } = require("telegram")


/**
 * Event handler to check if the user is in a batching session and processes relevant messages.
 *
 * @param {TelegramBot} client - The Telegram bot instance.
 * @returns {Promise<void>} - A Promise that resolves when the event handling is completed.
 */

module.exports = async function (client) {
    client.addEventHandler(async (update) => {
        if (
            update && update.message && update.message.chatId.value !== botInfo.id.value &&
            update.message.peerId.className === 'PeerUser' &&
            isBatchUser(update.message.chatId.value)
        ) {
            try {
                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                let item = false
                // getting userBatch Info
                for (let i = 0; i < batchDB.length; i++) {
                    const currentItem = batchDB[i];
                    if (!currentItem) continue
                    // Check if the current item has an 'id' property and its value matches chatIdValue
                    if ( currentItem && typeof currentItem === 'object' &&
                         'id' in currentItem && currentItem.id === update.message.chatId.value
                     ) {
                        item = currentItem;
                        break;  // Exit the loop once the item is found
                    }
                }

                if ( item.type === "@batchMessage") {
                    if ( item.userData.length==0 || (item.userData.length <= 25 && ( !update.message.message || 
                        (update.message.message && update.message.message != "/batch")))
                    ){
                        insertDataById(update.message.chatId.value, update.message.id)

                        const translated = await translate({
                            text : "batch.sendMessage", button : "batch.cancel",
                            langCode : lang_code
                        })

                        return await client.sendMessage(
                            update.message.chatId, {
                                message: translated.text + item.userData.length,
                                buttons: translated.button,
                                parseMode: "html",
                                replyTo: update.message
                            }
                        )
                    }

                } else if ( item.type === "@batchChannel" ){
                    if (!( update.message.fwdFrom && update.message.fwdFrom.fromId &&
                        update.message.fwdFrom.fromId.channelId &&
                        update.message.fwdFrom.fromId.className === "PeerChannel" )
                    ){
                        const translated = await translate({
                            text : "batch.forwardIt",
                            button : "batch.cancel",
                            langCode : lang_code
                        })
                        
                        return await client.sendMessage(
                            update.message.chatId, {
                                message: translated.text,
                                buttons: translated.button,
                                parseMode: "html"
                            }
                        )
                    }
                    
                    if ( item.userData.length == 0 ){

                        try{
                            await client.invoke(
                                new Api.channels.GetChannels({
                                    id: [update.message.fwdFrom.fromId.channelId]
                                })
                            )
                        } catch (error){
                            const translated = await translate({
                                text : "batch.adminReq",
                                button : "batch.cancel",
                                langCode : lang_code
                            })
                            return await client.sendMessage(
                                update.message.chatId, {
                                    message: 'ERROR: CHANNEL_PRIVATE\n\n' + translated.text,
                                    buttons: translated.button,
                                    parseMode: "html"
                                }
                            )
                        }
                        
                        insertForwardFromById(
                            update.message.chatId.value, update.message.fwdFrom.fromId.channelId.value
                        )
                        insertDataById(update.message.chatId.value, update.message.fwdFrom.channelPost)

                        const translated = await translate({
                            text : "batch.sendLastMsg",
                            button : "batch.cancel",
                            langCode : lang_code
                        })
                        return await client.sendMessage(
                            update.message.chatId, {
                                message: translated.text,
                                buttons: translated.button,
                                parseMode: "html"
                            }
                        )
                    } else if ( item.userData.length == 1 &&
                        ( getData(update.message.chatId.value).forwardFrom !== 
                        update.message.fwdFrom.fromId.channelId.value ||
                        getData(update.message.chatId.value).userData[0] >= 
                        update.message.fwdFrom.channelPost)
                    ){

                        const translated = await translate({
                            text : "batch.lastMsgError",
                            button : "batch.cancel",
                            langCode : lang_code
                        })
                        return await client.sendMessage(
                            update.message.chatId, {
                                message: translated.text,
                                buttons: translated.button,
                                parseMode: "html"
                            }
                        )
                    } else if ( item.userData.length == 1 ) {
                        insertDataById(update.message.chatId.value, update.message.fwdFrom.channelPost)
                    }
                }

                // Display a series of messages to enhance user experience
                dot_message = await client.sendMessage(
                    update.message.chatId, {
                        message : ".",
                        replyTo : update.message.id,
                        parseMode: "html"
                    }
                );

                // Retrieve user data from the local database to determine
                // if the link should be password protected or not, etc
                const getUserInfo = generateInfo[update.message.chatId];

                // batch file Info
                let batchInfo = JSON.stringify(
                    getData(update.message.chatId.value),
                    (key, value) => {
                        if (typeof value === 'bigint')
                            return Number(value)
                    return value;
                    }, 4
                );

                let message = `<pre><code class="language-js">{
  "userID"           : ${update.message.chatId},
  "batchInfo"        : ${batchInfo},
  "setPassword"      : ${getUserInfo && getUserInfo['setPassword'] ? `\"${getUserInfo['setPassword']}\"` : false},
  "dropAuthor"       : ${getUserInfo && getUserInfo['dropAuthor'] === undefined ? false : true},
  "dropMediaCaptions": ${getUserInfo && getUserInfo['dropMediaCaptions'] ? getUserInfo['dropMediaCaptions'] : false},
  "noforwards"       : ${getUserInfo && getUserInfo['noforwards'] ? getUserInfo['noforwards'] : false}
}</code></pre>

<a href="tg://user?id=${update.message.chatId}">👤 viewProfile 👤</a>`;
                
                // Send the service message to the log channel
                replyMessage = await reply.sendReplyToLog({
                    client: client,
                    replyText: message,
                    MessageId: false
                })

                messageInfo = `batch:${replyMessage['id']}`
                code = await encrypt({
                    text: messageInfo,
                    userID: update.message.chatId.value
                });

                let data = ""
                for (let [key, value] of Object.entries(getUserInfo)) {
                    if ( key == "setPassword" )
                        data += `${value ? `<i>🔐 ${key}</i> : <spoiler>${value}</spoiler>` : ''}`;
                    else if ( key == "duration" ) {}
                    else 
                        data += `${value ? `<i>🟢 ${key}</i>` : ''}`;
                    data += " | "
                }
                data = data.slice(0, -3);

                translated = await translate({
                    text: !(getUserInfo && getUserInfo['setPassword'] == undefined)
                        ? "generate.publLink" : "generate.privLink",
                    button: "generate.button",
                    asString: true,
                    langCode: lang_code
                });
                
                // Edit the button with the generated URL
                let newButton = await editDict({
                    inDict: translated.button,
                    value: `https://telegram.dog/${botInfo.username}?start=${code}`
                })
                newButton = await createButton({
                    button: newButton, order: '11'
                })

                // Edit the user's message with the final message and URL
                await edit.editReply({
                    client: client,
                    chatId: update.message.chatId,
                    messageId: dot_message.id,
                    editedText: translated.text + data,
                    editedBtn: newButton,
                    parseMode: "html"
                })
                
                deleteBatchUser(update.message.chatId.value)
                batchCompleted.push(update.message.chatId.value)

            } catch (error) {
                logger.log('error', `${file_name} : ${update.message.chatId} : ${error}`);
            }
        }
    });
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
