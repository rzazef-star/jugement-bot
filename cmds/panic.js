const fs = require("fs");
const config = require("../config.json");

module.exports = {
    name: "panic",
    async execute(message, args, client) {

        if (message.author.id !== config.owner)
            return message.reply("Owner only.");

        const backup = JSON.parse(fs.readFileSync("./backup.json"));

        await Promise.all(
            message.guild.channels.cache.map(ch => ch.delete().catch(() => {}))
        );

        await Promise.all(
            message.guild.roles.cache.map(role => {
                if (role.id !== message.guild.id)
                    return role.delete().catch(() => {});
            })
        );

        for (const role of backup.roles) {
            await message.guild.roles.create({
                name: role.name,
                color: role.color,
                permissions: role.permissions,
                hoist: role.hoist,
                mentionable: role.mentionable
            }).catch(() => {});
        }

        for (const ch of backup.channels) {
            await message.guild.channels.create({
                name: ch.name,
                type: ch.type
            }).catch(() => {});
        }

    }
};