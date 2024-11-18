const Restriction = require("../../models/RestrictionSchema.js");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "unrestrict",
    aliases: ["unres"],
    description: "Unrestrict Channels",
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
                "You do not have permission to use this command."
            );
        }

        const [type] = args;

        // Ensure type is provided
        if (!type) {
            return message.reply(
                "Please provide a type (e.g., `text` or `voice`)."
            );
        }

        // Fetch the channel either by mention or ID
        const channel =
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(args[1]);
        if (!channel) {
            return message.reply(
                "Please mention a valid channel or provide a valid channel ID."
            );
        }

        // Find the restriction document for this guild
        let restrictionData = await Restriction.findOne({
            guildId: message.guild.id,
        });
        if (!restrictionData) {
            return message.reply("No restrictions found for this server.");
        }

        // Handle unrestricting for text channels
        if (type === "text") {
            restrictionData.restrictedTextChannels =
                restrictionData.restrictedTextChannels.filter(
                    (id) => id !== channel.id
                );
            await restrictionData.save();
            return message.reply(
                `Text channel <#${channel.id}> has been unrestricted.`
            );
        }
        // Handle unrestricting for voice channels
        else if (type === "voice") {
            restrictionData.restrictedVoiceChannels =
                restrictionData.restrictedVoiceChannels.filter(
                    (id) => id !== channel.id
                );
            await restrictionData.save();
            return message.reply(
                `Voice channel <#${channel.id}> has been unrestricted.`
            );
        } else {
            return message.reply("Invalid type. Please use `text` or `voice`.");
        }
    },

    // TODO : Add Slash Logic
    unrestrict: {
        execute: async (client, interaction) => {
        try {
            await interaction.deferReply();

            // Permission check
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
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

            // Fetch the channel either by mention or ID
            const channel = interaction.options.getChannel("channel");
            let restrictionData = await Restriction.findOne({
              guildId: interaction.guild.id,
            });
            if (!channel) {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.cross} | Please mention a valid channel or provide a valid channel ID`
                    );

                await interaction.followUp({ embeds: [embed] });
            } else {
                if (!restrictionData) {
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | No restrictions found for this server`
                        );

                    await interaction.followUp({ embeds: [embed] });
                }
            }

            // Handle unrestricting for text channels
            if (type === "text") {
                restrictionData.restrictedTextChannels =
                    restrictionData.restrictedTextChannels.filter(
                        (id) => id !== channel.id
                    );
                await restrictionData.save();
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.tick} | Text channel <#${channel.id}> has been unrestricted`
                    );

                await interaction.followUp({ embeds: [embed] });
            }
            // Handle unrestricting for voice channels
            else if (type === "voice") {
                restrictionData.restrictedVoiceChannels =
                    restrictionData.restrictedVoiceChannels.filter(
                        (id) => id !== channel.id
                    );
                await restrictionData.save();

                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.tick} | Voice channel <#${channel.id}> has been unrestricted`
                    );
                await interaction.followUp({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.cross} | Invalid type. Please use \`text\` or \`voice\``
                    );
                await interaction.followUp({ embeds: [embed] });
            }
        
          } catch (err) {
            const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.cross} | Command Failed`
                    );
            await interaction.followUp({ embeds: [embed] });
            console.error(err);
          }
        },
    },
};
