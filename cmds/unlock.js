const { PermissionFlagsBits } = require("discord.js");
const config = require("../config.json");
const whitelist = require("../whitelist");

module.exports = {
    name: "unlock",
    async execute(message) {

        if (
            message.author.id !== config.owner &&
            !whitelist.includes(message.author.id)
        ) return message.reply("Whitelist only.");

        await message.channel.permissionOverwrites.edit(
            message.guild.roles.everyone,
            { SendMessages: true }
        );

        message.reply(" Salon unlock.");
    }
};