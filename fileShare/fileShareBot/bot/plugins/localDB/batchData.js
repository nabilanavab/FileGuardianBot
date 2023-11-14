


// isBatch saves all users data in /batch queue
const isBatch = [
    {
        "id" : 786,
        "userData" : {}
    }
];

isBatchUser = (userId) => {
    return isBatch.some((user) => user.id === userId);
};

module.exports = {
    isBatch, isBatchUser
};