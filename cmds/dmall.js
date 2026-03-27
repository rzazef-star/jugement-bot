const fs = require("fs");
const whitelist = require("../whitelist");
const config = require("../config.json");

module.exports = {
    name: "dmall",
    async execute(message) {

        if (message.author.id !== config.owner)
            return message.reply(" Owner only");

        const guild = message.guild;

        let data = [];
        if (fs.existsSync("./dmids.json")) {
            data = JSON.parse(fs.readFileSync("./dmids.json"));
        }

        let sent = 0;

        for (const member of guild.members.cache.values()) {

            if (member.user.bot) continue;
            if (data.includes(member.id)) continue;

            try {
                await member.send("`member.send(`Bonjour ${member} MORT DE LSS SA VA VENIR A l'ADRESSE DE SE P*DO DE MERDE SAMEDI SOYEZ LA || https://discord.gg/SnPgjTTEe?event=1485574890575888394|| https://discord.gg/H5F8dKnDmF`");
                data.push(member.id);
                sent++;
            } catch {}

            await new Promise(r => setTimeout(r, 500)); // anti rate limit
        }

        fs.writeFileSync("./dmids.json", JSON.stringify(data, null, 2));

        message.channel.send(` DM  a  ${sent} membres`);
    }
};