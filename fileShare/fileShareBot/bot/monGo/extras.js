

// features that are not crucial for the core functionality
const { LANG_INFO } = require("../../config")
const database = require("./database")
const moment = require('moment');
const { userLang } = require("../i18n/data")


class extrasDb {
    async changeLang({ userID, lang }) {
        let updateData
        
        if (lang === LANG_INFO.DEFAULT_LANG && !userLang[userID]) {
            updateData = true;
        } else if (lang === LANG_INFO.DEFAULT_LANG && userLang[userID]) {
            delete userLang[userID];
            updateData = await database.client.db(database.databaseName).collection(
                database.userCollection).updateOne(
                    { userID: userID }, { $unset : { [lang] : 1 } }
                );
        } else if (userLang[userID] === lang) {
            return true;
        } else if (lang !== defaultLang && !userLang[userID]) {
            userLang[userID] = lang;
            updateData = await database.client.db(database.databaseName).collection(
                database.userCollection).updateOne(
                    { userID: userID }, { $set : { [lang] : lang } }
                );
        }
        return updateData;
    }
}

const extrasDbFunctions = new extrasDb();
module.exports = { extrasDbFunctions };