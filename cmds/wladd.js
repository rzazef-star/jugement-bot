const whitelist = require("../whitelist");
const config = require("../config.json");

module.exports = {
    name: "wladd",
    execute(message, args) {

        if (!config.owners.includes(message.author.id))
            return message.channel.send("Owner only");

        const user = message.mentions.users.first();
        if (!user) return message.channel.send("Mention quelqu'un");

        whitelist.add(user.id);

        message.channel.send(`${user.tag} ajouté WL`);
    }
};
