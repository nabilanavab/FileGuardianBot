

const user_activity = require("./user_activity");


/**
 * Function to check if a user is in the array
 * @param {string} userId  - The ID of the user to be checked
 * @returns {boolean}      - True if the user is in the array, false otherwise
 */
module.exports = function (userId) {
    return user_activity.some(
        user => user.userId === userId
    );
}
  