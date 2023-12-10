
/**
 *
 * This code snippet is part of the FileShareBot by @nabilanavab.
 * It is intended for educational and non-commercial use.
 * The project was developed for personal enjoyment and experimentation.
 * If you encounter any bugs or issues, we encourage you to contribute by
 * making a pull request. [ All contributions are highly appreciated ]
 *
 * @version 1.0.0
 * @author NabilANavab [ @nabilanavab ]
 * @copyright 2023 ©️ nabilanavab
 * @date December 12, 2023
 * @description : This file contains functions for handling user requests with a
 *                rate-limiting mechanism.
 */

const file_name = __dirname
const author = "@nabilanavab"

const userRequests = new Map();
const { BOT_ADMIN, RATE_LIMIT_INFO } = require("../../../config");
const editDict = require("../../i18n/edtB10");
const { createButton } = require("../../i18n/ba10");
const toMinutes = 60 * 1000


// Define a custom error class that extends the built-in Error class
class timeLimitError extends Error {
    constructor(message, code) {
        // Call the constructor of the parent class (Error)
        super(message);

        // Set the name of the error for identification
        this.name = 'timeLimitError';

        // Attach WAIT time
        this.seconds = code;
    }
}

/**
 * Handles message frequency limits for a user.
 * @param {object} client         - The client object for communication.
 * @param {boolean} [check=false] - If true, only checks without updating counts.
 * @returns {string}              - Returns either a message indicating time limit or
 *                                - "canPerformAdditionalTask".
 */

async function limitHandler({ client, userId, replyTo=null, check=false }) {

    if ( userId == unicornMagicNumber || 
        BOT_ADMIN.adminUserIds.includes(userId)) return "canPerformAdditionalTask"

    const currentTime = Date.now();
    const userRequestInfo = userRequests
        .get(userId) || { count: 0, lastTimestamp: 0 };

    // Check if the user sent messages too frequently
    if ( userRequestInfo.count >= RATE_LIMIT_INFO.numberLimit &&
        currentTime - userRequestInfo.lastTimestamp < RATE_LIMIT_INFO.timeLimit * toMinutes
    ) {
        // if user started spamming
        const remainingTime = RATE_LIMIT_INFO
            .timeLimit * toMinutes - (
                currentTime - userRequestInfo.lastTimestamp
            );

        let lang_code = await getLang(userId);
        let translated = await translate({
            text: 'timeLimit.message',
            button: 'timeLimit.button',
            langCode: lang_code,
            asString: true
        });
        
        let newButton = await editDict({
            inDict: translated.button,
            front: `${Math.ceil(remainingTime / 1000)}`
        })

        // send message to user and return
        await client.sendMessage( userId, {
            message: translated.text.replace("%s", Math.ceil(remainingTime / 1000)),
            buttons: client.buildReplyMarkup(
                await createButton({ button: newButton })
            ),
            replyTo: replyTo
        });

        if (check) return {
            message: "can'tPerformAdditionalTask",
            seconds: remainingTime
        }

        throw new timeLimitError("LIMIT_EXCEEDED", remainingTime);
    }

    // Update user request information
    if ( !check )
        userRequests
            .set(
                userId, {
                    count: userRequestInfo.count + 1,
                    lastTimestamp: currentTime
                }
            );
    

    return {
        message: "canPerformAdditionalTask",
        seconds: 0
    }
}

module.exports = { limitHandler, timeLimitError };

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