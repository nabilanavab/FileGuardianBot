

const { Button } = require("telegram/tl/custom/button");


const maxClmnForButton = 2;
const elements = ["http://", "https://"]

/**
 * This function converts a dictionary into buttons. Depending on the dictionary's values,
 * it determines the type of buttons needed.
 * 
 * @param {object} button - An object containing button values.
 * @param {number} [order=maxClmnForButton] - The maximum number of button columns (default: 2).
 * 
 * @returns {object} - Returns an object.
 */


function createButton(button, order=maxClmnForButton){
    let return_button = [];

    if(Object.keys(dictionary).length <= 0){
        return return_button;
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
            return_button.push(
                Button.url(text=key, url=button[key])
            )
        } else if (type="callback") {
            return_button.push(
                Button.inline(text=key, data=button[key])
            )
        } else if (type=""){
            return_button.push(
                Button.inline(text=key, data=value)
            )
        }

    };

    return return_button
}

module.exports = {
    maxClmnForButton, createButton
}