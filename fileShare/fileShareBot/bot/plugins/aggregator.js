
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


const { batchDB, isBatchUser, getData, deleteBatchUser, batchCompleted,
        insertDataById, insertForwardFromById } = require("./localDB/batchData");
const logger = require("../../logger");
const { generateInfo } = require("./localDB/generData");
const encrypt = require("./cryptoG/encrypt");
const reply = require("./helpers/reply");
const editDict = require("../../bot/i18n/edtB10");
const edit = require("./helpers/edit");


// Check if the user in batching files
module.exports = async function (client) {
    client.addEventHandler(async (update) => {
        if (
            update && update.message &&
            update.message.peerId.className === 'PeerUser' &&
            isBatchUser(update.message.chatId.value)
        ) {
            try {
                // Retrieve the user's language from the local database
                let lang_code = await getLang(update.message.chatId);

                // getting userBatch Info
                const item = batchDB.find(item => item.id === update.message.chatId.value);

                if ( item.type === "@batchMessage") {
                    if ( item.userData.length < 10 ){
                        insertDataById(update.message.chatId.value, update.message.id)

                        const translated = await translate({
                            text : "batch.sendMessage",
                            button : "batch.batch",
                            langCode : lang_code
                        })
                        await client.sendMessage(
                            update.message.chatId, {
                                message: translated.text,
                                buttons: translated.button,
                                parseMode: "html"
                            }
                        )
                    }

                } else if ( item.type === "@batchChannel" ){

                    // console.log(update.message)
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
                            return value.toString();
                    return value;
                    }, 4
                );
                batchInfo = JSON.parse(batchInfo)

                let message = `<pre><code class="language-js">{
  "userID"           : ${update.message.chatId},
  "batchInfo"        : ${JSON.stringify(batchInfo)},
  "setPassword"      : ${getUserInfo && getUserInfo['setPassword'] ? `\"${getUserInfo['setPassword']}\"` : false},
  "dropAuthor"       : ${getUserInfo && getUserInfo['dropAuthor'] === undefined ? false : true},
  "dropMediaCaptions": ${getUserInfo && getUserInfo['dropMediaCaptions'] ? getUserInfo['dropMediaCaptions'] : false},
  "noforwards"       : ${getUserInfo && getUserInfo['noforwards'] ? getUserInfo['noforwards'] : false},
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
                    else if ( key == "duration" || key == "isAccesable" )
                        console.log("do nothing here")
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
                logger.log('error', `${file_name}/aggregator.js : ${update.message.chatId} : ${error}`);
            }
        }
    });
}