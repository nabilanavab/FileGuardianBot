

const fs = require('fs');
const path = require('path');

root = "./plugins"

// List all JavaScript files in the directory and its subdirectories
const modules = [];

function walkSync(dir) {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walkSync(filePath);
        } else if (file.endsWith('.js')) {
            modules.push(filePath);
        }
    });
}
walkSync(root);

// Load and inspect modules
for (const modulePath of modules) {
    try {
        const module = require(modulePath);
    } catch (error) {
        console.log(`Some Error when importing from ${modulePath}`);
        
    }
}

console.log(`loaded ${modulePath.join(', ')}`);