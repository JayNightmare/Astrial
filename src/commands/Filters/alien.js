const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("alien-vibes")
    .setDescription("Set an Alien Vibes filter for the current song."),
  cooldown: 5,
  inVc: true,
  sameVc: true,
  dj: true,
  premium: false,
  async execute(interaction, client, player) {
    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription("<:cross:1301129244855763027> | No Player Found For This Guild!")
        .setColor(client.config.color);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Adjusted Alien Vibes filter configuration
    const data = {
      op: "filters",
      guildId: interaction.guild.id,
      timescale: {
        speed: 1.2, // Slightly increased speed
        pitch: 1.8, // High-pitched alien sound
        rate: 1.0, // Normal rate
      },
      vibrato: {
        frequency: 10.0, // Reduced frequency vibrato
        depth: 0.6, // Deep vibrato effect
      },
      echo: {
        delay: 0.4, // Slightly longer delay
        decay: 0.8, // Echo decay remains the same
      },
    };

    await player.shoukaku.setFilters(data);

    const embed = new EmbedBuilder()
      .setDescription("<:Correct:1301128918614671403> | **Turned on**: `Alien Vibes`")
      .setColor(client.color);

    await delay(5000);
    return interaction.reply({ embeds: [embed] });
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
