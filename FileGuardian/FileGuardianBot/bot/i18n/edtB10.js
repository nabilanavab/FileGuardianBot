
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

const util = require('util');

/**
 * 
 * Edits a dictionary based on provided conditions.
 * front : user INterface
 * value : if you pass any single value then {} will be replaced by the value in key[value]
 * 
 * @param {object} inDict - Input dictionary.
 * @param {any} [value=false] - Value used for formatting dictionary values.
 * @param {boolean} [front=false] - Flag indicating whether to change cb in UI.
 * @returns {object} - Edited dictionary.
 * 
 */

async function editDict({ inDict, value = false, front = false }) {
    try {
        let outDict = {};

        if (front) {
            // Changes cb in UI
            for (const [i, j] of Object.entries(inDict)) {
                try{
                    const modifiedKey = i.replace('%s', front);
                    outDict[modifiedKey] = j;
                } catch (error){
                    outDict[i] = j;
                }
            }
            inDict = outDict;
        }

        if (value && !Array.isArray(value)) {
            // Changes cb.data
            for (const [i, j] of Object.entries(inDict)) {
                // outDict[i] = util.format(j, value);
                outDict[i] = j.replace('%s', value);
            }
        } else if (Array.isArray(value)) {
            const valueLength = value.length;

            for (let [index, [i, j]] of Object.entries(Object.entries(inDict))) {
                index = parseInt(index);
                if (index < valueLength) {
                    outDict[i] = util.format(j, value[index]);
                } else {
                    outDict[i] = j;
                }
            }
        }
        return outDict;

    } catch ( error ) {

        return inDict;
    
    }
}

module.exports = editDict;

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