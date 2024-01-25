

const https = require('https');
const { BOT_INFO, CHANNEL_INFO } = require("../../../config");

async function approveChatJoinRequest(userId) {

    const requestData = JSON.stringify({ chat_id: CHANNEL_INFO.FORCE_SUB, user_id: userId });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${BOT_INFO.API_TOKEN}/approveChatJoinRequest`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestData),
        },
    };

    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
    
        res.on('data', (d) => {
            console.log(d);
        });
    });   
}

module.exports = approveChatJoinRequest;