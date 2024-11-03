const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "chipmunk",
  description: `Set a filter for current song.`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Filters",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  dj: true,
  voteOnly: false,
  premium: false,
  run: async (client, message, args, prefix, player) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription("<:cross:1301129244855763027> | No Player Found For This Guild!")
        .setColor(client.config.color);
      return message.channel.send({ embeds: [embed] });
    }

    const data = {
        op: 'filters',
        guildId: message.guild.id,
        timescale: {
            speed: 1.05,
            pitch: 1.35,
            rate: 1.25
        },
    }

    await player.shoukaku.setFilters(data);

    const embed = new EmbedBuilder()
        .setDescription(`<:Correct:1301128918614671403> | **Turned on**: \`Chipmunk\``)
        .setColor(client.color);

    await delay(5000);
    message.reply({ embeds: [embed] });
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
