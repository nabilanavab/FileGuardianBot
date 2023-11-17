
const file_name = __dirname
const author = "@nabilanavab"

const fs = require('fs');
const path = require('path');


const walkSync = (dir, filelist = [], exclude = []) => {
    const files = fs.readdirSync(dir);
  
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const isDirectory = fs.statSync(filePath).isDirectory();
    
        if (exclude.includes(file)) {
            // Exclude specified files or folders
            return;
        }
    
        isDirectory
            ? walkSync(filePath, filelist, exclude)
            : filelist.push(filePath);
        });
  
    return filelist;
};
  

const excludeList = [
    'localDB', 'excludeFile.js', 'cryptoG', 'callBack'
];
const moduleLoader = async (client) => {
    const root = path.join(__dirname, 'plugins');
    const filesToLoad = walkSync(root, [], excludeList);

    for (const modulePath of filesToLoad) {
        try {
            let loadedModule = require(modulePath);
            let result = await loadedModule(client);
            console.log(result);
            if (result){
                break;
            }
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

    // Print completely loaded files
    console.log("loaded: " + filesToLoad.map((file) => file.split('/').pop()).join(', '));
};
  

module.exports = moduleLoader;