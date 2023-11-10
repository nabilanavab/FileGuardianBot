

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

