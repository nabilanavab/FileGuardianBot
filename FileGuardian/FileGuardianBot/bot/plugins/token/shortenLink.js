

const https = require('https');

async function shortenLink(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url, // Replace with the actual API hostname
      path: '/some/endpoint',
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      let data = '';

      // A chunk of data has been received.
      res.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      res.on('end', () => {
        try {
          // Parse the JSON response
          const jsonResponse = JSON.parse(data);

          // Check if the response has the expected property
          if (jsonResponse.shortenedUrl) {
            const shortenedUrl = jsonResponse.shortenedUrl;
            resolve(shortenedUrl);
          } else {
            // If the response is missing the expected property, reject with an error
            reject(new Error('Invalid JSON response format'));
          }
        } catch (error) {
          // If parsing fails, reject with an error
          reject(new Error('Error parsing JSON response'));
        }
      });
    });

    // Handle errors during the request
    req.on('error', (error) => {
      // Reject with an error
      reject(new Error(`Error making the request: ${error.message}`));
    });

    // End the request
    req.end();
  });
}

async function shortLink() {
  try {
    const shortenedUrl = await shortenLink('https://example.com');
    console.log(`Shortened URL: ${shortenedUrl}`);
  } catch (error) {
    // Handle the error and return false
    console.error(`Error: ${error.message}`);
    return false;
  }
}

module.exports = shortLink;