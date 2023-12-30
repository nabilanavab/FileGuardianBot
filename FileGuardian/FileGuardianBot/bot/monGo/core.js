
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

// This file contains basic or mandatory functions
const { LANG_INFO } = require("../../config")
const database = require("./database")
const moment = require('moment');

class coreDb {
    async isUserExist({ userID, elseAdd = false }) {
        let user = await database.client.db(database.databaseName).collection(
                database.userCollection).findOne({ userID: parseInt(userID) });

        if (!elseAdd) {
            return user;
            // use return !!user to send bool
        } else if (!user) {
            let document = {
                userID: userID,
                join_date: moment(new Date()).format('DD:MMM:YYYY')
            };

            if (elseAdd.lang && elseAdd.lang !== LANG_INFO.DEFAULT_LANG) {
                document.lang = elseAdd.lang;
            }
            if (elseAdd.requested) {
                document.requested = elseAdd.requested;
            }

            let newUser = await database.client.db(database.databaseName).collection(
                    database.userCollection).insertOne(document);

            return "newUser";
        }
    }
}

const coreDbFunctions = new coreDb();
module.exports = { coreDbFunctions };

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