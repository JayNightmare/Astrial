const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Google } = require("@flytri/lyrics-finder");

module.exports = {
  name: "lyrics",
  description: `Display lyrics of a song.`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Music",
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

    if (!args[0]) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription("<:cross:1301129244855763027> | Give me a song name for Lyrics");
      return message.reply({ embeds: [embed] });
    }

    let song = args.join(" ");

    let result = null;

    try {
      result = await Google(`${args.join(" ")}`, `en`);
      if (!result) return message.reply(`<:cross:1301129244855763027> | No lyrics found for ${song}`);

      if (result.lyrics) {
        const lyricsEmbed = new EmbedBuilder()
          .setColor(client.color)
          .setTitle(`Lyrics for ${song}`)
          .setDescription(
            result.lyrics?.length < 4096
              ? result?.lyrics
              : result.lyrics?.slice(0, 4080) + "\n.........."
          )
          .setTimestamp();
        return message.reply({ embeds: [lyricsEmbed] });
      }
    } catch (err) {
      //console.log(err);
      return message.reply(`No lyrics found for ${song}`);
    }
  },
};
