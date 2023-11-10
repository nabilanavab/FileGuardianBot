

module.exports = function(client){
    client.addEventHandler((update) => {
        if (update && update.message && update.message.message){
            console.log("Received new Update");
            console.log(update.message.message);
        }
    });
}