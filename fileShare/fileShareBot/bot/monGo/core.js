

// This file contains basic or mandatory functions
const { LANG_INFO } = require("../../config")
const database = require("./database")

class coreFunctions{

    async isUserExist({userID, elseAdd=false}){
        //
        // elseAdd contain info of user like
        //    {
        //        "name" : "user_name",
        //        "lang" : "lang_code"
        //    }
        //
        let user = await database.db(OWNER).collection('users').findOne(
            { userID: parseInt(userID) }
        );
        if (!elseAdd){
            return user;
            // use return !!user to send bool
        } else {
            let document = {
                id: userID,
                namE: elseAdd.name,
                join_date: new Date().toISOString()
            }
            if (elseAdd.langCode !== LANG_INFO.DEFAULT_LANG){
                document.lang = elseAdd.lang
            }
            let user = await database.db(OWNER).collection('users').insertOne(document);
            return user;
        }
    }
    
}

module.exports = coreFunctions;