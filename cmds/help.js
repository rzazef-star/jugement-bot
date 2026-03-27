const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "help",
    async execute(message) {

        const banner = "https://cdn.discordapp.com/attachments/1487126482785402941/1487129801188839587/ChatGPT_Image_Mar_27_2026_05_42_38_PM.png";

        const mainEmbed = new EmbedBuilder()
            .setTitle("✨ Jugement - Gestion")
            .setDescription("Sélectionne une catégorie ci-dessous")
            .setColor("Purple")
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setImage(banner);

        const menu = new StringSelectMenuBuilder()
            .setCustomId("help-menu")
            .setPlaceholder("📂 Choisir une catégorie")
            .addOptions([
                { label: "Accueil", value: "home", emoji: "🏠" },
                { label: "Sécurité", value: "security", emoji: "🛡️" },
                { label: "Whitelist", value: "wl", emoji: "🔐" },
                { label: "Owner", value: "owner", emoji: "👑" },
                { label: "Utilitaire", value: "utils", emoji: "📊" }
            ]);

        const closeBtn = new ButtonBuilder()
            .setCustomId("close")
            .setLabel("Fermer")
            .setEmoji("❌")
            .setStyle(ButtonStyle.Danger);

        const row1 = new ActionRowBuilder().addComponents(menu);
        const row2 = new ActionRowBuilder().addComponents(closeBtn);

        const msg = await message.reply({ 
            embeds: [mainEmbed], 
            components: [row1, row2] 
        });

        const filter = i => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 120000 });

        collector.on("collect", async i => {

            if (i.customId === "close") {
                return i.update({
                    content: "Panel Close",
                    embeds: [],
                    components: []
                });
            }

            if (i.values[0] === "home") {
                return i.update({ embeds: [mainEmbed], components: [row1, row2] });
            }

            let embed = new EmbedBuilder()
                .setColor("Purple")
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setImage(banner);

            if (i.values[0] === "security") {
                embed.setTitle(" Sécurité")
                .setDescription("`+lock`\n`+unlock`\n`+secure`\n`+panic`");
            }

            if (i.values[0] === "wl") {
                embed.setTitle(" Whitelist")
                .setDescription("`+wladd`\n`+wlremove`\n`+bring`");
            }

            if (i.values[0] === "owner") {
                embed.setTitle("👑 Owner")
                .setDescription("`+backup create`\n`+backup load`\n`+clearall`\n`+panic`");
            }

            if (i.values[0] === "utils") {
                embed.setTitle("📊 Utilitaire")
                .setDescription("`+stat`\n`+snipe`\n`+renew`\n`+fakeban`");
            }

            i.update({ embeds: [embed], components: [row1, row2] });
        });

        collector.on("end", () => {
            msg.edit({ components: [] }).catch(() => {});
        });

    }
};