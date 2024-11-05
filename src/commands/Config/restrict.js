const Restriction = require("../../models/RestrictionSchema.js");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "restrict",
    aliases: ["res"],
    description: "Restrict or Unrestrict Channels",
    category: "Moderation",
    cooldown: 5,
    premium: false,

    run: async (client, message, args) => {
        // Permission check
        if (
            !message.member.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        ) {
            return message.reply(
                "${client.emoji.cross} | You do not have permission to use this command."
            );
        }

        const [type, ...rest] = args;

        // Ensure type is provided
        if (!type) {
            return message.reply(
                `${client.emoji.cross} | Please provide a type (e.g., \`text\`, \`voice\`, \`reset\`).`
            );
        }

        // Validate the type
        if (type === "reset") {
            // Reset all restrictions
            let restrictionData = await Restriction.findOne({
                guildId: message.guild.id,
            });
            if (!restrictionData) {
                restrictionData = new Restriction({
                    guildId: message.guild.id,
                });
            }
            restrictionData.restrictedTextChannels = [];
            restrictionData.restrictedVoiceChannels = [];
            await restrictionData.save();
            return message.reply(
                "<:Correct:1301128918614671403> | All channel restrictions have been reset."
            );
        }

        // Fetch the channel either by mention or ID
        const channel =
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(rest[0]);
        if (!channel) {
            return message.reply(
                `${client.emoji.cross} | Please mention a valid channel or provide a valid channel ID.`
            );
        }

        // Find or create the restriction document for this guild
        let restrictionData = await Restriction.findOne({
            guildId: message.guild.id,
        });
        if (!restrictionData) {
            restrictionData = new Restriction({ guildId: message.guild.id });
        }

        // Handle different types of restrictions
        if (type === "text") {
            // Restrict Text Channel
            if (restrictionData.restrictedTextChannels.includes(channel.id)) {
                return message.reply(
                    "${client.emoji.cross} | This text channel is already restricted."
                );
            }
            restrictionData.restrictedTextChannels.push(channel.id);
            await restrictionData.save();
            return message.reply(
                `<:Correct:1301128918614671403> | Text channel <#${channel.id}> has been restricted.`
            );
        } else if (type === "voice") {
            // Restrict Voice Channel
            if (restrictionData.restrictedVoiceChannels.includes(channel.id)) {
                return message.reply(
                    "${client.emoji.cross} | This voice channel is already restricted."
                );
            }
            restrictionData.restrictedVoiceChannels.push(channel.id);
            await restrictionData.save();
            return message.reply(
                `<:Correct:1301128918614671403> | Voice channel <#${channel.id}> has been restricted.`
            );
        } else {
            return message.reply(
                "${client.emoji.cross} | Invalid type. Please use `text`, `voice`, or `reset`."
            );
        }
    },

    // //

    // ! Slash Logic
    restrict: {
        execute: async (client, interaction) => {
            await interaction.deferReply();

            // Permission check
            if (
                !interaction.member.permissions.has(
                    PermissionsBitField.Flags.Administrator
                )
            ) {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.cross} | You do not have permission to use this command`
                    );

                await interaction.followUp({ embeds: [embed] });
            }

            const type = interaction.options.getString("type");

            // Ensure type is provided
            if (!type) {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.cross} | Please provide a type (e.g., \`text\`, \`voice\`, \`reset\`)`
                    );

                await interaction.followUp({ embeds: [embed] });
            }

            // Validate the type
            if (type === "reset") {
                // Reset all restrictions
                let restrictionData = await Restriction.findOne({
                    guildId: interaction.guild.id,
                });
                if (!restrictionData) {
                    restrictionData = new Restriction({
                        guildId: interaction.guild.id,
                    });
                }
                restrictionData.restrictedTextChannels = [];
                restrictionData.restrictedVoiceChannels = [];
                await restrictionData.save();
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.tick} | All channel restrictions have been reset`
                    );

                await interaction.followUp({ embeds: [embed] });
            }

            // Fetch the channel either by mention or ID
            const channel = interaction.options.getChannel("channel");
            if (!channel) {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.cross} | Please mention a valid channel or provide a valid channel ID`
                    );

                await interaction.followUp({ embeds: [embed] });
            }

            // Find or create the restriction document for this guild
            let restrictionData = await Restriction.findOne({
                guildId: interaction.guild.id,
            });
            if (!restrictionData) {
                restrictionData = new Restriction({
                    guildId: interaction.guild.id,
                });
            }

            // Handle different types of restrictions
            if (type === "text") {
                // Restrict Text Channel
                if (
                    restrictionData.restrictedTextChannels.includes(channel.id)
                ) {
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | This text channel is already restricted`
                        );

                    await interaction.editReply({ embeds: [embed] });
                } else {
                    restrictionData.restrictedTextChannels.push(channel.id);
                    await restrictionData.save();
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.tick} | Text channel <#${channel.id}> has been restricted`
                        );

                    await interaction.editReply({ embeds: [embed] });
                }
            } else if (type === "voice") {
                // Restrict Voice Channel
                if (
                    restrictionData.restrictedVoiceChannels.includes(channel.id)
                ) {
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | This voice channel is already restricted`
                        );

                    await interaction.followUp({ embeds: [embed] });
                } else {
                    restrictionData.restrictedVoiceChannels.push(channel.id);
                    await restrictionData.save();
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.tick} | Voice channel <#${channel.id}> has been restricted`
                        );

                    await interaction.editReply({ embeds: [embed] });
                }
            } else {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.cross} | Invalid type. Please use \`text\`, \`voice\`, or \`reset\``
                    );

                await interaction.followUp({ embeds: [embed] });
            }
        },
    },
};
