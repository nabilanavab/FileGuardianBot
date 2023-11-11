
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
