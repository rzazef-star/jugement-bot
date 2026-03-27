const fs = require("fs");
const config = require("../config.json");

module.exports = {
    name: "backup",
    async execute(message, args) {

        if (!config.owners.includes(message.author.id))
            return message.reply("Owner only.");

        if (!args[0]) return message.reply("backup save / load");

        // SAVE
        if (args[0] === "save") {

            const backup = {
                roles: [],
                channels: []
            };

            message.guild.roles.cache.forEach(role => {
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
            return message.reply("Backup saved.");
        }

        // LOAD (ULTRA FAST)
        if (args[0] === "load") {

            const backup = JSON.parse(fs.readFileSync("./backup.json"));

            await message.reply("Loading backup...");

            // delete channels fast
            await Promise.all(
                message.guild.channels.cache.map(ch => ch.delete().catch(() => {}))
            );

            // delete roles fast
            await Promise.all(
                message.guild.roles.cache.map(role => {
                    if (role.id !== message.guild.id)
                        return role.delete().catch(() => {});
                })
            );

            // create roles fast
            await Promise.all(
                backup.roles.map(role =>
                    message.guild.roles.create({
                        name: role.name,
                        color: role.color,
                        permissions: role.permissions,
                        hoist: role.hoist,
                        mentionable: role.mentionable
                    }).catch(() => {})
                )
            );

            // create channels fast
            await Promise.all(
                backup.channels.map(ch =>
                    message.guild.channels.create({
                        name: ch.name,
                        type: ch.type
                    }).catch(() => {})
                )
            );

            message.channel.send("Backup loaded ⚡");
        }
    }
};
