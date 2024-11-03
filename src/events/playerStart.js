const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  AttachmentBuilder,
} = require("discord.js");
const setup = require("../models/SetupSchema.js");
const updateMessage = require("../handlers/setupQueue.js");
const { ClassicPro } = require('musicard');
const fs = require("fs");

module.exports = async (client) => {
  client.manager.on("playerStart", async (player, track) => {
    try {
      const updateData = await setup.findOne({ guildId: player.guildId });
      await updateMessage(player, client, track);
      
      if (updateData && updateData.channelId == player.textId) return;

      player.previousTrack = player.currentTrack || null;
      player.currentTrack = track;
      
      const embeded = createEmbed(track, client);
      
      // Default to "special" mode actions
      const componentRows = setupSpecialPlayerButtons(player, track);
      const nplaying = await client.channels.cache
        .get(player.textId)
        .send({ embeds: [embeded], components: componentRows });

         // Store reference to the now-playing message
      player.data.set("nowPlayingMessage", nplaying);

      const filter = (interaction) => (
        interaction.guild.members.me.voice.channel &&
        interaction.guild.members.me.voice.channelId === interaction.member.voice.channelId
      );

      const collector = nplaying.createMessageComponentCollector({
        filter,
        time: player.queue.current.length,
      });

      collector.on("collect", async (interaction) => {
        await handleInteraction(interaction, player, client, track, nplaying, embeded);
      });

      collector.on("end", async (collected, reason) => {
        if (reason === "time") {
          nplaying.edit({ embeds: [embeded], components: [] });
        }
      });
    } catch (error) {
      console.error(`Error in playerStart for guild ${player.guildId}:`, error);
    }
  });
};

function createEmbed(track, client) {
  return new EmbedBuilder()
    .setAuthor({ name: "| Now Playing", iconURL: client.user.displayAvatarURL() })
    .setDescription(`**[${track.title.length > 50 ? track.title.slice(0, 50) + "... " : track.title || "Unknown Track"}](${client.config.ssLink})**`)
    .addFields(
      { name: `Author:`, value: `${track.author || "Unknown"}`, inline: true },
      { name: `Requester:`, value: `${track.requester || "**Astrial**"}`, inline: true },
      { name: `Duration:`, value: `${convertMilliseconds(track.length)}`, inline: true }
    )
    .setThumbnail(track.thumbnail)
    .setColor(client.color)
    .setTimestamp();
}

function setupSpecialPlayerButtons(player, track) {
  const specialrow1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("previous").setEmoji("<:previous:1301123961618436160>").setStyle(ButtonStyle.Secondary).setDisabled(!player.previousTrack),
    new ButtonBuilder().setCustomId("pause").setEmoji(player.paused ? "<:resume:1301124075527209001>" : "<:pause:1301123947290427454>").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("skip").setEmoji("<:skip:1301124025531109436>").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("stop").setEmoji("<:stop:1301124016555294792>").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("replay").setEmoji("<:replay:1301124117956657194>").setStyle(ButtonStyle.Secondary)
  );

  const specialrow2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("volumeUp").setEmoji("<:volup:1301123976952811520>").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("volumeDown").setEmoji("<:voldown:1301123997806886943>").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("loop").setEmoji("<:loop:1301126862772371489>").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("shuffle").setEmoji("<:shuffle:1301124480676134985>").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("save").setEmoji("<:save:1301124058146013195>").setStyle(ButtonStyle.Secondary)
  );

  const specialFilterRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("filterSelect")
      .setPlaceholder("Select a filter...")
      .addOptions([
        { label: "Bass Boost", description: "Apply Bassboost Filter To Current Playing", emoji: "<:filter:1301124165029335050>", value: "bassboost" },
        { label: "Nightcore", description: "Apply Nightcore Filter To Current Playing", emoji: "<:filter:1301124165029335050>", value: "nightcore" },
        { label: "Vaporwave", description: "Apply Vaporwave Filter To Current Playing", emoji: "<:filter:1301124165029335050>", value: "vaporwave" },
        { label: "Tremolo", description: "Apply Tremolo Filter To Current Playing", emoji: "<:filter:1301124165029335050>", value: "tremolo" },
        { label: "Vibrato", description: "Apply Vibrato Filter To Current Playing", emoji: "<:filter:1301124165029335050>", value: "vibrato" },
        { label: "Karaoke", description: "Apply Karaoke Filter To Current Playing", emoji: "<:filter:1301124165029335050>", value: "karaoke" },
        { label: "Distortion", description: "Apply Distortion Filter To Current Playing", emoji: "<:filter:1301124165029335050>", value: "distortion" },
        { label: "None", description: "Reset All Filters From Current Playing", emoji: "<:replay:1301124117956657194>", value: "none" },
      ])
  );

  return [specialFilterRow, specialrow1, specialrow2];
}

async function handleInteraction(interaction, player, client, track, nplaying, embeded) {
  const id = interaction.customId;
  switch (id) {
    case "pause":
      await handlePause(player, interaction, nplaying, embeded);
      break;
    case "skip":
      await handleSkip(player, interaction, nplaying, embeded);
      break;
    case "stop":
      await handleStop(player, interaction, nplaying);
      break;
    case "replay":
      await handleReplay(player, interaction, nplaying, embeded);
      break;
    case "shuffle":
      await handleShuffle(player, interaction);
      break;
    case "previous":
      await handlePrevious(player, interaction, nplaying, embeded);
      break;
    case "volumeUp":
      await handleVolumeUp(player, interaction);
      break;
    case "volumeDown":
      await handleVolumeDown(player, interaction);
      break;
    case "loop":
      await handleLoop(player, interaction);
      break;
    case "save":
      await handleSave(interaction, track, client);
      break;
  }
}

async function handlePause(player, interaction, nplaying, embeded) {
  await player.pause(!player.paused);
  const pauseState = player.paused ? "Paused" : "Resumed";
  const pauseEmbed = new EmbedBuilder()
    .setDescription(`<:Correct:1301128918614671403> | **Song has been:** \`${pauseState}\``)
    .setColor("#00FF00");

  await interaction.update({ embeds: [embeded], components: setupSpecialPlayerButtons(player, player.currentTrack) });
  interaction.followUp({ embeds: [pauseEmbed], ephemeral: true });
}

async function handleSkip(player, interaction, nplaying, embeded) {
  // Remove buttons/filter menu from the previous message
  await nplaying.edit({ components: [] });

  await player.skip();
  const skipEmbed = new EmbedBuilder()
    .setDescription("<:Correct:1301128918614671403> | **Song has been:** `Skipped`")
    .setColor("#00FF00");

  interaction.reply({ embeds: [skipEmbed], ephemeral: true });
}

async function handleStop(player, interaction, nplaying) {
  if (!player) {
    return; // Player does not exist
  }

  await player.setLoop("none");
  await player.data.set("autoplay", false);
  await player.queue.clear();
  await player.skip();

  const stopEmbed = new EmbedBuilder()
    .setDescription("<:Correct:1301128918614671403> | **Song has been:** `Stopped`")
    .setColor("#FF0000");

  try {
    // Remove components here as well
    await nplaying.edit({ embeds: [stopEmbed], components: [] });
  } catch (error) {
    console.error("Error editing message:", error);
  }

  await interaction.reply({ embeds: [stopEmbed], ephemeral: true });
}




async function handleReplay(player, interaction, nplaying, embeded) {
  await player.seek(0);
  const replayEmbed = new EmbedBuilder()
    .setDescription("<:Correct:1301128918614671403> | **Song has been:** `Replayed`")
    .setColor("#00FF00");

  await nplaying.edit({ embeds: [embeded], components: setupSpecialPlayerButtons(player, player.currentTrack) });
  interaction.reply({ embeds: [replayEmbed], ephemeral: true });
}

async function handleShuffle(player, interaction) {
  await player.queue.shuffle();
  const shuffleEmbed = new EmbedBuilder()
    .setDescription(`<:Correct:1301128918614671403> | **Queue has been:** \`Shuffled\``)
    .setColor("#00FF00");

  interaction.reply({ embeds: [shuffleEmbed], ephemeral: true });
}

async function handlePrevious(player, interaction, nplaying, embeded) {
  const previousTrack = player.previousTrack;
  if (!previousTrack) {
    const errorEmbed = new EmbedBuilder()
      .setColor("#FF0000")
      .setDescription("**No Previous Track to Play**");
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  // Play the previous track
  await player.play(previousTrack);
  const backEmbed = new EmbedBuilder()
    .setDescription("<:Correct:1301128918614671403> | **Replaying Previous Track**")
    .setColor("#00FF00");

  await nplaying.edit({ embeds: [embeded], components: [] });
  interaction.reply({ embeds: [backEmbed], ephemeral: true });
}

async function handleVolumeUp(player, interaction) {
  let volumeUp = player.volume + 10;
  if (volumeUp > 100) volumeUp = 100;
  player.setVolume(volumeUp);
  interaction.reply({ content: `Volume increased to ${volumeUp}.`, ephemeral: true });
}

async function handleVolumeDown(player, interaction) {
  let volumeDown = player.volume - 10;
  if (volumeDown < 0) volumeDown = 0;
  player.setVolume(volumeDown);
  interaction.reply({ content: `Volume decreased to ${volumeDown}.`, ephemeral: true });
}

async function handleLoop(player, interaction) {
  if (player.loop === "none") {
    player.setLoop("track");
    interaction.reply({ content: "Looping current track.", ephemeral: true });
  } else {
    player.setLoop("none");
    interaction.reply({ content: "Loop disabled.", ephemeral: true });
  }
}

async function handleSave(interaction, track, client) {
  const savedEmbed = new EmbedBuilder()
    .setAuthor({ name: "Saved song to DM", iconURL: client.user.displayAvatarURL() })
    .setDescription(
      `<:queue:1301124133379244072> | **Saved [${track.title}](${client.config.ssLink}) to your DM.**`
    )
    .addFields(
      { name: "Song Duration", value: `\`${convertMilliseconds(track.length)}\``, inline: true },
      { name: "Song Author", value: `\`${track.author || "Unknown"}\``, inline: true },
      { name: "Requested Guild", value: `\`${interaction.guild.name}\``, inline: true }
    )
    .setThumbnail(`${track.thumbnail}`)
    .setColor(client.color);

  try {
    await interaction.user.send({ embeds: [savedEmbed] });
    interaction.reply({ content: "<:Correct:1301128918614671403> | Song saved to your DM!", ephemeral: true });
  } catch (error) {
    interaction.reply({
      content: "<:cross:1301129244855763027> | Unable to send DM. Please enable DMs and try again.",
      ephemeral: true,
    });
  }
}


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
