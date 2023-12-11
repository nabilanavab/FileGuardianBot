
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

// saves all user data except language [lang]

/*
* properties of forward messages [attributes]
*
* dropAuthor: Whether to forward messages without quoting the original author
* dropMediaCaptions : Whether to strip captions from media
* noforwards: Only for bots, disallows further re-forwarding and saving of the messages
* 
* setPassword: custom password
* isAccesable: can make it offline [without deleting]
*/

const generateInfo = {
    1234567 : {
        dropAuthor : true,
        noforwards : true,
        isAccesable : true,
        setPassword : "hey there",
        dropMediaCaptions : true,
    }, 
    12345678 : {
        dropAuthor : true,
        // not all attributes will be added to all users
        // false values never be added [ prevent unwanted wastage of memory]
    },
    531733867 : {
        dropAuthor : true,
        // noforwards : true,
        // setPassword : "hey there",
    }
}

module.exports = { generateInfo };

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