const fs = require("fs");
const config = require("../config.json");

module.exports = {
    name: "secure",
    async execute(message, args) {

        if (!config.owners.includes(message.author.id))
            return message.reply("Only Owner !");

        if (!args[0]) 
            return message.reply("Usage: +secure on / off");

        const data = JSON.parse(fs.readFileSync("./secure.json"));

        if (args[0] === "on") {
            data.enabled = true;
            fs.writeFileSync("./secure.json", JSON.stringify(data, null, 2));
            return message.reply(" Secure ON");
        }

        if (args[0] === "off") {
            data.enabled = false;
            fs.writeFileSync("./secure.json", JSON.stringify(data, null, 2));
            return message.reply(" Secure OFF");
        }

        message.reply("Usage: +secure on / off");
    }
};
