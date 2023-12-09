
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
 * @description This file contains functions for handling user requests with a rate-limiting mechanism.
 * 
 */

const userRequests = new Map();
const { BOT_ADMIN, RATE_LIMIT_INFO } = require("../../../config")

/**
 * Handles message frequency limits for a user.
 * @param {object} client         - The client object for communication.
 * @param {boolean} [check=false] - If true, only checks without updating counts.
 * @returns {string}              - Returns either a message indicating time limit or
 *                                - "canPerformAdditionalTask".
 */

async function limitHandler(client, userId, check=false) {

    if ( userId == unicornMagicNumber || 
        BOT_ADMIN.includes(userId)) return "canPerformAdditionalTask"

    const currentTime = Date.now();
    const userRequestInfo = userRequests
        .get(userId) || { count: 0, lastTimestamp: 0 };

    // Check if the user sent messages too frequently
    if ( userRequestInfo.count >= RATE_LIMIT_INFO.numberLimit &&
        currentTime - userRequestInfo.lastTimestamp < RATE_LIMIT_INFO.timeLimit * 60 * 1000
    ) {
        // if user started spamming
        const remainingTime = RATE_LIMIT_INFO
            .timeLimit * 60 * 1000 - (
                currentTime - userRequestInfo.lastTimestamp
            );
        // send message to user and return
        `You are sending messages too frequently. Please wait for ${Math.ceil(remainingTime / 1000)} seconds.`;
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
    

    return "canPerformAdditionalTask"
}

module.exports = { limitHandler };
