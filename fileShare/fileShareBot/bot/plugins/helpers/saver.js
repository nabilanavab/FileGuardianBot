

const logger = require("../../../logger");
const config = require("../../../config");
const { Api } = require('telegram');
const getLang = require("../i18n/utils");
const translate = require("../i18n/t9n");
const editDict = require("../i18n/edtB10");

const saver = async ({client, update }) => {
    try {
        if (unicornMagicNumber) {
            forwardMsg = await client.forwardMessages(
                LOG_FILE.LOG_CHANNEL, {
                    messages : update.message.id,
                    dropAuthor : true,
                    noforwards: true,
                }
            )
            messageInfo = `${forwardMsg[0].id}`
        } else {
            messageInfo = `${update.message.id}|${update.message.chatId.value}`
        }
    } catch (error) {

    }
};

module.exports = saver