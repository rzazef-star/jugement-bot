const { EmbedBuilder } = require("discord.js");
const whitelist = require("../whitelist");
const config = require("../config.json");

module.exports = {
    name: "stat",
    execute(message) {

        if (message.author.id !== config.owner && !whitelist.isWhitelisted(message.author.id))
            return message.reply(" whitelist Only");

        const guild = message.guild;

        const voiceMembers = guild.members.cache.filter(m => m.voice.channel).size;
        const members = guild.memberCount;
        const boosts = guild.premiumSubscriptionCount;

        const embed = new EmbedBuilder()
            .setTitle("📊 Statistiques du serveur")
            .setColor("#2b2d31")
            .addFields(
                { name: "🎤 Vocal", value: `\`${voiceMembers}\` personnes`, inline: true },
                { name: "👥 Membres", value: `\`${members}\``, inline: true },
                { name: "🚀 Boosts", value: `\`${boosts}\``, inline: true }
            )
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setFooter({ text: guild.name })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};