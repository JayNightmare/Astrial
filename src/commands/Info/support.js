const { Message, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, Component, ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "support",
  aliases: ["sup"],
  description: "Get Bot support server link !!",
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Info",
  cooldown: 5,

  run: async (client, message, args, prefix) => {

    let embed = new EmbedBuilder().setColor(client.color).setDescription(`You Can Join Support Server By Below Button`)
    
    const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
          .setLabel("Support Server")
          .setStyle(ButtonStyle.Link)
          .setURL(`${client.config.ssLink}`)
    );
    return message.reply({ embeds: [embed], components: [row] });
  },
};
