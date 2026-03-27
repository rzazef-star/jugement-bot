const whitelist = require("../whitelist");
const config = require("../config.json");

module.exports = {
    name: "wladd",
    execute(message, args) {

        if (message.author.id !== config.owner && !whitelist.has(message.author.id))
            return message.reply("wl only");

        const user = message.mentions.users.first();
        if (!user) return message.reply("@user");

        whitelist.add(user.id);
        message.reply(`${user.tag} add to wl`);
    }
};