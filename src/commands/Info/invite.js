const {
  Message,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "invite",
  aliases: ["inv"],
  description: "invite me",
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Info",
  cooldown: 5,
  //premium: false,

  run: async (client, message, args, prefix) => {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Invite Astrial")
        .setStyle(ButtonStyle.Link)
        .setURL(
          `https://discordapp.com/oauth2/authorize?client_id=1050445107389804646&permissions=8&scope=applications.commands%20bot`
        ),
      new ButtonBuilder()
        .setLabel("Support Server")
        .setStyle(ButtonStyle.Link)
        .setURL(`${client.config.ssLink}`)
    );

    message.reply({ content: `**Invite Me In Your Servers, For High Quality Music Ever!**`, components: [row] });
  },
};
