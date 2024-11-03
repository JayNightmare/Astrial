const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");

const db = require("../models/SetupSchema");

module.exports = async (client) => {
  client.on("interactionCreate", async (interaction) => {
    let player = client.manager.players.get(interaction.guildId);

    if (interaction.isButton()) {
      if (interaction.customId === "setup_pause") {
        if (await check(interaction, player)) {
          const isPaused = player.paused;
          await player.pause(!isPaused);  // Toggle pause state

          // Set the new emoji based on the updated player state
          const stateEmoji = isPaused ? "<:pause:1301123947290427454>" : "<:resume:1301124075527209001>";
          
          
          const filterRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId("filterSelect")
              .setPlaceholder("Select a filter")
              .addOptions(
                {
                  label: "Bass Boost",
                  description: "Apply a bass boost filter",
                  value: "bassboost",
                  emoji: "<:filter:1301124165029335050>",
                },
                {
                  label: "Nightcore",
                  description: "Apply a nightcore filter",
                  value: "nightcore",
                  emoji: "<:filter:1301124165029335050>",
                },
                {
                  label: "Vaporwave",
                  description: "Apply a vaporwave filter",
                  value: "vaporwave",
                  emoji: "<:filter:1301124165029335050>",
                },
                {
                  label: "Tremolo",
                  description: "Apply a tremolo filter",
                  value: "tremolo",
                  emoji: "<:filter:1301124165029335050>",
                },
                {
                  label: "Vibrato",
                  description: "Apply a vibrato filter",
                  value: "vibrato",
                  emoji: "<:filter:1301124165029335050>",
                },
                {
                  label: "Karaoke",
                  description: "Apply a karaoke filter",
                  value: "karaoke",
                  emoji: "<:filter:1301124165029335050>",
                },
                {
                  label: "Distortion",
                  description: "Apply a distortion filter",
                  value: "distortion",
                  emoji: "<:filter:1301124165029335050>",
                },
                {
                  label: "None",
                  description: "Remove all filters",
                  value: "none",
                  emoji: "<:replay:1301124117956657194>",
                }
              )
          );

          const row = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
              .setCustomId("setup_vol+")
              .setEmoji("<:volup:1301123976952811520>")
              .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId("setup_skip")
                .setEmoji("<:skip:1301124025531109436>")
                .setStyle(ButtonStyle.Secondary)
              )
            .addComponents(
              new ButtonBuilder()
                .setCustomId("setup_pause")
                .setEmoji(stateEmoji)  // Use the updated emoji based on state
                .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId("setup_stop")
                .setEmoji("<:stop:1301124016555294792>")
                .setStyle(ButtonStyle.Danger)
              )
            .addComponents(
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
              .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
            new ButtonBuilder()
              .setCustomId("setup_replay")
              .setEmoji("<:replay:1301124117956657194>")
              .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
            new ButtonBuilder()
              .setCustomId("setup_clear")
              .setEmoji("<:discotoolsxyzicon37:1301412693978124358>")
              .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
            new ButtonBuilder()
              .setCustomId("setup_autoplay")
              .setEmoji("<:queue:1301124133379244072>")
              .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
            new ButtonBuilder()
              .setCustomId("setup_loop")
              .setEmoji("<:loop:1301126862772371489>")
              .setStyle(ButtonStyle.Secondary)
            )

          // Update the interaction with the new button states
          await interaction.update({
            components: [filterRow, row, row2],
          });

          // Send a confirmation message indicating the updated state
          return await interaction.channel.send({
            content: `<:Correct:1301128918614671403> | Player is ${isPaused ? "Resumed" : "Paused"} by ${interaction.user.username}`,
          }).then((msg) => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }
      } else if (interaction.customId === "setup_autoplay") {
        if (await check(interaction, player)) {
            const autoplayEnabled = player.data.get("autoplay") || false;
            player.data.set("autoplay", !autoplayEnabled);
    
            // If enabling autoplay
            if (!autoplayEnabled) {
                // Fetch recommended tracks immediately
                const fetchRecommendedTracks = async () => {
                    const identifier = player.queue.current.identifier;
                    const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
                    const res = await player.search(search, { requester: interaction.user });
    
                    // Add recommended tracks to the queue
                    if (res.tracks.length > 1) {
                        for (let i = 1; i < res.tracks.length && i <= 3; i++) { // Add up to 3 recommended tracks
                            await player.queue.add(res.tracks[i]);
                        }
                    }
                };
    
                // Fetch the first set of recommended tracks
                await fetchRecommendedTracks();
    
                // Polling to check if the track has finished
                const checkTrackStatus = async () => {
                    const checkInterval = setInterval(async () => {
                        // Check if the current track is finished
                        if (!player.queue.current) {
                            if (player.data.get("autoplay")) {
                                await fetchRecommendedTracks();
                                if (player.queue.length > 0) {
                                    await player.play(); // Automatically play the next track if any are in the queue
                                } else {
                                    clearInterval(checkInterval); // Stop polling if the queue is empty
                                }
                            } else {
                                clearInterval(checkInterval); // Stop polling if autoplay is disabled
                            }
                        }
                    }, 5000); // Check every 5 seconds
                };
    
                checkTrackStatus(); // Start checking track status
            }
    
            await interaction.deferUpdate();
            return await interaction.channel.send({
                content: `<:Correct:1301128918614671403> | Autoplay has been ${!autoplayEnabled ? "enabled" : "disabled"} by ${interaction.user.username}`,
            }).then((msg) => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }
    } else if (interaction.customId === "setup_loop") {
        if (await check(interaction, player)) {
            const currentLoop = player.loop || "none";
            let newLoop;
    
            // Cycle through loop modes: none -> track -> queue -> none
            if (currentLoop === "none") {
                newLoop = "track";
            } else if (currentLoop === "track") {
                newLoop = "queue";
            } else {
                newLoop = "none";
            }
    
            player.setLoop(newLoop);
    
            await interaction.deferUpdate();
            return await interaction.channel.send({
                content: `<:Correct:1301128918614671403> | Loop mode set to ${newLoop} by ${interaction.user.username}`,
            }).then((msg) => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }      
      } else if (interaction.customId === "setup_replay") {
        if (await check(interaction, player)) {
          await player.seek(0);
          await interaction.deferUpdate();
          return await interaction.channel
            .send({
              content: `<:Correct:1301128918614671403> | Replaying the current track.`,
            })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            })
            .catch(() => {});
        }
      } else if (interaction.customId === "setup_skip") {
        if (await check(interaction, player)) {
          await player.skip();
          await interaction.deferUpdate();
          return await interaction.channel
            .send({
              content: `<:Correct:1301128918614671403> | Skipped the track. Action by: ${interaction.user.username}`,
            })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            })
            .catch(() => {});
        }
      } else if (interaction.customId === "setup_shuffle") {
        if (await check(interaction, player)) {
          await interaction.deferUpdate();

          await player.queue.shuffle();

          return await interaction.channel
            .send({
              content: `<:Correct:1301128918614671403> | Player has been shuffled by: ${interaction.user.username}`,
            })
            .then(async (msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            })
            .catch(() => {});
        }
      } else if (interaction.customId === "setup_stop") {
        if (await check(interaction, player)) {
            await interaction.deferUpdate();
    
            // Retrieve and delete the now playing embed message
            const nowPlayingMessage = player.data.get("nowPlayingMessage");
            if (nowPlayingMessage) {
                await nowPlayingMessage.delete().catch(() => {});
                player.data.delete("nowPlayingMessage"); // Clear the reference after deletion
            }
    
            player.setLoop("none");
            player.data.set("autoplay", false);
            player.queue.clear();
            player.skip();
    
            return await interaction.channel
                .send({
                    content: `<:Correct:1301128918614671403> | Player has been stopped by: ${interaction.user.username}`,
                })
                .then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch(() => {});
                    }, 5000);
                });
        }         
      } else if (interaction.customId === "setup_clear") {
        if (await check(interaction, player)) {
          await interaction.deferUpdate();

          player.queue.clear();

          return await interaction.channel
            .send({
              content: `<:Correct:1301128918614671403> | Queue has been cleared by: ${interaction.user.username}`,
            })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            });
        }
      } else if (interaction.customId === "setup_vol+") {
        if (await check(interaction, player)) {
          await interaction.deferUpdate();

          let vol = player.options.volume;
          player.setVolume(vol + 5);

          return await interaction.channel
            .send({
              content: `<:Correct:1301128918614671403> | Volume has been changed by: ${interaction.user.username}`,
            })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            });
        }
      } else if (interaction.customId === "setup_vol-") {
        if (await check(interaction, player)) {
          await interaction.deferUpdate();

          let vol = player.options.volume;
          player.setVolume(vol - 5);

          return await interaction.channel
            .send({
              content: `<:Correct:1301128918614671403> | Volume has been changed by: ${interaction.user.username}`,
            })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            });
        }
      }
    } else if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "filterSelect") {
        if (await check(interaction, player)) {
          await interaction.deferUpdate();
          const selectedFilter = interaction.values[0];
          await applyFilter(player, selectedFilter);

          const embed = new EmbedBuilder()
            .setDescription(`<:Correct:1301128918614671403> | **Filter applied:** \`${selectedFilter}\``)
            .setColor(client.color);

          interaction.channel
            .send({ embeds: [embed], ephemeral: true })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            });
        }
      }
    }
    async function check(interaction, player) {
      if (interaction.isButton() || interaction.isStringSelectMenu()) {
        if (!interaction.member.voice.channel) {
          await interaction.reply({
            content: `<:cross:1301129244855763027> | You must be sitting in a voice channel.`,
            ephemeral: true,
          });
          return false;
        }

        if (
          interaction.guild.members.me.voice.channel &&
          interaction.member.voice.channel.id !==
            interaction.guild.members.me.voice.channel.id
        ) {
          await interaction.reply({
            content: `<:cross:1301129244855763027> | You must be in the same voice channel.`,
            ephemeral: true,
          });
          return false;
        }

        if (!player) {
          await interaction.reply({
            content: `<:cross:1301129244855763027> | Player doesn't exist currently.`,
            ephemeral: true,
          });
          return false;
        }
      }
      return true;
    }
  });
};

async function applyFilter(player, filter) {
  switch (filter) {
    case "bassboost":
      await player.shoukaku.setFilters({
        equalizer: [
          { band: 0, gain: 0.25 },
          { band: 1, gain: 0.25 },
          { band: 2, gain: 0.25 },
          { band: 3, gain: 0.25 },
          { band: 4, gain: 0.25 },
          { band: 5, gain: 0.25 },
          { band: 6, gain: 0.25 },
          { band: 7, gain: 0.25 },
          { band: 8, gain: 0.25 },
          { band: 9, gain: 0.25 },
        ],
      });
      break;
    case "nightcore":
      await player.shoukaku.setFilters({
        timescale: { pitch: 1.25, rate: 1.25 },
      });
      break;
    case "vaporwave":
      await player.shoukaku.setFilters({
        timescale: { pitch: 0.85, rate: 0.85 },
      });
      break;
    case "tremolo":
      await player.shoukaku.setFilters({
        tremolo: { frequency: 2.0, depth: 0.5 },
      });
      break;
    case "vibrato":
      await player.shoukaku.setFilters({
        vibrato: { frequency: 2.0, depth: 0.5 },
      });
      break;
    case "karaoke":
      await player.shoukaku.setFilters({
        karaoke: {
          level: 1.0,
          monoLevel: 1.0,
          filterBand: 220.0,
          filterWidth: 100.0,
        },
      });
      break;
    case "distortion":
      await player.shoukaku.setFilters({
        distortion: {
          sinOffset: 0.5,
          sinScale: 0.5,
          cosOffset: 0.5,
          cosScale: 0.5,
          tanOffset: 0.5,
          tanScale: 0.5,
          offset: 0.5,
          scale: 0.5,
        },
      });
      break;
    case "none":
      await player.shoukaku.setFilters({});
      break;
  }
}
