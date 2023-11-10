

const fs = require('fs');
const path = require('path');

root = "./plugins"

// List all JavaScript files in the directory and its subdirectories
const filesToLoad = [];

function walkSync(dir) {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walkSync(filePath);
        } else if (file.endsWith('.js')) {
            filesToLoad.push(filePath);
        }
    });
}
walkSync(root);

// Load filesToLoad
for (const modulePath of filesToLoad) {
    try {
        const module = require(modulePath);
    } catch (error) {
        console.log(`Some Error when importing from ${modulePath}`);

        const indexToRemove = filesToLoad.indexOf(modulePath);
        if (indexToRemove !== -1) {
            filesToLoad.splice(indexToRemove, 1);
        }
    }
}
console.log(`loaded ${filesToLoad.join(', ')}`);

module.exports = { filesToLoad }