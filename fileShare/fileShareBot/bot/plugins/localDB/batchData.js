
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

// isBatch saves all users data in /batch queue
const batchDB = [
    {
        "id" : 786,
        "type" : "@batchChannel/@batchMessage",
        "userData" : {}
    }
];

const isBatchUser = (userId) => {
    return batchDB.some((user) => user.id === userId);
};

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

module.exports = { batchDB, isBatchUser, deleteBatchUser };

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