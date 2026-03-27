const fs = require("fs");
const config = require("../config.json");

const PATH = "./backup.json";

module.exports = {
    name: "backup",
    async execute(message, args) {

        if (!config.owners.includes(message.author.id))
            return message.reply("Owner only");

        const sub = args[0];
        if (!sub) return message.reply("+backup create / load");

        // CREATE
        if (sub === "create") {

            const backup = {
                roles: [],
                channels: []
            };

            // ROLES
            message.guild.roles.cache.forEach(role => {
                if (role.managed) return;
                if (role.id === message.guild.id) return;

                backup.roles.push({
                    name: role.name,
                    color: role.color,
                    permissions: role.permissions.bitfield.toString(),
                    hoist: role.hoist,
                    mentionable: role.mentionable,
                    position: role.position
                });
            });

            // CHANNELS + CATEGORIES
            message.guild.channels.cache.forEach(ch => {
                backup.channels.push({
                    name: ch.name,
                    type: ch.type,
                    position: ch.position,
                    parent: ch.parentId
                });
            });

            fs.writeFileSync(PATH, JSON.stringify(backup, null, 2));

            return message.reply("Backup create");
        }

        // LOAD
        if (sub === "load") {

            if (!fs.existsSync(PATH))
                return message.reply("No backup found");

            const backup = JSON.parse(fs.readFileSync(PATH));

            await message.reply("Load backup");

            // DELETE CHANNELS
            await Promise.all(
                message.guild.channels.cache.map(c => c.delete().catch(() => {}))
            );

            // DELETE ROLES
            await Promise.all(
                message.guild.roles.cache.map(r => {
                    if (r.id !== message.guild.id && !r.managed)
                        return r.delete().catch(() => {});
                })
            );

            // CREATE ROLES
            await Promise.all(
                backup.roles
                    .sort((a,b)=>a.position-b.position)
                    .map(r =>
                        message.guild.roles.create({
                            name: r.name,
                            color: r.color,
                            permissions: BigInt(r.permissions),
                            hoist: r.hoist,
                            mentionable: r.mentionable
                        }).catch(() => {})
                    )
            );

            const createdCategories = new Map();

            // CREATE CATEGORIES
            for (const c of backup.channels.filter(c => c.type === 4)) {
                const cat = await message.guild.channels.create({
                    name: c.name,
                    type: 4
                }).catch(() => {});
                if (cat) createdCategories.set(c.name, cat.id);
            }

            // CREATE CHANNELS
            await Promise.all(
                backup.channels
                    .filter(c => c.type !== 4)
                    .map(c =>
                        message.guild.channels.create({
                            name: c.name,
                            type: c.type,
                            parent: createdCategories.get(
                                backup.channels.find(x => x.parent === c.parent)?.name
                            ) || null
                        }).catch(() => {})
                    )
            );

            message.channel.send("Backup load ⚡");
        }
    }
};
