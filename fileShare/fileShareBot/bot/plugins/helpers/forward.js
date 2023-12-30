
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

// This snippet forwards all messages from this bot to the log channel
// or returns messages from the log channel to the user based on the need,
// primarily aimed at addressing the flood issue.

const { LOG_FILE } = require("../../../config");
const logger = require("../../../logger");
const { FloodWaitError } = require("telegram/errors/RPCErrorList");
const scheduleAfter = require("../scheduler/scheduleAfter");
const deleteMsg = require("../scheduler/deleteMsg");

/**
 * Asynchronous function to forward messages to a log channel.
 *
 * @param {Object} params           - Parameters object containing client, messageIds, and fromUser.
 * @param {object} params.client    - The messaging client.
 * @param {Array} params.messageIds - List of message IDs to be forwarded.
 * @param {string} params.fromUser  - The user initiating the forwarding.
 * @returns {Boolean}               - A Promise that resolves once the messages are forwarded.
 */

async function logForward({ client, messageId, fromUser, replyTo }) {
    // Get the list of messages that need to be forwarded to the log channel
    let forwardMsg = false;
    while (true) {
        try {
            forwardMsg = await client.forwardMessages(
                LOG_FILE.LOG_CHANNEL, {
                    messages: messageId,
                    fromPeer: fromUser
                }
            )
            break;
        } catch (error) {
            // Handle flood error
            if (error instanceof FloodWaitError)
                await sleep(error.seconds);
            else
                throw "errorInLogMessageForward"
        }
    }
    return forwardMsg;
}


/**
 * Asynchronous function to forward messages from a log channel to a user.
 *
 * @param {Object} params           - Parameters object containing client, messageIds, and toUser.
 * @param {object} params.client    - The messaging client.
 * @param {Array} params.messageIds - List of message IDs to be forwarded.
 * @param {string} params.toUser    - The user to whom messages are forwarded.
 * @returns {Boolean}               - A Promise that resolves once the messages are forwarded to the user.
 */

async function userForward({ client, messageIds, toUser, replyTo, massForward=false,
    dropAuthor=false, dropMediaCaptions=false, noforwards=false, duration=false
}) {

    if ( !massForward ){
        // Get the list of messages that need to be forwarded to the user
        while (true) {
            try {
                forwardMessage = await client.forwardMessages(
                    toUser, {
                        messages: messageIds[0], fromPeer: LOG_FILE.LOG_CHANNEL,
                        noforwards: noforwards, dropAuthor: !dropAuthor,
                        dropMediaCaptions: dropMediaCaptions
                    }
                )
                
                if ( duration ) {
                    try {
                        deleteMsg({
                            client: client, messageID: replyTo,
                            chatID: toUser, frmDB: false
                        })
                    } catch (error) {}
                    await scheduleAfter({
                        timeDur: Number(duration), client: client,
                        messageID: forwardMessage[0][0]['id'], chatID: toUser
                    });
                }
                break;
            } catch (error) {
                // Handle flood error
                if (error instanceof FloodWaitError) {
                    await sleep(error.seconds);
                } else {
                    let lang_code = await getLang(userID);

                    let translated = await translate({
                        text : 'settings.messageDeleted',
                        button : 'settings.closeCB', langCode : lang_code
                    })

                    return await client.sendMesssage({
                        message: translated.text,
                        buttons: translated.button, replyTo: replyTo
                    })
                }
            }
        }
    } else {
        // batch file forward
        const fromPeer = massForward[0];
        const type = massForward[1];

        let messageList = []

        if ( type == "@batchChannel"){
            let first = messageIds[0], last = messageIds[1];
            if ( last-first >= 100) last = first+100;

            for (const i=first; i<last; i++){
                messageList.push(Number(i));
            }
        } else if ( type == "@batchMessage" ){
            messageList = messageIds;
        } else {
            return
        }

        for (const messageID of messageIds){
            while (true) {
                try {
                    forwardMessage = await client.forwardMessages(
                        toUser, {
                            messages: messageIds[0], fromPeer: LOG_FILE.LOG_CHANNEL,
                            noforwards: noforwards, dropAuthor: !dropAuthor,
                            dropMediaCaptions: dropMediaCaptions
                        }
                    );
                    break;
                } catch ( error ){
                    if (error instanceof FloodWaitError) {
                        await sleep(error.seconds);
                    } else {

                    }
                }
            }
        }
    }
    return true;
}

module.exports = { logForward, userForward };

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