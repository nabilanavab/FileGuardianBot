const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const port = process.env.PORT || 3000;

// Serve static files from the 'templates' directory
express().use(express.static(path.join(__dirname, 'templates')));

// Middleware to serve dynamic content based on URL path
express()
  .use(async (req, res, next) => {
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
      // If the file does not exist, pass the request to the next middleware
      next();
    }
  })
  .use((req, res) => {
    // Middleware for handling 404 errors
    res.status(404).send('Not Found');
  })
  .listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Public URL: http://localhost:${port}`);
  });
