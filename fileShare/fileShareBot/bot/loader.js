
const file_name = __dirname
const author = "@nabilanavab"

const { triggerAsyncId } = require('async_hooks');
const fs = require('fs');
const path = require('path');
const { client } = require('telegram');


// List all JavaScript files in the directory and its subdirectories
function moduleLoader(client){
    const root = path.join(__dirname, 'plugins');
    const filesToLoad = [];

    fs.readdirSync(root).forEach((file) => {
        const filePath = path.join(root, file);
        if (fs.statSync(filePath).isDirectory()) {
            walkSync(filePath);
        } else if (file.endsWith('.js')) {
            filesToLoad.push(filePath);
        }
    });

    for (const modulePath of filesToLoad){
        try {
            const loadedModule = require(modulePath);
            loadedModule(client);
        } catch (error) {
            console.error(`-> Some Error when importing from ${modulePath}`);
            console.error("-> An error occurred:", error.message);
            console.error("-> Stack trace:", error.stack);

            const indexToRemove = filesToLoad.indexOf(modulePath);
            
            if (indexToRemove !== -1) {
                filesToLoad.splice(indexToRemove, 1);
            }
        }
    }

    console.log(`loaded ${filesToLoad.join(', ')}`);
}

module.exports = { moduleLoader }
