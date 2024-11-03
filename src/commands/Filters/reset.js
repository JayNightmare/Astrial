const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "reset",
  description: `Reset filters.`,
  aliases: ["cf","clearfilters","clearfilter","resetfilters"],
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Filters",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  voteOnly: false,
  dj: true,
  premium: false,
  run: async (client, message, args, prefix, player) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription("<:cross:1301129244855763027> | No Player Found For This Guild!")
        .setColor(client.config.color);
      return message.channel.send({ embeds: [embed] });
    }

    const data = {
      op: "filters",
      guildId: message.guild.id,
    };

    await player.shoukaku.setFilters(data);
    await player.setVolume(100);

    const resetted = new EmbedBuilder()
      .setDescription(`<:Correct:1301128918614671403> | Successfully \`Reseted\` the Filters`)
      .setColor(client.color);

    await delay(5000);
    message.reply({ embeds: [resetted] });
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
