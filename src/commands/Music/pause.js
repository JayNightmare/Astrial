const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "pause",
  aliases: ["pause"],
  description: `pause the music`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  premium: false,
  dj: true,
  run: async (client, message, args, prefix, player) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription("<:cross:1301129244855763027> | No Player Found For This Guild!")
        .setColor(client.config.color);
      return message.channel.send({ embeds: [embed] });
    }

    await player.pause(player.playing);
    const uni = player.paused ? `Paused` : `Resumed`;

    const embed = new EmbedBuilder()
      .setDescription(`<:Correct:1301128918614671403> | *Song has been:* \`${uni}\``)
      .setColor(client.color);

    return message.reply({ embeds: [embed] });
  },
};
