

const https = require('https');
const { TOKEN_SUPPORT } = require("../../../config");

async function shortenLink({ url }) {

    console.log(url)

    return new Promise((resolve, reject) => {

        const options = {
            hostname: TOKEN_SUPPORT.DOMAIN,
            path: `/api?api=${TOKEN_SUPPORT.API}&url=${url}`,
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

async function shortLink( url ) {
    try {
        const shortenedUrl = await shortenLink(url);
        return shortenedUrl
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return false;
    }
}

module.exports = shortLink;