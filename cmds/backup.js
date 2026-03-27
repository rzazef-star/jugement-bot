const fs = require("fs");
const config = require("../config.json");

module.exports = {
    name: "backup",
    async execute(message, args) {

        if (!config.owners.includes(message.author.id))
            return message.reply("Owner only");

        const sub = args[0];

        if (!sub) return message.reply("use: +backup create / load");

        // CREATE
        if (sub === "create") {

            const backup = {
                roles: [],
                channels: []
            };

            message.guild.roles.cache.forEach(role => {
                if (role.managed) return;
                if (role.id === message.guild.id) return;

                backup.roles.push({
                    name: role.name,
                    color: role.color,
                    permissions: role.permissions.bitfield,
                    hoist: role.hoist,
                    mentionable: role.mentionable,
                    position: role.position
                });
            });

            message.guild.channels.cache.forEach(ch => {
                backup.channels.push({
                    name: ch.name,
                    type: ch.type,
                    position: ch.position
                });
            });

            fs.writeFileSync("./backup.json", JSON.stringify(backup, null, 2));

            return message.reply("Backup created");
        }

        // LOAD
        if (sub === "load") {

            if (!fs.existsSync("./backup.json"))
                return message.reply("No backup found");

            const backup = JSON.parse(fs.readFileSync("./backup.json"));

            await message.reply("Loading...");

            // delete channels
            await Promise.all(
                message.guild.channels.cache.map(c => c.delete().catch(() => {}))
            );

            // delete roles
            await Promise.all(
                message.guild.roles.cache.map(r => {
                    if (r.id !== message.guild.id && !r.managed)
                        return r.delete().catch(() => {});
                })
            );

            // create roles
            await Promise.all(
                backup.roles
                    .sort((a,b)=>a.position-b.position)
                    .map(r =>
                        message.guild.roles.create({
                            name: r.name,
                            color: r.color,
                            permissions: r.permissions,
                            hoist: r.hoist,
                            mentionable: r.mentionable
                        }).catch(() => {})
                    )
            );

            // create channels
            await Promise.all(
                backup.channels
                    .sort((a,b)=>a.position-b.position)
                    .map(c =>
                        message.guild.channels.create({
                            name: c.name,
                            type: c.type
                        }).catch(() => {})
                    )
            );

            message.channel.send("Backup loaded");
        }
    }
};
