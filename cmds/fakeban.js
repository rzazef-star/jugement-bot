const { EmbedBuilder } = require("discord.js");
const whitelist = require("../whitelist");
const config = require("../config.json");

module.exports = {
    name: "fakeban",
    execute(message, args) {

        if (message.author.id !== config.owner && !whitelist.isWhitelisted(message.author.id))
            return message.reply("WhiteList Only");

        const user = message.mentions.users.first();
        if (!user) return message.reply(" @user ");

        const embed = new EmbedBuilder()
            .setTitle("🔨 Ban")
            .setColor("Red")
            .setDescription(`${user} a été banni du serveur.`)
            .addFields(
                { name: "Modérateur", value: `${message.author}`, inline: true },
                { name: "Raison", value: "Violation des règles", inline: true }
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};