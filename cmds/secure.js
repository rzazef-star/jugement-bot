if (secure.enabled) {

    if (message.author.bot) return;

    const linkRegex = /(https?:\/\/|discord\.gg)/i;

    if (linkRegex.test(message.content)) {

        message.delete().catch(() => {});

        // timeout 10 secondes
        if (message.member && message.member.moderatable) {
            message.member.timeout(10 * 1000, "Anti-link").catch(() => {});
        }

        const log = message.guild.channels.cache.find(c => c.name === "📂・link");
        if (log) log.send(`🔗 ${message.author} a envoyé un lien (timeout 10s)`);
    }

    if (message.content.includes("@everyone") || message.content.includes("@here")) {
        message.delete().catch(() => {});
    }
}
