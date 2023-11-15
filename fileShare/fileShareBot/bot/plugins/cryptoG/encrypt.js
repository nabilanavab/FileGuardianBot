

const crypto = require("crypto");

const algorithm = "aes-192-cbc";
const key = crypto.scryptSync('nabilanavab', 'nabil_Ji', 24);
const fixedIV = Buffer.from('7860786078607860');


/**
 * Helps to Encrypt Text to aes-192-cbc string
 *
 * @param {string} text The first number
 * @returns {string} The sum of a and b
 * 
 * @example
 * encrypt(text)
 */

async function encrypt(text) {
    try {
        let cipher = crypto.createCipheriv(algorithm, key, fixedIV);
        let encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
        return encrypted;
    } catch (error) {
        // Handle errors
        logger.log('error', `Error in Encrypting: ${error.message}`);
        throw error;
    }
}

// let cipher = crypto.createCipher(algorithm, secretKey);
// let encrypted = cipher.update('45678', 'utf-8', 'hex');
// encrypted += cipher.final('hex');
// console.log('Encrypted:', encrypted);

module.exports = encrypt;