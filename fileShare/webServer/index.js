
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

const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const port = process.env.PORT || 3000;

// Create an Express application
const app = express();

// Serve static files from the 'template' directory
app.use(express.static(path.join(__dirname, 'template')));

/**
 * Middleware to handle dynamic routes for all paths.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
const handleDynamicRoutes = async (req, res) => {
    try {
        // Extract path from the URL
        const urlPath = req.path;

        // Construct the file path based on the URL path
        const filePath = path.join(__dirname, 'templates', urlPath, 'index.html');

        // Check if the file exists
        await fs.access(filePath);

        // If the file exists, send it as a response
        res.sendFile(filePath);
    } catch (error) {
        // If the file does not exist, redirect to the home page
        res.redirect('/home');
    }
};

// Define dynamic route for all paths
app.get('*', handleDynamicRoutes);

  /**
   * Start the Express server.
   * @returns {Promise<void>} A promise indicating the success or failure of server startup.
   */
  const startServer = async () => {
    try {
        await app.listen(port);
        console.log(`Server is running at http://localhost:${port}`);
    } catch (error) {
        console.error('Error starting the server:', error.message);
    }
};

// Run the server when the script is executed
if (require.main === module) {
    startServer();
}

// Export the Express app for testing or use in other modules
module.exports = app;


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