
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

// isBatch saves all users data in /batch queue
let batchDB = [
    {
        "id" : 786,
        "type" : "@batchMessage",
        "userData" : [ "messageID1", "messageID2", "messageID3" ],
        "forwardFrom" : "id"
    }, {
        "id" : 123,
        "type" : "@batchChannel",
        "userData" : [ "messageID_first", "messageID_last"],
        "forwardFrom" : "channelId"
    }
];


/**
 * Check if a user is in the [batch] database.
 *
 * @param {string} userId - The ID of the user to check.
 * @returns {boolean}    - True if the user is in the batch database, otherwise false.
 */

const isBatchUser = (userId) => {
    return batchDB.some((user) => user.id === userId);
};

/**
 * Delete a user from the [batch] database based on a key-value pair.
 *
 * @param {string} dltKey - The key to identify the user in the batch database.
 * @param {any} dltValue  - The value associated with the key to identify the user.
 */

const deleteBatchUser = (dltKey, dltValue) => {
    for (let key in batchDB) {
        if (typeof batchDB[key] === 'object' && batchDB[key] !== null) {
            // Check if the target key-value pair exists in the nested dictionary
            if (batchDB[key][dltKey] === dltValue) {
                // Delete the key from the main dictionary
                delete batchDB[key];
            }
        }
    }
};

/**
 * Insert data for a user in the batch database by their ID and message ID.
 *
 * @param {string} id        - The ID of the user.
 * @param {string} messageID - The message ID to insert for the user.
 */

const insertDataById = (id, messageID) => {
    let item = false
    for (let i = 0; i < batchDB.length; i++) {
        const currentItem = batchDB[i];
        if (!currentItem) continue
        if ( currentItem && typeof currentItem === 'object' &&
                'id' in currentItem && currentItem.id === id
            ) {
            item = currentItem;
            break;
        }
    }
    if (item){
        item.userData = item.userData || [];
        item.userData.push(messageID);
    }
};

/**
 * Insert a forward-from value for a user in the batch database by their ID.
 *
 * @param {string} id        - The ID of the user.
 * @param {string} channelID - The channel ID to insert as the forward-from value.
 */

const insertForwardFromById = (id, channelID) => {
    let item = false
    for (let i = 0; i < batchDB.length; i++) {
        const currentItem = batchDB[i];
        if (!currentItem) continue
        if ( currentItem && typeof currentItem === 'object' &&
                'id' in currentItem && currentItem.id === id
            ) {
            item = currentItem;
            break;
        }
    }
    if (item)
        item.forwardFrom = channelID;
}

/**
 * Get data for a user from the batch database by their ID.
 *
 * @param {string} id     - The ID of the user.
 * @returns {object|null} - The user's data if found, otherwise null.
 */

const getData = (id) => {
    let item = false
    for (let i = 0; i < batchDB.length; i++) {
        const currentItem = batchDB[i];
        if (!currentItem) continue
        if ( currentItem && typeof currentItem === 'object' &&
                'id' in currentItem && currentItem.id === id
            ) {
            item = currentItem;
            break;
        }
    }
    return item
}

const batchCompleted = []

module.exports = { batchDB, isBatchUser, deleteBatchUser, batchCompleted,
    insertDataById, insertForwardFromById, getData };

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