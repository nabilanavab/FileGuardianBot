

const config = require("../../../config")
const { Api } = require('telegram');

const moduleSub = async (client) => {
    if (!config.CHANNEL_INFO.FORCE_SUB && !config.CHANNEL_INFO.REQUEST_URL){
        return true;
    }
    if (config.CHANNEL_INFO.FORCE_SUB) {
        let result = await client.invoke(new Api.channels.GetParticipant({
            channel: config.CHANNEL_INFO.FORCE_SUB,
            userId: client.message.chatId,
        }));

        console.log(result);

        return result;
    }
};

module.exports = { moduleSub };