
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

const crypto = require("crypto");
const logger = require("../../../logger");
const algorithm = "aes-192-cbc";
const fixedIV = Buffer.from('7860786078607860');
const { generateInfo } = require("../localDB/generData");


/**
 *  Helps to Decrypt aes-192-cbc string to Text
 *
 * @param {string} text The first number
 * @returns {string} The sum of a and b
 * 
 * @example
 * decrypt(text)
**/

async function decrypt({ code, userID }){
    try {
        let key
        if ( generateInfo[userID] && generateInfo[userID]['addPassword'] ){
            key = generateInfo[userID]['addPassword'];
        } else {
            key = OWNER;
        }
        key = crypto.scryptSync(key, 'nabilanavab', 24);
        let decipher = crypto.createDecipheriv(algorithm, key, fixedIV);
        let decrypted = decipher.update(code, 'hex', 'utf8') + decipher.final('utf8');
        return decrypted;
    } catch (error) {
        throw "error in code";
    }
}
 
// var decipher = crypto.createDecipher(algorithm, secretKey);
// var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
// console.log('Decrypted:', decrypted);

module.exports = decrypt

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