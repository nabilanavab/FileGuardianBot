
const crypto = require("crypto");

const algorithm = "aes-192-cbc";
const key = crypto.scryptSync('nabilanavab', 'nabil_Ji', 24);
const fixedIV = Buffer.from('7860786078607860');

async function encrypt(text) {
    try {
        let cipher = crypto.createCipheriv(algorithm, key, fixedIV);
        let encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
        return encrypted;
    } catch (error) {
        // Handle errors
        logger.log('error', `Encryption error: ${error.message}`);
        throw error;
    }
}

async function decrypt(text){
    try {
        const decipher = crypto.createDecipheriv(algorithm, key, fixedIV);
        const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    } catch (error) {
        logger.log('error', `Error in Decrypting: ${error.message}`);
        throw error;
    }
}


// let cipher = crypto.createCipher(algorithm, secretKey);
// let encrypted = cipher.update('45678', 'utf-8', 'hex');
// encrypted += cipher.final('hex');
// console.log('Encrypted:', encrypted);
// 
// var decipher = crypto.createDecipher(algorithm, secretKey);
// var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
// console.log('Decrypted:', decrypted);

module.exports = {
    encrypt, decrypt
}