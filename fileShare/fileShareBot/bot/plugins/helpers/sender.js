

// if unicone number is true directly send the file from
// code no need to get one after that other

const { Api, errors } = require("telegram")
const { generateInfo } = require("../localDB/generData")



async function forwardMessages({ client, messageIds }) {

    try {
        for (const messageId of messageIds) {
            try {
                const result = await client.invoke(
                    new Api.messages.ForwardMessages({
                        fromPeer: "username",
                        toPeer: "username",
                        withMyScore: true,
                        dropAuthor: true,
                        dropMediaCaptions: true,
                        noforwards: true,
                        sendAs: "username",
                    })
                )
            } catch (error){
                if (error instanceof errors.FloodWaitError){
                    await sleep(error.seconds * 1000)
                }
            }
        }
    } catch (error) {

    }
}