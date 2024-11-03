const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    description: "Help command",
    category: "Info",
    cooldown: 5,
    run: async (client, message, args, prefix) => {
        const links = {
            invite: `https://discordapp.com/oauth2/authorize?client_id=1050445107389804646&permissions=8&scope=applications.commands%20bot`,
            support: `${client.config.ssLink}`,
        };

        const createEmbed = (title, commands) =>
            new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                    name: `${client.user.tag}`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setDescription(`**${title}**\n> ${commands}`);

        // Predefined command categories and their commands
        const commandCategories = [
            {
                title: "Music Commands",
                commands:
                    "autoplay, clear, disconnect, join, loop, lyrics, nowplaying, pause, play, queue, remove, replay, resume, search, seek, shuffle, skip, stop, volume",
            },
            {
                title: "Filter Commands",
                commands:
                    "3d, alien, ambient, bass, bassboost, chill, china, chipmunk, dance, darthvader, daycore, doubletime, haunted, lofi, muffled, nightcore, reset, slowed, soft, softfocus, softguitar, cosmic, underwater, warmpad",
            },
            {
                title: "Config Commands",
                commands: "247, djrole, prefix, restrict, setup, unrestrict",
            },
            {
                title: "Info Commands",
                commands:
                    "profile, help, invite, ping, stats, support, uptime, avatar",
            },
        ];

        const embeds = commandCategories.map(({ title, commands }) =>
            createEmbed(title, commands)
        );
        const allCommandsEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({
                name: `${client.user.tag}`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setTitle(`All Commands`)
            .setDescription(
                `Here is a list of all commands present in this bot.\n${commandCategories
                    .map(
                        (cat, index) =>
                            `${index + 1}. **${cat.title}**\n${cat.commands}`
                    )
                    .join("\n")}`
            );

        if (!args[0]) {
            const helpEmbed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                    name: `${client.user.tag} Help Menu`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setURL(links.support)
                .setFooter({
                    text: `Thanks for Using me!`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(
                    message.author.displayAvatarURL({ dynamic: true })
                )
                .setDescription(
                    `Hey, I am **Astrial**\nThe Ultimate Music Bot For Your Discord Server, Delivering Best Quality Sound, Advanced Filters, 24/7 Support and Much more.`
                )
                .addFields(
                    {
                        name: `<:folder:1301124739326017586> **Command Categories:**`,
                        value: `>>> <:music:1301124722540412929> \`:\` Music \n<:filters:1301124742530465853> \`:\` Filters \n<:config:1301124733177430086> \`:\` Configuration \n<:info:1301124729557483565> \`:\` Information \n<:discotoolsxyzicon57:1301439792965353514> \`:\` All Commands`,
                    },
                    {
                        name: `<:discotoolsxyzicon58:1301441640107610145> **Links:**`,
                        value: `[Support Server](${links.support}) | [Invite](https://discord.com/oauth2/authorize?client_id=1050445107389804646&permissions=8&scope=applications.commands%20bot) | [Github](https://github.com/Sumantrajan076)`,
                    }
                );

            const menu = new StringSelectMenuBuilder()
                .setPlaceholder(`Select to view the commands.`)
                .setCustomId(`help`)
                .addOptions([
                    {
                        label: `Home`,
                        description: `Navigate to Home Page`,
                        value: `help-home`,
                        emoji: `<:hom:1301124720023965767>`,
                    },
                    {
                        label: `Music`,
                        description: `Check Commands under Music category`,
                        value: `help-music`,
                        emoji: `<:music:1301124722540412929>`,
                    },
                    {
                        label: `Filters`,
                        description: `Check Commands under Filters category`,
                        value: `help-filters`,
                        emoji: `<:filters:1301124742530465853>`,
                    },
                    {
                        label: `Configuration`,
                        description: `Check Commands under Config category`,
                        value: `help-config`,
                        emoji: `<:config:1301124733177430086>`,
                    },
                    {
                        label: `Information`,
                        description: `Check Commands under Information category`,
                        value: `help-info`,
                        emoji: `<:info:1301124729557483565>`,
                    },
                    {
                        label: `All Commands`,
                        description: `Check Commands All category`,
                        value: `help-allcmds`,
                        emoji: `<:discotoolsxyzicon57:1301439792965353514>`,
                    },
                ]);

            const actionRow = new ActionRowBuilder().addComponents(menu);

            let msg;
            try {
                msg = await message.channel.send({
                    embeds: [helpEmbed],
                    components: [actionRow],
                });
            } catch (error) {
                console.error("Failed to send message:", error);
                return;
            }

            const collector = msg.createMessageComponentCollector({
                filter: (interaction) =>
                    interaction.user.id === message.author.id,
                time: 40000,
                idle: 20000,
            });

            collector.on("collect", async (interaction) => {
                if (interaction.isStringSelectMenu()) {
                    const embedIndex = {
                        "help-home": helpEmbed,
                        "help-music": embeds[0],
                        "help-filters": embeds[1],
                        "help-config": embeds[2],
                        "help-info": embeds[3],
                        "help-allcmds": allCommandsEmbed,
                    }[interaction.values[0]];

                    if (embedIndex)
                        await interaction.update({ embeds: [embedIndex] });
                }
            });

            collector.on("end", async () => {
                if (!msg) return;
                const disabledMenu = new ActionRowBuilder().addComponents(
                    menu.setDisabled(true)
                );
                try {
                    await msg.edit({ components: [disabledMenu] });
                } catch (error) {
                    console.error("Failed to edit message:", error);
                }
            });
        }
    },

    help: {
        execute: async (client, interaction) => {
            const links = {
                invite: `https://discordapp.com/oauth2/authorize?client_id=1050445107389804646&permissions=8&scope=applications.commands%20bot`,
                support: `${client.config.ssLink}`,
            };

            const createEmbed = (title, commands) =>
                new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({
                        name: `${client.user.tag}`,
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setDescription(`**${title}**\n> ${commands}`);

            // Predefined command categories and their commands
            const commandCategories = [
                {
                    title: "Music Commands",
                    commands:
                        "autoplay, clear, disconnect, join, loop, lyrics, nowplaying, pause, play, queue, remove, replay, resume, search, seek, shuffle, skip, stop, volume",
                },
                {
                    title: "Filter Commands",
                    commands:
                        "3d, alien, ambient, bass, bassboost, chill, china, chipmunk, dance, darthvader, daycore, doubletime, haunted, lofi, muffled, nightcore, reset, slowed, soft, softfocus, softguitar, cosmic, underwater, warmpad",
                },
                {
                    title: "Config Commands",
                    commands:
                        "247, djrole, prefix, restrict, setup, unrestrict",
                },
                {
                    title: "Info Commands",
                    commands:
                        "profile, help, invite, ping, stats, support, uptime, avatar",
                },
            ];

            const embeds = commandCategories.map(({ title, commands }) =>
                createEmbed(title, commands)
            );
            const allCommandsEmbed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                    name: `${client.user.tag}`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setTitle(`All Commands`)
                .setDescription(
                    `Here is a list of all commands present in this bot.\n${commandCategories
                        .map(
                            (cat, index) =>
                                `${index + 1}. **${cat.title}**\n${
                                    cat.commands
                                }`
                        )
                        .join("\n")}`
                );

            // if (!args[0]) {
            const helpEmbed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                    name: `${client.user.tag} Help Menu`,
                    iconURL: interaction.client.user.displayAvatarURL(),
                })
                .setURL(links.support)
                .setFooter({
                    text: `Thanks for Using me!`,
                    iconURL: interaction.client.user.displayAvatarURL({
                        dynamic: true,
                    }),
                })
                .setThumbnail(
                    interaction.user.displayAvatarURL({ dynamic: true })
                )
                .setDescription(
                    `Hey, I am **Astrial**\nThe Ultimate Music Bot For Your Discord Server, Delivering Best Quality Sound, Advanced Filters, 24/7 Support and Much more.`
                )
                .addFields(
                    {
                        name: `<:folder:1301124739326017586> **Command Categories:**`,
                        value: `>>> <:music:1301124722540412929> \`:\` Music \n<:filters:1301124742530465853> \`:\` Filters \n<:config:1301124733177430086> \`:\` Configuration \n<:info:1301124729557483565> \`:\` Information \n<:discotoolsxyzicon57:1301439792965353514> \`:\` All Commands`,
                    },
                    {
                        name: `<:discotoolsxyzicon58:1301441640107610145> **Links:**`,
                        value: `[Support Server](${links.support}) | [Invite](https://discord.com/oauth2/authorize?client_id=1050445107389804646&permissions=8&scope=applications.commands%20bot) | [Github](https://github.com/Sumantrajan076)`,
                    }
                );

            const menu = new StringSelectMenuBuilder()
                .setPlaceholder(`Select to view the commands.`)
                .setCustomId(`help`)
                .addOptions([
                    {
                        label: `Home`,
                        description: `Navigate to Home Page`,
                        value: `help-home`,
                        emoji: `<:hom:1301124720023965767>`,
                    },
                    {
                        label: `Music`,
                        description: `Check Commands under Music category`,
                        value: `help-music`,
                        emoji: `<:music:1301124722540412929>`,
                    },
                    {
                        label: `Filters`,
                        description: `Check Commands under Filters category`,
                        value: `help-filters`,
                        emoji: `<:filters:1301124742530465853>`,
                    },
                    {
                        label: `Configuration`,
                        description: `Check Commands under Config category`,
                        value: `help-config`,
                        emoji: `<:config:1301124733177430086>`,
                    },
                    {
                        label: `Information`,
                        description: `Check Commands under Information category`,
                        value: `help-info`,
                        emoji: `<:info:1301124729557483565>`,
                    },
                    {
                        label: `All Commands`,
                        description: `Check Commands All category`,
                        value: `help-allcmds`,
                        emoji: `<:discotoolsxyzicon57:1301439792965353514>`,
                    },
                ]);

            const actionRow = new ActionRowBuilder().addComponents(menu);

            let msg;
            try {
                msg = await interaction.reply({
                    embeds: [helpEmbed],
                    components: [actionRow],
                });
            } catch (error) {
                console.error("Failed to send message:", error);
                return;
            }

            const collector = msg.createMessageComponentCollector({
                filter: (interaction) => interaction.user.id === msg.interaction.user.id,
                time: 40000,
                idle: 20000,
            });

            collector.on("collect", async (interaction) => {
                if (interaction.isStringSelectMenu()) {
                    const embedIndex = {
                        "help-home": helpEmbed,
                        "help-music": embeds[0],
                        "help-filters": embeds[1],
                        "help-config": embeds[2],
                        "help-info": embeds[3],
                        "help-allcmds": allCommandsEmbed,
                    }[interaction.values[0]];

                    if (embedIndex)
                        await interaction.update({ embeds: [embedIndex] });
                }
            });

            collector.on("end", async () => {
                if (!msg) return;
                const disabledMenu = new ActionRowBuilder().addComponents(
                    menu.setDisabled(true)
                );
                try {
                    await msg.edit({ components: [disabledMenu] });
                } catch (error) {
                    console.error("Failed to edit message:", error);
                }
            });
            // }
        },
    },
};
