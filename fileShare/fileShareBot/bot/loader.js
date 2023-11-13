
const file_name = __dirname
const author = "@nabilanavab"

const fs = require('fs');
const path = require('path');


const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        walkSync(filePath, filelist);
      } else if (file.endsWith('.js')) {
        filelist.push(filePath);
      }
    });
    return filelist;
  };
  
  // Now you can use the `walkSync` function within your `moduleLoader` function.
  const moduleLoader = (client) => {
    const root = path.join(__dirname, 'plugins');
    const filesToLoad = walkSync(root);
  
    for (const modulePath of filesToLoad) {
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
  
    // Print completely loaded files
    console.log("loaded: " + filesToLoad.map((file) => file.split('/').pop()).join(', '));
  };
  

module.exports = moduleLoader;