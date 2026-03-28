const fs = require("fs");
const config = require("../config.json");

module.exports = {
    name: "dmall",
    async execute(message) {

        if (!config.owners.includes(message.author.id))
            return message.reply("Owner only");

        const guild = message.guild;

        await guild.members.fetch();

        let data = [];
        if (fs.existsSync("./dmids.json")) {
            data = JSON.parse(fs.readFileSync("./dmids.json"));
        }

        let sent = 0;

        for (const member of guild.members.cache.values()) {

            if (member.user.bot) continue;
            if (data.includes(member.id)) continue;

            try {
                await member.send(
` ${member}
Brancher vous a 20h event de fou malade l'équipe en vas baiser se fils de putain de castrx sa mère la chienne ( sa vas se baiser Soyez là, ça va être n’importe quoi so slow vas baiser un putain de random )
https://discord.gg/WbWgpWtzbu
https://discord.gg/HgkWuUMJ?event=1487178502766858451`
                );

                data.push(member.id);
                sent++;

            } catch {}

            await new Promise(r => setTimeout(r, 700));
        }

        fs.writeFileSync("./dmids.json", JSON.stringify(data, null, 2));

        message.channel.send(`DM envoyé à ${sent} membres`);
    }
};
