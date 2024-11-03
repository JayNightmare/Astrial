const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "stop",
  description: `Stops The Player.`,
  category: "Music",
  cooldown: 5,
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

    player.setLoop("none");
    player.data.set("autoplay", false);
    player.queue.clear();
    player.skip();

    // Remove the "now playing" message if it exists
    const nowPlayingMessage = player.data.get("nowPlayingMessage");
    if (nowPlayingMessage) {
      try {
        await nowPlayingMessage.delete();
      } catch (error) {
        console.error("Error deleting 'now playing' message:", error);
      }
      player.data.delete("nowPlayingMessage"); // Clear the reference
    }

    return message.react("<:Correct:1301128918614671403>");
  },
};
