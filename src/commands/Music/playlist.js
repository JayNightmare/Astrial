// TODO : User can add a playlist from Spotify or SoundCloud (or from YouTube)

const {
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const {
    isValidUrl,
} = require('../../utils-functions/utils-handlers/playlist/spotify.js');
const updateQueue = require("../../handlers/setupQueue.js");

module.exports = {
    name: "playlist",
    aliases: ["pl"],
    description: `play a songs from a playlist`,
    category: "Music",
    cooldown: 30,
    inVc: true,
    sameVc: true,
    dj: true,
    premium: false,
    run: async (client, message, args, prefix) => {
        const check = client.manager.players.get(message.guild.id);
        if (!check) {
            if (!message.member.voice.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Connect)) return message.reply(`<:cross:1301129244855763027> | I don't have permission to join your voice channel!`);
            if (!message.member.voice.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.ViewChannel)) return message.reply(`<:cross:1301129244855763027> | I don't have permission to view your voice channel!`);
            if (!message.member.voice.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Speak)) return message.reply(`<:cross:1301129244855763027> | I don't have permission to speak in your voice channel!`);
        }

        const query = args.join(" ");
        const { channel } = message.member.voice;
        if (!args[0]) return message.reply(`\`\`\`${prefix}playlist <url>\`\`\``);

        const url = message.content.split(' ')[1]; // Extract the URL from the command

        if (!isValidUrl(url)) { return message.reply('Please provide a valid URL.'); }

        try {
            let player = await client.manager.createPlayer({
                guildId: message.guild.id,
                textId: message.channel.id,
                voiceId: channel.id,
                volume: 100,
                deaf: true,
                shardId: message.guild.shardId,
            });

            let result = await client.manager.search(query, {
                requester: message.author,
            });

            if (!result.tracks.length) {
                const embed = new EmbedBuilder()
                    .setDescription(
                        "<:cross:1301129244855763027> | No results found!"
                    )
                    .setColor(client.color);
                return message.reply({ embeds: [embed] });
            }

            if (result.type === "PLAYLIST") for (let track of result.tracks) player.queue.add(track);
            else player.queue.add(result.tracks[0]);

            if (!player.playing && !player.paused) { await player.play(); }

            await updateQueue(message.guild, player.queue);

            if (result.type === "PLAYLIST") {
                const embed = new EmbedBuilder()
                    .setDescription(
                        `<:queue:1301124133379244072> | **Queued** ${result.tracks.length} **from [${result.playlistName}](${client.config.ssLink})**`
                    )
                    .setColor(client.color);
                await updateQueue(message.guild, player.queue);
                return message.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                        `<:queue:1301124133379244072> | **Queued [${
                            result.tracks[0].title.length > 50
                                ? result.tracks[0].title.slice(0, 50) + "..."
                                : result.tracks[0].title
                        }](${client.config.ssLink}) By** [ ${
                            result.tracks[0].requester
                        } ]`
                    );
                await updateQueue(message.guild, player.queue);
                return message.reply({ embeds: [embed] });
            }
            
        } catch (error) {
            console.error('Error adding playlist to queue:', error.message);
            message.reply('There was an error adding the playlist. Please try again.');
        }
    },

    playlist: {
        execute: async (client, interaction) => {
            const check = client.manager.players.get(interaction.guild.id);
            if (!check) {
                if (!interaction.member.voice.channel?.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) { return interaction.reply({ content: `${client.emoji.cross} | I don't have permission to join your voice channel!`, ephemeral: true }); }
                if (!interaction.member.voice.channel?.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) { return interaction.reply({ content: `${client.emoji.cross} | I don't have permission to speak in your voice channel!`, ephemeral: true }); }
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) { return interaction.reply({ content: `You don't have enough Permissions!`, ephemeral: true }); }
            }

            const url = interaction.options.getString('url');
            const query = url;

            const { channel } = interaction.member.voice;

            if (!isValidUrl(url)) { return interaction.reply('Please provide a valid URL.'); }

            try {
                await interaction.deferReply();

                let player = await client.manager.createPlayer({
                    guildId: interaction.guild.id,
                    textId: interaction.channel.id,
                    voiceId: channel.id,
                    volume: 100,
                    deaf: true,
                    shardId: interaction.guild.shardId,
                });

                let result = await client.manager.search(query, {
                    requester: interaction.author,
                });

                if (!result.tracks.length) {
                    const embed = new EmbedBuilder()
                        .setDescription(
                            "<:cross:1301129244855763027> | No results found!"
                        )
                        .setColor(client.color);
                        await interaction.reply({ embeds: [embed] });
                }

                if (result.type === "PLAYLIST") for (let track of result.tracks) player.queue.add(track);
                else player.queue.add(result.tracks[0]);

                if (!player.playing && !player.paused) { await player.play(); }

                await updateQueue(interaction.guild, player.queue);

                if (result.type === "PLAYLIST") {
                    const embed = new EmbedBuilder()
                        .setDescription(
                            `<:queue:1301124133379244072> | **Queued** ${result.tracks.length} **from [${result.playlistName}](${client.config.ssLink})**`
                        )
                        .setColor(client.color);
                    await updateQueue(interaction.guild, player.queue);
                    await interaction.followUp({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `<:queue:1301124133379244072> | **Queued [${
                                result.tracks[0].title.length > 50
                                    ? result.tracks[0].title.slice(0, 50) + "..."
                                    : result.tracks[0].title
                            }](${client.config.ssLink}) By** [ ${
                                result.tracks[0].requester
                            } ]`
                        );
                    await updateQueue(interaction.guild, player.queue);
                    await interaction.followUp({ embeds: [embed] });
                }
                
            } catch (error) {
                console.error('Error adding playlist to queue:', error);
                interaction.reply('There was an error adding the playlist. Please try again.');
            }
        },
    }
};