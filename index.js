const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const config = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});

client.commands = new Collection();
client.snipes = new Map();

const commandFiles = fs.readdirSync("./cmds").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./cmds/${file}`);
    client.commands.set(command.name, command);
}

client.on("messageDelete", message => {
    if (!message.guild || message.author?.bot) return;

    client.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author,
        time: Date.now()
    });
});

client.on("messageCreate", async message => {

    if (message.author.bot) return;

    // ANTI LINK
    const linkRegex = /(https?:\/\/|discord\.gg)/i;

    if (linkRegex.test(message.content)) {
        message.delete().catch(() => {});

        if (message.member && message.member.moderatable) {
            message.member.timeout(10 * 1000, "Anti-link").catch(() => {});
        }

        const log = message.guild.channels.cache.find(c => c.name === "📂・link");
        if (log) log.send(`🔗 ${message.author} a envoyé un lien (timeout 10s)`);
    }

    // ANTI EVERYONE
    if (message.content.includes("@everyone") || message.content.includes("@here")) {
        message.delete().catch(() => {});

        const log = message.guild.channels.cache.find(c => c.name === "📂・everyone");
        if (log) log.send(`📢 ${message.author} a utilisé everyone`);
    }

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);
    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error("Commande error :", error);
    }
});

client.once("ready", () => {
    console.log(`BOT CONNECTED = ${client.user.tag}`);
});

client.login(process.env.TOKEN);
