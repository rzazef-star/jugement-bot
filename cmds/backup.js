const fs = require("fs");
const config = require("../config.json");

module.exports = {
    name: "backup",
    async execute(message, args) {

        if (message.author.id !== config.owner)
            return message.reply(" Owner only");

        const action = args[0]?.toLowerCase();
        if (!action) return message.reply("backup create / backup load");

        // CREATE
        if (action === "create") {

            const data = {
                roles: [],
                channels: []
            };

            message.guild.roles.cache.forEach(role => {
                if (role.id === message.guild.id) return;

                data.roles.push({
                    name: role.name,
                    color: role.color,
                    hoist: role.hoist,
                    position: role.position,
                    permissions: role.permissions.bitfield.toString()
                });
            });

            message.guild.channels.cache.forEach(channel => {
                data.channels.push({
                    name: channel.name,
                    type: channel.type,
                    parent: channel.parentId
                });
            });

            fs.writeFileSync("./backup.json", JSON.stringify(data, null, 2));
            message.reply(" Backup create");
        }

        // LOAD
        if (action === "load") {

            if (!fs.existsSync("./backup.json"))
                return message.reply("+backup Create");

            const backup = JSON.parse(fs.readFileSync("./backup.json"));

            // delete channels
            for (const ch of message.guild.channels.cache.values()) {
                await ch.delete().catch(() => {});
            }

            // delete roles
            for (const role of message.guild.roles.cache.values()) {
                if (role.id !== message.guild.id)
                    await role.delete().catch(() => {});
            }

            // create roles
            const createdRoles = {};
            for (const role of backup.roles.reverse()) {
                const newRole = await message.guild.roles.create({
                    name: role.name,
                    color: role.color,
                    hoist: role.hoist,
                    permissions: BigInt(role.permissions)
                });

                createdRoles[role.name] = newRole.id;
            }

            // create channels
            for (const ch of backup.channels) {
                await message.guild.channels.create({
                    name: ch.name,
                    type: ch.type
                });
            }

            message.reply(" Backup load");
        }
    }
};