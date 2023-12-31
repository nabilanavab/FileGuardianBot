
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

// features that are not crucial for the core functionality
const { LANG_INFO } = require("../../config");
const database = require("./database");
const { userLang, enabledLang } = require("../i18n/data");
const { generateInfo } = require("../plugins/localDB/generData");


class extrasDb {
    async changeLang({ userID, lang = LANG_INFO.DEFAULT_LANG }) {
        userID = Number(userID);

        if (!enabledLang.hasOwnProperty(lang))
            return true;
        
        let updateData
        if (lang === LANG_INFO.DEFAULT_LANG && !userLang[userID]) {
            updateData = true;
        } else if (lang === LANG_INFO.DEFAULT_LANG && userLang[userID]) {
            delete userLang[userID];
            updateData = await database.client.db(database.databaseName).collection(
                database.userCollection).updateOne(
                    { userID: Number(userID) }, { $unset : { ['lang'] : 1 } }
                );
        } else if (userLang[userID] === lang) {
            return true;
        } else if (lang !== LANG_INFO.DEFAULT_LANG && !userLang[userID]) {
            userLang[userID] = lang;
            updateData = await database.client.db(database.databaseName).collection(
                database.userCollection).updateOne(
                    { userID: Number(userID) }, { $set : { ['lang'] : lang } }
                );
        }
        return updateData;
    }

    async changeData({ userID, key, value = false, deleteIt = false }) {
        // [impo] please dont use deleteIt it delete user completely 
        let updateData;

        // Not all attributes will be added to all users
        // False values will not be added to prevent unwanted wastage of memory
        if ( deleteIt || !value ){
            if (deleteIt) delete generateInfo[userID];
            else delete generateInfo[userID][key];
            updateData = await database.client.db(database.databaseName).collection(
                database.userCollection).updateOne(
                    { userID: Number(userID) }, { $unset : { [key] : 1 } }
                );
        } else {
            generateInfo[userID][key] = value;
            updateData = await database.client.db(database.databaseName).collection(
                database.userCollection).updateOne(
                    { userID: Number(userID) }, { $set : { [key] : value } }
                );
        }
    }
}

const extrasDbFunctions = new extrasDb();
module.exports = { extrasDbFunctions };

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