

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

            if (elseAdd.lang !== LANG_INFO.DEFAULT_LANG) {
                document.lang = elseAdd.lang;
            }

            let newUser = await database.client.db(database.databaseName).collection(
                    database.userCollection).insertOne(document);

            return newUser;
        }
    }
}

const coreDbFunctions = new coreDb();
module.exports = { coreDbFunctions };
