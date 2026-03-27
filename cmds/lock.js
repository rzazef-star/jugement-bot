const whitelist = require("../whitelist");
const config = require("../config.json");

module.exports = {
    name: "lock",
    async execute(message) {

        if (message.author.id !== config.owner && !whitelist.isWhitelisted(message.author.id))
            return message.reply(" Whitelist Only");

        await message.channel.permissionOverwrites.edit(
            message.guild.roles.everyone,
            { SendMessages: false }
        );

        message.channel.send(" Salon Lock");
    }
};