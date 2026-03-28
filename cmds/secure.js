const fs = require("fs");
const config = require("../config.json");

module.exports = {
    name: "secure",
    async execute(message, args) {

        if (!config.owners.includes(message.author.id))
            return message.channel.send("Owner only");

        const secure = JSON.parse(fs.readFileSync("./secure.json"));

        if (args[0] === "on") {
            secure.enabled = true;
            fs.writeFileSync("./secure.json", JSON.stringify(secure, null, 2));
            return message.channel.send("Secure ON");
        }

        if (args[0] === "off") {
            secure.enabled = false;
            fs.writeFileSync("./secure.json", JSON.stringify(secure, null, 2));
            return message.channel.send("Secure OFF");
        }

        message.channel.send("+secure on / off");
    }
};
