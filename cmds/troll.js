const whitelist = require("../whitelist");
const config = require("../config.json");

module.exports = {
    name: "troll",
    execute(message) {

        // owner OU whitelist
        if (message.author.id !== config.owner && !whitelist.isWhitelisted(message.author.id))
            return message.reply("Only WhiteList !!");

        message.channel.send("youtube.com/watch?v=EXYj9wecau4");
    }
};