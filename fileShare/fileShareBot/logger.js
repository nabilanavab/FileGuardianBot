
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

