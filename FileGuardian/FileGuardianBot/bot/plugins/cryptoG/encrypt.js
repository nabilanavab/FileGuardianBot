
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

const crypto = require("crypto");
const logger = require("../../../logger");
const algorithm = "aes-192-cbc";
const fixedIV = Buffer.from('7860786078607860');
const { generateInfo } = require("../localDB/generData")


/**
 * Helps to Encrypt Text to aes-192-cbc string
 *
 * @param {string} text The first number
 * @returns {string} The sum of a and b
 * 
 * @example
 * encrypt(text)
 */

async function encrypt({ text, userID }) {
    try {

        let key
        if ( generateInfo[userID] && generateInfo[userID]['addPassword'] ){
            key = generateInfo[userID]['addPassword'];
        } else {
            key = OWNER;
        }
        key = crypto.scryptSync(key, 'nabilanavab', 24);
        let cipher = crypto.createCipheriv(algorithm, key, fixedIV);
        let encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
        return encrypted;
        
    } catch (error) {
        // Handle errors
        logger.log('error', `${file_name}: ${userID} : ${error}`);
        return false
    }
}

// let cipher = crypto.createCipher(algorithm, secretKey);
// let encrypted = cipher.update('45678', 'utf-8', 'hex');
// encrypted += cipher.final('hex');
// console.log('Encrypted:', encrypted);

module.exports = encrypt;

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