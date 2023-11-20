
const crypto = require("crypto");
const logger = require("../../../logger");
const algorithm = "aes-192-cbc";
const fixedIV = Buffer.from('7860786078607860');


/**
 *  Helps to Decrypt aes-192-cbc string to Text
 *
 * @param {string} text The first number
 * @returns {string} The sum of a and b
 * 
 * @example
 * decrypt(text)
 */

async function decrypt(code, userID){
    try {
        let key = generateInfo[userID][addPassword]
        if ( !key ){
            key = OWNER
        }
        key = crypto.scryptSync(key, 'nabilanavab', 24);
        let decipher = crypto.createDecipheriv(algorithm, key, fixedIV);
        let decrypted = decipher.update(code, 'hex', 'utf8') + decipher.final('utf8');
        return decrypted;
    } catch (error) {
        logger.log('error', `Error in Decrypting: ${error.message}`);
        return false;
    }
}
 
// var decipher = crypto.createDecipher(algorithm, secretKey);
// var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
// console.log('Decrypted:', decrypted);

module.exports = decrypt