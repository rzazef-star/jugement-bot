const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "renew",
    async execute(message) {

        if (!message.member.permissions.has("ManageChannels"))
            return message.reply("WhiteList Only");

        const channel = message.channel;
        const position = channel.position;
        const parent = channel.parent;

        await channel.clone().then(async (newChannel) => {
            await newChannel.setPosition(position);
            if (parent) await newChannel.setParent(parent);

            await channel.delete();

            const embed = new EmbedBuilder()
                .setDescription(` Le salon ${newChannel} a été renew par ${message.author}`)
                .setColor("Green")
                .setTimestamp();

            newChannel.send({ embeds: [embed] });
        });
    }
};