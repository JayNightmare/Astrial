const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");
const setup = require("../models/SetupSchema.js");

const updateMessage = async (player, client, track) => {
  const updateData = await setup.findOne({ guildId: player.guildId });
  if (updateData) {
    try {
      const channel = await client.channels.fetch(updateData.channelId);
      const message = await channel.messages.fetch(updateData.messageId);

      const title = track
        ? `>>> **Now Playing**: **[${track.title.length > 50 ? track.title.slice(0, 50) + "..." : track.title || "Unknown Track"}](${client.config.ssLink})**\n**Artist**: ${track.author || "Unknown Artist"}\n**Duration**: ${convertMilliseconds(track.length)}\n**Requestor**: ${track.requester || "**Astrial**"} `
        : "__**Join a Voice Channel & Request a Song**__\n**Unleash Your Music Vibes with Astrial!** : Join us in the voice chat and request your favorite songs! Experience the ultimate sound quality and let the music take you higher!";

      let em1 = new EmbedBuilder()
        .setColor(client.color)
        .setImage("https://media.discordapp.net/attachments/1241172519176769549/1301402599156875267/Picsart_24-10-31_09-58-42-473.jpg?ex=6724591e&is=6723079e&hm=7fe972668a4174b296f7d44c236d96772425c78ae0a7dfe598e4fbf97bb31a4b&=&format=webp&width=1440&height=587");

      let embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(title)
        .setImage(`${client.config.setupBgLink}`)
        .setAuthor({
          name: `Astrial - Requests`,
          iconURL: message.guild.iconURL({ dynamic: true }),
        })
        .setFooter({
          text: `| Thanks for choosing ${client.user.username}`,
          iconURL: client.user.displayAvatarURL(),
        });

      const filterRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("filterSelect")
          .setPlaceholder("Select a filter")
          .addOptions(
            { label: "Bass Boost", description: "Apply a bass boost filter", value: "bassboost", emoji: "<:filter:1301124165029335050>" },
            { label: "Nightcore", description: "Apply a nightcore filter", value: "nightcore", emoji: "<:filter:1301124165029335050>" },
            { label: "Vaporwave", description: "Apply a vaporwave filter", value: "vaporwave", emoji: "<:filter:1301124165029335050>" },
            { label: "Tremolo", description: "Apply a tremolo filter", value: "tremolo", emoji: "<:filter:1301124165029335050>" },
            { label: "Vibrato", description: "Apply a vibrato filter", value: "vibrato", emoji: "<:filter:1301124165029335050>" },
            { label: "Karaoke", description: "Apply a karaoke filter", value: "karaoke", emoji: "<:filter:1301124165029335050>" },
            { label: "Distortion", description: "Apply a distortion filter", value: "distortion", emoji: "<:filter:1301124165029335050>" },
            { label: "None", description: "Remove all filters", value: "none", emoji: "<:replay:1301124117956657194>" }
          )
      );

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("setup_vol+")
            .setEmoji("<:volup:1301123976952811520>")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("setup_skip")
            .setEmoji("<:skip:1301124025531109436>")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("setup_pause")
            .setEmoji(player.paused ? "<:resume:1301124075527209001>" : "<:pause:1301123947290427454>")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("setup_stop")
            .setEmoji("<:stop:1301124016555294792>")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId("setup_vol-")
            .setEmoji("<:voldown:1301123997806886943>")
            .setStyle(ButtonStyle.Secondary)
        );

      const row2 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("setup_shuffle")
            .setEmoji("<:shuffle:1301124480676134985>")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("setup_replay")
            .setEmoji("<:replay:1301124117956657194>")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("setup_clear")
            .setEmoji("<:discotoolsxyzicon37:1301412693978124358>")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("setup_autoplay")
            .setEmoji("<:queue:1301124133379244072>")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("setup_loop")
            .setEmoji("<:loop:1301126862772371489>")
            .setStyle(ButtonStyle.Secondary)
        );

      await message.edit({
        embeds: [em1, embed],
        components: [filterRow, row, row2],
      });
    } catch (error) {
      console.error("Error editing message:", error);
    }
  }
};

module.exports = updateMessage;

function convertMilliseconds(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hoursStr = hours > 0 ? hours + ":" : "";
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const secondsStr = seconds < 10 ? "0" + seconds : seconds;

  return `${hoursStr}${minutesStr}:${secondsStr}`;
}
