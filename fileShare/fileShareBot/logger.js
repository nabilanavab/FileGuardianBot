
const LOG_FILE = require("./config")
const { createLogger, transports, format } = require('winston');

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const logger = createLogger({
    levels: logLevels,
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
    ],
});

// Function to add a log file (if enabled)
let file_name = LOG_FILE.LOG_FILE.FILE_NAME
if (file_name){
  logger.add(new transports.File({file_name}));
}

module.exports = {
    logger
};

