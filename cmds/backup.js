const fs = require("fs");
const config = require("../config.json");

const PATH = "./backup.json";

module.exports = {
    name: "backup",
    async execute(message, args) {

        if (!config.owners.includes(message.author.id))
            return message.channel.send("Owner only");

        const sub = args[0];
        if (!sub) return message.channel.send("+backup create / load");

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
                    topic: ch.topic || null,
                    nsfw: ch.nsfw || false,
                    bitrate: ch.bitrate || null,
                    userLimit: ch.userLimit || null,
                    parent: ch.parentId,
                    position: ch.position
                });
            });

            fs.writeFileSync(PATH, JSON.stringify(backup, null, 2));
            return message.channel.send("Backup created");
        }

        // LOAD
        if (sub === "load") {

            const backup = JSON.parse(fs.readFileSync(PATH));

            await message.channel.send("Loading backup...");

            // delete channels
            await Promise.all(
                message.guild.channels.cache.map(c => c.delete().catch(()=>{}))
            );

            // delete roles
            await Promise.all(
                message.guild.roles.cache.map(r => {
                    if (r.id !== message.guild.id && !r.managed)
                        return r.delete().catch(()=>{});
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
                            permissions: BigInt(r.permissions),
                            hoist: r.hoist,
                            mentionable: r.mentionable
                        }).catch(()=>{})
                    )
            );

            const created = new Map();

            // create categories
            for (const c of backup.channels.filter(c=>c.type===4)) {
                const cat = await message.guild.channels.create({
                    name: c.name,
                    type: 4
                }).catch(()=>{});
                if (cat) created.set(c.name, cat.id);
            }

            // create channels
            for (const c of backup.channels.filter(c=>c.type!==4)) {

                await message.guild.channels.create({
                    name: c.name,
                    type: c.type,
                    topic: c.topic,
                    nsfw: c.nsfw,
                    bitrate: c.bitrate,
                    userLimit: c.userLimit,
                    parent: created.get(
                        backup.channels.find(x=>x.parent===c.parent)?.name
                    ) || null
                }).catch(()=>{});
            }

            message.channel.send("Backup loaded");
        }
    }
};
