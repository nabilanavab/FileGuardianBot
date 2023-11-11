
global.exit_success = 0;  // return 0: in success
global.exit_failure = 1;  // return 1: in failure

/**
 * This function Helps to prevent flood wait errors for all the messages.
 *
 * @param {any} client           - gramJs Bot Client
 * @param {number} chatId        - users chat_id
 * @param {string} username      - users username
 * @param {string} message       - message to user
 * @param {boolean} buttonType   - false: if no button
 * @param {object} button        - button {dict} if
 * @returns {boolean}            - return exit_success/
 *                                        exit_fails
 *
 * @throws {Error} 
 *
 * @example
 * messageSendHandler(client, chatID, message, haveButton, button)
 */

function messageSendHandler(
    client, chatID, username=false,
    message, buttonType=false, button=false, no_webpage=false, reply_to_msg_id=false,
    delete_reply_to_message=false
) {
    console.log(`${chatID} -- WORKING..`);
}