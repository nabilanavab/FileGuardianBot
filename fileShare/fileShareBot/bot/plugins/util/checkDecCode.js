
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

const decrypt = require("../cryptoG/decrypt");
const decryptSingle = require("./decryptSingle");
const decryptBatch = require("./decryptBatch");


async function checkDecCode({client, code, userID}) {
    try {
        code = await decrypt({
            code: code, userID: userID
        });

        if (!code){
            return "cant perform funcion error in url"
        }

        if ( !isNaN(Number(code)) ){
            // If the result is a valid number and not NaN
            await decryptSingle({client: client, code: code, userID: userID})
        } else {
            await decryptBatch()
        }
        return true

    } catch ( error ){
        console.log(error);
        return false 
    }
}

module.exports = checkDecCode;

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