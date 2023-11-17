

// saves all user data except language [lang]

const generateInfo = {
    1234567 : {
        isProtected : true,
        isAccesable : true,
        addPassword : "password",
    }, 
    12345678 : {
        'isProtected' : true,
        // not all attributes will be added to all users
        // false values never be added [ prevent unwanted wastage of memory]
    }
}

module.exports = { generateInfo };
