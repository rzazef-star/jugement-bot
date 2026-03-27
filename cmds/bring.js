const whitelist = require("../whitelist");
const config = require("../config.json");

module.exports = {
    name: "bring",
    async execute(message, args, client) {

  
        if (message.author.id !== config.owner && !whitelist.isWhitelisted(message.author.id))
            return message.reply(" Whitelist Only");

        const channel = message.member.voice.channel;
        if (!channel) return message.reply("Rejoin Une Vocal");

        let moved = 0;

        message.guild.members.cache.forEach(member => {
            if (member.voice.channel && member.voice.channel.id !== channel.id) {
                member.voice.setChannel(channel).catch(() => {});
                moved++;
            }
        });

        message.channel.send(` ${moved} Membre Bring`);
    }
};