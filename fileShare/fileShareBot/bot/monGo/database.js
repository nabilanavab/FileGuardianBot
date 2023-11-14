

const { MongoClient, ServerApiVersion } = require('mongodb');
const { DATABASE } = require("../../config");
const logger = require('../../logger');


// uri : "mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&w=majority";

class Database {
    constructor(uri, databaseName) {
        this.client = new MongoClient(
            uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
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
            logger.log('info', 'Connected to the database.');
        } catch (error) {
            logger.log('error', `Error during Database Connection: ${error}`);
            throw error; // You might want to throw the error to handle it elsewhere.
        }
    }
}


if (DATABASE.URI) {
    const database = new Database(
        {
            uri: DATABASE.URI,
            databaseName: OWNER
        }
    );
    (async () => {
        try {
            await database.connect();
    
        } catch (error) {
            DATABASE.URI = null
        }
    })();
} else {
    const database = null;
}

module.exports = database;