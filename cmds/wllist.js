const whitelist = require("../whitelist");
const config = require("../config.json");
const fs = require("fs");

module.exports = {
    name: "wllist",
    execute(message) {

        if (message.author.id !== config.owner)
            return;

        const data = JSON.parse(fs.readFileSync("./whitelist.json"));
        message.reply("Whitelist:\n" + data.users.join("\n"));
    }
};