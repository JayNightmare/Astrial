const {
    Message,
    PermissionFlagsBits,
    EmbedBuilder,
    PermissionsBitField,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
} = require("discord.js");
const setupData = require("../../models/SetupSchema.js");

module.exports = {
    name: "setup",
    aliases: ["panel"],
    description: "Setup music panel for your server",
    userPermissions: PermissionFlagsBits.ManageGuild,
    // botPermissions: PermissionFlagsBits.Speak,
    cooldowns: 5,
    category: "Config",
    voteOnly: false,
    run: async (client, message, args, prefix) => {
        if (
            !message.member.permissions.has(
                PermissionsBitField.Flags.ManageGuild
            )
        )
            return message.channel.send(
                `${client.emoji.cross} | You don't have enough permissions!`
            );

        try {
            const data = await setupData.findOne({ guildId: message.guild.id });
            if (!args[0]) {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `If you want to setup you can use ${prefix}setup create/delete`
                    );
                return message.channel.send({ embeds: [embed] });
            }
            if (args[0].toLowerCase() === "create") {
                if (data && data.channelId && data.messageId) {
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Setup Already Exists at: <#${data.channelId}>`
                        );
                    return message.channel.send({ embeds: [embed] });
                }
                let channel =
                    message.mentions.channels.first() ||
                    message.guild.channels.cache.get(args[2]);

                if (!channel)
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | Please provide me a valid channel to be created setup on!`
                                ),
                        ],
                    });

                if (
                    !message.guild.members.me
                        .permissionsIn(channel)
                        .has("ViewChannel")
                )
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | I don't have **View Channel** permissions in that channel!`
                                )
                                .setTitle(`Missing Permissions`),
                        ],
                    });

                if (
                    !message.guild.members.me
                        .permissionsIn(channel)
                        .has("SendMessages")
                )
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | I don't have **Send Messages** permissions in that channel!`
                                )
                                .setTitle(`Missing Permissions`),
                        ],
                    });

                if (
                    !message.guild.members.me
                        .permissionsIn(channel)
                        .has("ReadMessageHistory")
                )
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | I don't have **Read Message History** permissions in that channel!`
                                )
                                .setTitle(`Missing Permissions`),
                        ],
                    });

                if (
                    !message.guild.members.me
                        .permissionsIn(channel)
                        .has("UseExternalEmojis")
                )
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | I don't have **Use External Emojis** permissions in that channel!`
                                )
                                .setTitle(`Missing Permissions`),
                        ],
                    });

                if (
                    !message.guild.members.me
                        .permissionsIn(channel)
                        .has("EmbedLinks")
                )
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | I don't have **Embed Links** permissions in that channel!`
                                )
                                .setTitle(`Missing Permissions`),
                        ],
                    });

                if (
                    !message.guild.members.me
                        .permissionsIn(channel)
                        .has("ManageChannels")
                )
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | I don't have **Manage Channels** permissions in that channel!`
                                )
                                .setTitle(`Missing Permissions`),
                        ],
                    });

                if (
                    !message.guild.members.me
                        .permissionsIn(channel)
                        .has("ManageMessages")
                )
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | I don't have **Manage Messages** permissions in that channel!`
                                )
                                .setTitle(`Missing Permissions`),
                        ],
                    });

                let em1 = new EmbedBuilder().setImage(
                    "https://media.discordapp.net/attachments/1241172519176769549/1301402599156875267/Picsart_24-10-31_09-58-42-473.jpg?ex=6724591e&is=6723079e&hm=7fe972668a4174b296f7d44c236d96772425c78ae0a7dfe598e4fbf97bb31a4b&=&format=webp&width=1440&height=587"
                );

                let em = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle(`__Join a Voice Channel & Request a Song__`)
                    .setDescription(
                        `**Unleash Your Music Vibes with Astrial!** : Join us in the voice chat and request your favorite songs! Experience the ultimate sound quality and let the music take you higher!`
                    )
                    .setImage(`${client.config.setupBgLink}`)
                    .setAuthor({
                        name: `Astrial - Requests`,
                        iconURL: message.guild.iconURL({ dynamic: true }),
                    })
                    .setFooter({
                        text: `| Thanks for choosing ${client.user.username}`,
                        iconURL: client.user.displayAvatarURL(),
                    });

                //btn
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("setup_vol+")
                            .setEmoji("<:volup:1301123976952811520>")
                            .setStyle(ButtonStyle.Secondary)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("setup_skip")
                            .setEmoji("<:skip:1301124025531109436>")
                            .setStyle(ButtonStyle.Secondary)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("setup_pause")
                            .setEmoji("<:pause:1301123947290427454>") // Play or pause based on state
                            .setStyle(ButtonStyle.Secondary)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("setup_stop")
                            .setEmoji("<:stop:1301124016555294792>")
                            .setStyle(ButtonStyle.Danger)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("setup_vol-")
                            .setEmoji("<:voldown:1301123997806886943>")
                            .setStyle(ButtonStyle.Secondary)
                    );

                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("setup_shuffle")
                            .setEmoji("<:shuffle:1301124480676134985>")
                            .setStyle(ButtonStyle.Secondary)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("setup_replay")
                            .setEmoji("<:replay:1301124117956657194>")
                            .setStyle(ButtonStyle.Secondary)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("setup_clear")
                            .setEmoji(
                                "<:discotoolsxyzicon37:1301412693978124358>"
                            )
                            .setStyle(ButtonStyle.Secondary)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("setup_autoplay")
                            .setEmoji("<:queue:1301124133379244072>")
                            .setStyle(ButtonStyle.Secondary)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("setup_loop")
                            .setEmoji("<:loop:1301126862772371489>")
                            .setStyle(ButtonStyle.Secondary)
                    );

                //menu
                const filterRow = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("filterSelect")
                        .setPlaceholder("Select a filter")
                        .addOptions(
                            {
                                label: "Bass Boost",
                                description: "Apply a bass boost filter",
                                value: "bassboost",
                                emoji: "<:filters:1243212306842783836>",
                            },
                            {
                                label: "Nightcore",
                                description: "Apply a nightcore filter",
                                value: "nightcore",
                                emoji: "<:filters:1243212306842783836>",
                            },
                            {
                                label: "Vaporwave",
                                description: "Apply a vaporwave filter",
                                value: "vaporwave",
                                emoji: "<:filters:1243212306842783836>",
                            },
                            {
                                label: "Tremolo",
                                description: "Apply a tremolo filter",
                                value: "tremolo",
                                emoji: "<:filters:1243212306842783836>",
                            },
                            {
                                label: "Vibrato",
                                description: "Apply a vibrato filter",
                                value: "vibrato",
                                emoji: "<:filters:1243212306842783836>",
                            },
                            {
                                label: "Karaoke",
                                description: "Apply a karaoke filter",
                                value: "karaoke",
                                emoji: "<:filters:1243212306842783836>",
                            },
                            {
                                label: "Distortion",
                                description: "Apply a distortion filter",
                                value: "distortion",
                                emoji: "<:filters:1243212306842783836>",
                            },
                            {
                                label: "None",
                                description: "Remove all filters",
                                value: "none",
                                emoji: "<:reset:1249250249462255617>",
                            }
                        )
                );

                let msg = await channel.send({
                    embeds: [em1, em],
                    //content: content,
                    components: [filterRow, row, row2],
                });

                await setupData.updateOne(
                    { guildId: message.guild.id },
                    {
                        $set: {
                            channelId: channel.id,
                            messageId: msg.id,
                            prefixz: prefix,
                        },
                    },
                    { upsert: true }
                );

                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setTitle(`Setup Created`)
                            .setDescription(
                                `${client.emoji.tick} | Successfully **Created** Music Setup at ${channel}. Hope you enjoy me there`
                            ),
                    ],
                });
            }

            if (args[0].toLowerCase() === `delete`) {
                if (
                    !data ||
                    (data && !data.channelId) ||
                    (data && !data.messageId)
                ) {
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | There is no setup for this guild right now!`
                                ),
                        ],
                    });
                }

                let ch = message.guild.channels.cache.get(data.channelId);
                if (ch) {
                    let msg = await ch.messages
                        .fetch(data.messageId)
                        .catch(() => {});
                    if (msg) msg.delete().catch((e) => {});
                }
                await data.deleteOne();
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setTimestamp()
                            .setTitle(`Deleted`)
                            .setDescription(
                                `${client.emoji.tick} | Successfully **Deleted** Server Music Setup`
                            ),
                    ],
                });
            }
        } catch (error) {
            console.log(error);
        }
    },

    // //

    // ! Add Slash Logic
    setup: {
        execute: async (client, interaction) => {
            if (
                !interaction.member.permissions.has(
                    PermissionsBitField.Flags.ManageGuild
                )
            )
                return interaction.reply(
                    `${client.emoji.cross} | You don't have enough permissions!`
                );

            const type = interaction.options.getString("type");
            const channel = interaction.options.getChannel("channel");

            try {
                const data = await setupData.findOne({
                    guildId: interaction.guild.id,
                });
                if (type === 'create') {
                    console.log('If statement = Create');
                    if (data && data.channelId && data.messageId) {
                        const embed = new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.cross} | Setup Already Exists at: <#${data.channelId}>`
                            );
                        return interaction.reply({ embeds: [embed] });
                    }

                    if (!channel)
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(
                                        `${client.emoji.cross} | Please provide me a valid channel to be created setup on!`
                                    ),
                            ],
                        });

                    if (
                        !interaction.guild.members.me
                            .permissionsIn(channel)
                            .has("ViewChannel")
                    )
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(
                                        `${client.emoji.cross} | I don't have **View Channel** permissions in that channel!`
                                    )
                                    .setTitle(`Missing Permissions`),
                            ],
                        });

                    if (
                        !interaction.guild.members.me
                            .permissionsIn(channel)
                            .has("SendMessages")
                    )
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(
                                        `${client.emoji.cross} | I don't have **Send Messages** permissions in that channel!`
                                    )
                                    .setTitle(`Missing Permissions`),
                            ],
                        });

                    if (
                        !interaction.guild.members.me
                            .permissionsIn(channel)
                            .has("ReadMessageHistory")
                    )
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(
                                        `${client.emoji.cross} | I don't have **Read Message History** permissions in that channel!`
                                    )
                                    .setTitle(`Missing Permissions`),
                            ],
                        });

                    if (
                        !interaction.guild.members.me
                            .permissionsIn(channel)
                            .has("UseExternalEmojis")
                    )
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(
                                        `${client.emoji.cross} | I don't have **Use External Emojis** permissions in that channel!`
                                    )
                                    .setTitle(`Missing Permissions`),
                            ],
                        });

                    if (
                        !interaction.guild.members.me
                            .permissionsIn(channel)
                            .has("EmbedLinks")
                    )
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(
                                        `${client.emoji.cross} | I don't have **Embed Links** permissions in that channel!`
                                    )
                                    .setTitle(`Missing Permissions`),
                            ],
                        });

                    if (
                        !interaction.guild.members.me
                            .permissionsIn(channel)
                            .has("ManageChannels")
                    )
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(
                                        `${client.emoji.cross} | I don't have **Manage Channels** permissions in that channel!`
                                    )
                                    .setTitle(`Missing Permissions`),
                            ],
                        });

                    if (
                        !interaction.guild.members.me
                            .permissionsIn(channel)
                            .has("ManageMessages")
                    )
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(
                                        `${client.emoji.cross} | I don't have **Manage Messages** permissions in that channel!`
                                    )
                                    .setTitle(`Missing Permissions`),
                            ],
                        });

                    let em1 = new EmbedBuilder().setImage(
                        "https://media.discordapp.net/attachments/1241172519176769549/1301402599156875267/Picsart_24-10-31_09-58-42-473.jpg?ex=6724591e&is=6723079e&hm=7fe972668a4174b296f7d44c236d96772425c78ae0a7dfe598e4fbf97bb31a4b&=&format=webp&width=1440&height=587"
                    );

                    let em = new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle(`__Join a Voice Channel & Request a Song__`)
                        .setDescription(
                            `**Unleash Your Music Vibes with Astrial!** : Join us in the voice chat and request your favorite songs! Experience the ultimate sound quality and let the music take you higher!`
                        )
                        .setImage(`${client.config.setupBgLink}`)
                        .setAuthor({
                            name: `Astrial - Requests`,
                            iconURL: interaction.guild.iconURL({
                                dynamic: true,
                            }),
                        })
                        .setFooter({
                            text: `| Thanks for choosing ${client.user.username}`,
                            iconURL: client.user.displayAvatarURL(),
                        });

                    //btn
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("setup_vol+")
                                .setEmoji("<:volup:1301123976952811520>")
                                .setStyle(ButtonStyle.Secondary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("setup_skip")
                                .setEmoji("<:skip:1301124025531109436>")
                                .setStyle(ButtonStyle.Secondary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("setup_pause")
                                .setEmoji("<:pause:1301123947290427454>") // Play or pause based on state
                                .setStyle(ButtonStyle.Secondary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("setup_stop")
                                .setEmoji("<:stop:1301124016555294792>")
                                .setStyle(ButtonStyle.Danger)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("setup_vol-")
                                .setEmoji("<:voldown:1301123997806886943>")
                                .setStyle(ButtonStyle.Secondary)
                        );

                    const row2 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("setup_shuffle")
                                .setEmoji("<:shuffle:1301124480676134985>")
                                .setStyle(ButtonStyle.Secondary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("setup_replay")
                                .setEmoji("<:replay:1301124117956657194>")
                                .setStyle(ButtonStyle.Secondary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("setup_clear")
                                .setEmoji(
                                    "<:discotoolsxyzicon37:1301412693978124358>"
                                )
                                .setStyle(ButtonStyle.Secondary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("setup_autoplay")
                                .setEmoji("<:queue:1301124133379244072>")
                                .setStyle(ButtonStyle.Secondary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("setup_loop")
                                .setEmoji("<:loop:1301126862772371489>")
                                .setStyle(ButtonStyle.Secondary)
                        );

                    //menu
                    const filterRow = new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("filterSelect")
                            .setPlaceholder("Select a filter")
                            .addOptions(
                                {
                                    label: "Bass Boost",
                                    description: "Apply a bass boost filter",
                                    value: "bassboost",
                                    emoji: "<:filters:1243212306842783836>",
                                },
                                {
                                    label: "Nightcore",
                                    description: "Apply a nightcore filter",
                                    value: "nightcore",
                                    emoji: "<:filters:1243212306842783836>",
                                },
                                {
                                    label: "Vaporwave",
                                    description: "Apply a vaporwave filter",
                                    value: "vaporwave",
                                    emoji: "<:filters:1243212306842783836>",
                                },
                                {
                                    label: "Tremolo",
                                    description: "Apply a tremolo filter",
                                    value: "tremolo",
                                    emoji: "<:filters:1243212306842783836>",
                                },
                                {
                                    label: "Vibrato",
                                    description: "Apply a vibrato filter",
                                    value: "vibrato",
                                    emoji: "<:filters:1243212306842783836>",
                                },
                                {
                                    label: "Karaoke",
                                    description: "Apply a karaoke filter",
                                    value: "karaoke",
                                    emoji: "<:filters:1243212306842783836>",
                                },
                                {
                                    label: "Distortion",
                                    description: "Apply a distortion filter",
                                    value: "distortion",
                                    emoji: "<:filters:1243212306842783836>",
                                },
                                {
                                    label: "None",
                                    description: "Remove all filters",
                                    value: "none",
                                    emoji: "<:reset:1249250249462255617>",
                                }
                            )
                    );

                    let msg = await channel.send({
                        embeds: [em1, em],
                        //content: content,
                        components: [filterRow, row, row2],
                    });

                    await setupData.updateOne(
                        { guildId: interaction.guild.id },
                        {
                            $set: {
                                channelId: channel.id,
                                messageId: msg.id,
                                // prefixz: prefix,
                            },
                        },
                        { upsert: true }
                    );

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setTitle(`Setup Created`)
                                .setDescription(
                                    `${client.emoji.tick} | Successfully **Created** Music Setup at ${channel}`
                                ),
                        ],
                    });
                }

                if (type === 'delete') {
                    console.log('If statement = Delete');
                    if (!data || (data && !data.channelId) || (data && !data.messageId)) {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(
                                        `${client.emoji.cross} | There is no setup for this guild right now!`
                                    ),
                            ],
                        });
                    }

                    let ch = interaction.guild.channels.cache.get(data.channelId);

                    if (ch) {
                        let msg = await ch.messages.fetch(data.messageId).catch(() => {});
                        if (msg) msg.delete().catch((e) => {});
                    }
                    await data.deleteOne();
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setTimestamp()
                                .setTitle(`Deleted`)
                                .setDescription(
                                    `${client.emoji.tick} | Successfully **Deleted** Server Music Setup`
                                ),
                        ],
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
};
