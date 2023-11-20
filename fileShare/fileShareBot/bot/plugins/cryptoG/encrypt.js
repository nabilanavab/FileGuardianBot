

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

async function encrypt({text, userID}) {
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
        logger.log('error', `Error in Encrypting: ${error.message}`);
        return false
    }
}

// let cipher = crypto.createCipher(algorithm, secretKey);
// let encrypted = cipher.update('45678', 'utf-8', 'hex');
// encrypted += cipher.final('hex');
// console.log('Encrypted:', encrypted);

module.exports = encrypt;