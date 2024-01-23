

const https = require('https');

async function shortenLink(url) {
    return new Promise((resolve, reject) => {
        const options = {
        hostname: url,
        path: '/some/endpoint',
        method: 'GET',
        };

        const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const jsonResponse = JSON.parse(data);

                if (jsonResponse.shortenedUrl) {
                    const shortenedUrl = jsonResponse.shortenedUrl;
                    resolve(shortenedUrl);
                } else {
                    reject(new Error('Invalid JSON response format'));
                }
            } catch (error) {
                reject(new Error('Error parsing JSON response'));
            }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Error making the request: ${error.message}`));
        });

        req.end();
    });
}

async function shortLink() {
    try {
        const shortenedUrl = await shortenLink('https://example.com');
        console.log(`Shortened URL: ${shortenedUrl}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return false;
    }
}

module.exports = shortLink;