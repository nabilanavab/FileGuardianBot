

const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;

// Serving static files from the 'template' directory [py nostu :)]
express().use(express.static(path.join(__dirname, 'template')));

// Set up a route for the homepage
express().get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'template', 'index.html')
    );
});

express().listen(port, () => {
    console.log(`Server Domain Link ${app}`)
    console.log(`Server is running at http://localhost:${port}`);
});
