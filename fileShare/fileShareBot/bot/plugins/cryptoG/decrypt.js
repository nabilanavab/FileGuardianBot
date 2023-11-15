
const crypto = require("crypto");

const algorithm = "aes-192-cbc";
const key = crypto.scryptSync('nabilanavab', 'nabil_Ji', 24);
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

async function decrypt(text){
    try {
        let decipher = crypto.createDecipheriv(algorithm, key, fixedIV);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    } catch (error) {
        logger.log('error', `Error in Decrypting: ${error.message}`);
        throw error;
    }
}
 
// var decipher = crypto.createDecipher(algorithm, secretKey);
// var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
// console.log('Decrypted:', decrypted);

module.exports = decrypt