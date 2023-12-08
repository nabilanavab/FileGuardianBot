
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

async function handleUserRequest(userId, request) {
    const currentTime = Date.now();
    const userRequestInfo = userRequests.get(userId) || { count: 0, lastTimestamp: 0 };

    // Check if the user has sent messages too frequently
    if ( userRequestInfo.count >= 2 &&
        currentTime - userRequestInfo.lastTimestamp < 5 * 60 * 1000
    ) {
        // User has sent more than 2 messages within 5 minutes
        const remainingTime = 5 * 60 * 1000 - (currentTime - userRequestInfo.lastTimestamp);
        // send message to user and return
        `You are sending messages too frequently. Please wait for ${Math.ceil(remainingTime / 1000)} seconds.`;
    }

    // Update user request information
    userRequests.set(userId, { count: userRequestInfo.count + 1, lastTimestamp: currentTime });

    // return boolean values like true or false
}


