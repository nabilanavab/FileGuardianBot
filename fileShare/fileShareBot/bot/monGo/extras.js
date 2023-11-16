

// features that are not crucial for the core functionality
const { LANG_INFO } = require("../../config");
const database = require("./database");
const { userLang } = require("../i18n/data");
const { generateInfo } = require("../plugins/localDB/generData");


class extrasDb {
    async changeLang({ userID, lang = LANG_INFO.DEFAULT_LANG }) {
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

    async changeData({ userID, key, value = false, deleteIt = false }) {
        let updateData;

        if ( deleteIt || !value ){
            // not all attributes will be added to all users
            // false values never be added [ prevent unwanted wastage of memory]
            if (deleteIt) delete generateInfo[userID];
            else delete generateInfo[userID][key];
            updateData = await database.client.db(database.databaseName).collection(
                database.userCollection).updateOne(
                    { userID: userID }, { $unset : { key : 1 } }
                );
        } else {
            generateInfo[userID][key] = value;
            updateData = await database.client.db(database.databaseName).collection(
                database.userCollection).updateOne(
                    { userID: userID }, { $set : { key : value } }
                );
        }
    }
}

const extrasDbFunctions = new extrasDb();
module.exports = { extrasDbFunctions };