const whitelist = require("../whitelist");
const config = require("../config.json");

module.exports = {
    name: "wlremove",
    execute(message, args) {

        if (message.author.id !== config.owner)
            return message.reply("owner Only");

        const user = message.mentions.users.first();
        if (!user) return message.reply("@user");

        whitelist.remove(user.id);
        message.reply(`✅ ${user.tag} removed`);
    }
};