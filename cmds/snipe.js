const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "snipe",
    execute(message, args, client) {

        const snipe = client.snipes.get(message.channel.id);
        if (!snipe) return message.reply("Aucun Message A Snipe");

        const timeAgo = Math.floor((Date.now() - snipe.time) / 1000);

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`${snipe.author} A Envoyer "${snipe.content}" il y'a ${timeAgo}s`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};