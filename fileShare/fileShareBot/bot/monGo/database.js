
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

const { MongoClient, ServerApiVersion } = require('mongodb');
const { DATABASE } = require("../../config");
const logger = require('../../logger');
const { userLang } = require("../i18n/data")
const { generateInfo } = require("../plugins/localDB/generData");


// uri : "mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&w=majority";

class Database {
    constructor(uri, databaseName) {
        this.client = new MongoClient(
            uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                },
            }
        );
        this.databaseName = databaseName;
        this.userCollection = 'users';
    }

    async connect() {
        try {
            await this.client.connect();

            let result = await this.client.db(this.databaseName).collection(
                this.userCollection).find({ lang: { $exists: true } }).toArray();

            result.forEach(user => {
                userLang[user.userID] = user.lang;
            });

            result = await this.client.db(this.databaseName)
                .collection(this.userCollection)
                .find({ userID: { $exists: true } })
                .toArray();

            result.forEach(user => {
                let userId = user.userID;

                if (!generateInfo[userId]){
                    generateInfo[userId] = {};
                }

                Object.keys(user).forEach(key => {
                    if ( key !== 'join_date' && key !== 'lang'
                        && key !== '_id' && key !== 'userID' ) {
                        generateInfo[userId][key] = user[key];
                    }
                });
            });

            logger.log('error', 'Database connected perfectly..')

        } catch (error) {
            logger.log('error', `Error during Database Connection: ${error}`);
            throw error; // You might want to throw the error to handle it elsewhere.
        }
    }
}


if (DATABASE.MONGODB_URI) {
    const database = new Database(DATABASE.MONGODB_URI, OWNER);
    (async () => {
        try {
            await database.connect();
        } catch (error) {
            DATABASE.MONGODB_URI = null;
        }
    })();

    module.exports = database;
}

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