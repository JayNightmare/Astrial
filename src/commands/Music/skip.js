const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: `Skips the song currently playing.`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Music",
  //cooldown: 10,
  inVc: true,
  sameVc: true,
  dj: true,
  run: async (client, message, args, prefix, player) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription("<:cross:1301129244855763027> | No Player Found For This Guild!")
        .setColor(client.config.color);
      return message.channel.send({ embeds: [embed] });
    }

    if (player.paused) {
      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(`<:cross:1301129244855763027> | **Cannot Skip Song While Paused**`);
      return message.channel.send({ embeds: [embed] });
    }
    if (!args[0]) {
      await player.skip();
      return message.react("<:Correct:1301128918614671403>");
    }

    if (isNaN(args[0]))
      return message.channel.send("<:cross:1301129244855763027> | Please provide a valid number!");
    if (args[0] > player.queue.length)
      return message.channel.send("<:cross:1301129244855763027> | The queue is not that long!");
    player.queue.remove(0, parseInt(args[0]));
    player.skip();
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.color)
          .setDescription(`<:Correct:1301128918614671403> | Skipped ${args[0]} song.`),
      ],
    });
  },
};
