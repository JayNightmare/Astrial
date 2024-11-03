const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "volume",
  aliases: ["vol", "v"],
  description: `Control the volume of the song.`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  dj: true,
  run: async (client, message, args, prefix, player) => {
    //const { channel } = message.member.voice;
    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription("<:cross:1301129244855763027> | No Player Found For This Guild!")
        .setColor(client.config.color);
      return message.channel.send({ embeds: [embed] });
    }
    if (!args[0]) {
      const embed = new EmbedBuilder()
        .setDescription(`The current volume is **${player.options.volume}%**`)
        .setColor(client.color);
      return message.reply({ embeds: [embed] });
    }

    if (args[0] < 1 || args[0] > 200 || isNaN(args[0])) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`Enter a volume amount between **1 - 200**`),
        ],
      });
    }
    if (player.options.volume === args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `<:cross:1301129244855763027> | Volume is already **${player.options.volume}%**.`
            ),
        ],
      });
    }
    player.setVolume(args[0]);
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`<:Correct:1301128918614671403> | Volume is now set to **${args[0]}%**`),
      ],
    });
  },
};
