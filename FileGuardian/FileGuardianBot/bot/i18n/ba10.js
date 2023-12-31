
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

const { Button } = require("telegram/tl/custom/button");

const maxClmnForButton = 2;
const elements = ["http://", "https://"]

/**
 * This function converts a dictionary into buttons. Depending on the
 * dictionary's values, it determines the type of buttons needed.
 * 
 * @param {object} button                   - An object containing button values.
 * @param {number} [order=maxClmnForButton] - The maximum number of button columns 
 *                                            (default: 2).
 * 
 * @returns {object} - Returns an object.
 */

createButton = async function(
    { button, order=maxClmnForButton }
){
    let temp_button = [];

    if(Object.keys(button).length <= 0){
        return temp_button;
    };

    for (const key in button) {
        // console.log(key, button[key]);
        let type="callback", value=button[key];
        if (elements.some(element => value.startsWith(element))){
            // all links starts with http, https are treated as url
            type="url"; value=value;
        } else if (value.startsWith(":")){
            // startWith (:) will be treated as inline_query
            type="query"; value=value.slice(1);
        }

        if (type==="url") {
            temp_button.push(
                Button.url(text=key, url=value)
            )
        } else if (type==="callback") {
            value=Buffer.from(value.toString());
            temp_button.push(
                Button.inline(text=key, data=value===0?undefined:value)
            )
        } else if (type==="query"){
            temp_button.push(
                Button.switchInline(text=key, query=value, samePeer=true)
            )
        }
    };

    let keyboard = [];

    if (order === maxClmnForButton) {
        for (let i = 0; i < temp_button.length; i += maxClmnForButton) {
            keyboard.push(temp_button.slice(i, i + maxClmnForButton));
        }
    } else {
        let newOrder = order.toString().split("").map(Number);
        let buttonIterator = temp_button[Symbol.iterator]();

        keyboard = newOrder.map(elem => {
            let subArray = [];

            for (let i = 0; i < elem; i++) {
                subArray.push(buttonIterator.next().value);
            }

            return subArray;
        });
    }

    return keyboard ? keyboard : null;
}

module.exports = {
    maxClmnForButton, createButton
}

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