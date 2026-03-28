const fs = require("fs");
const config = require("../config.json");

module.exports = {
    name: "dmall",
    async execute(message) {

        if (!config.owners.includes(message.author.id))
            return message.channel.send("Owner only");

        const guild = message.guild;

        await guild.members.fetch();

        let data = [];
        if (fs.existsSync("./dmids.json")) {
            data = JSON.parse(fs.readFileSync("./dmids.json"));
        }

        let sent = 0;
        let failed = 0;

        for (const member of guild.members.cache.values()) {

            if (member.user.bot) continue;
            if (data.includes(member.id)) continue;

            try {
                await member.send(
`Bonjour ${member}

Ton message ici`
                );

                data.push(member.id);
                sent++;

            } catch {
                failed++;
            }

            await new Promise(r => setTimeout(r, 600));
        }

        fs.writeFileSync("./dmids.json", JSON.stringify(data, null, 2));

        message.channel.send(
`DM terminé
Envoyé : ${sent}
Refusé : ${failed}`
        );
    }
};
