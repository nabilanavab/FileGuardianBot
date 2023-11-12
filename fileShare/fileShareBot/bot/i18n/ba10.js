

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


async function createButton(
    {button, order=maxClmnForButton}
){
    let temp_button = [];

    if(Object.keys(dictionary).length <= 0){
        return temp_button;
    };

    for (const key in button) {
        // console.log(key, button[key]);
        let type="callback", value=button[key];
        if (elements.some(element => button[key].startsWith(element))){
            type="url"
        } else if (button[key].startsWith(":")){
            type="query"; value=value.slice(1);
        }

        if (type="url") {
            temp_button.push(
                Button.url(text=key, url=button[key])
            )
        } else if (type="callback") {
            temp_button.push(
                Button.inline(text=key, data=button[key])
            )
        } else if (type=""){
            temp_button.push(
                Button.inline(text=key, data=value)
            )
        }

    };

    if (order === maxClmnForButton) {
        const keyboard = [];
        for (let i = 0; i < button.length; i += maxClmnForButton) {
            keyboard.push(button.slice(i, i + maxClmnForButton));
        }
    } else {
        const newOrder = order.toString().split('').map(Number);
        const buttonIterator = button[Symbol.iterator]();
    
        const keyboard = newOrder.map(elem => Array.from(
            { length: elem }, () => buttonIterator.next().value)
        );
    }    

    return keyboard
}

module.exports = {
    maxClmnForButton, createButton
}