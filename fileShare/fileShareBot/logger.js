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


const LOG_FILE = require("./config")
const { createLogger, transports, format } = require('winston');

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const customTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    // Adding 1 to month because it's zero-based
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const logger = createLogger({
    levels: logLevels,
    format: format.combine(
        format.timestamp(
            { format: customTimestamp }
        ),
        format.json()
    ),
    transports: [],
});

// Function to add a log file (if enabled)
if (LOG_FILE.LOG_FILE.FILE_NAME){
    logger.add(new transports.File({filename: `${LOG_FILE.LOG_FILE.FILE_NAME}`}));
}
if(LOG_FILE.LOG_FILE.CONSOLE_LOG){
    logger.add(new transports.Console())
};

module.exports = logger;

/**
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