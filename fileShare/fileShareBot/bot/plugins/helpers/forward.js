

// This snippet forwards all messages from this bot to the log channel
// or returns messages from the log channel to the user based on the need,
// primarily aimed at addressing the flood issue.


const { LOG_FILE } = require("../../../config");
const logger = require("../../../logger");
const { FloodWaitError } = require("telegram/errors/RPCErrorList");


/**
 * Asynchronous function to forward messages to a log channel.
 *
 * @param {Object} params           - Parameters object containing client, messageIds, and fromUser.
 * @param {object} params.client    - The messaging client.
 * @param {Array} params.messageIds - List of message IDs to be forwarded.
 * @param {string} params.fromUser  - The user initiating the forwarding.
 * @returns {Boolean}               - A Promise that resolves once the messages are forwarded.
 */

async function logForward({ client, messageIds, fromUser }) {
    // Get the list of messages that need to be forwarded to the log channel
    let forwardMsg = false;
    for (const messageId of messageIds) {
        while (true) {
            try {
                forwardMsg = await client.forwardMessages(
                    LOG_FILE.LOG_CHANNEL,
                    {
                        messages: messageId,
                        fromPeer: fromUser
                    }
                )
                break;
            } catch (error) {
                // Handle flood error
                if (error instanceof FloodWaitError) {
                    await sleep(error.seconds);
                } else {
                    logger.log(`?Error @ logForward: ${error}`)
                    break;
                }
            }
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

async function userForward({ client, messageIds, toUser }) {
    // Get the list of messages that need to be forwarded to the user
    for (const messageId of messageIds) {
        while (true) {
            try {
                await client.forwardMessages(
                    LOG_FILE.LOG_CHANNEL,
                    {
                        messages: messageId,
                        fromPeer: toUser
                    }
                )
                break;
            } catch (error) {
                // Handle flood error
                if (error instanceof errors.FloodError) {
                    await sleep(error.seconds);
                } else {
                    logger.log(`?Error @ userForward: ${error}`)
                    break;
                }
            }
        }
    }
}

module.exports = { logForward, userForward };