

const user_activity = require("./user_activity");
const { TOKEN_SUPPORT } = require("../../../config");


/**
 * Function to remove user data from the array
 * @param {string} userId - The ID of the user to be removed from the array
 */
async function removeUserFromDataArray({ userId }) {
    const index = user_activity.findIndex(
        user => user.userId === userId
    );
    if (index !== -1) {
        userDataArray.splice(index, 1);
    }
}


module.exports = async function({ userId }) {
    try{
        // Add user data to the array
        userDataArray.push({
            userId: userId,
            timestamp: Date.now(),
        });

        setTimeout(() => {
            removeUserFromDataArray(userId);
        }, TOKEN_SUPPORT.EXPIRATION_TIME);

        return true
    } catch (error){
        return false
    }
}

