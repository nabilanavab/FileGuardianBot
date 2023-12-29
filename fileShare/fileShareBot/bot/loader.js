
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
    'localDB', 'excludeFile.js', 'cryptoG', 'callBack',
    'helpers', 'util', "__init__.js", "scheduler"
];
const moduleLoader = async (client) => {
    const root = path.join(__dirname, 'plugins');
    const filesToLoad = walkSync(root, [], excludeList);

    for (const modulePath of filesToLoad) {
        try {
            let loadedModule = require(modulePath);
            await loadedModule(client);
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

    const loadedFileNames = filesToLoad.map((file) => path.basename(file));
    console.log("loaded: " + loadedFileNames.join(', '));
    // Print completely loaded files [below code will print complete path]
    // console.log("loaded: " + filesToLoad.map((file) => file.split('/').pop()).join(', '));
};
  

module.exports = moduleLoader;

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