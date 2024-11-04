const {
    Message,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const updateQueue = require("../../handlers/setupQueue.js");

module.exports = {
    name: "play",
    aliases: ["p"],
    description: `play a song`,
    category: "Music",
    cooldown: 10,
    inVc: true,
    sameVc: true,
    dj: true,
    premium: false,
    run: async (client, message, args, prefix, track) => {
        const check = client.manager.players.get(message.guild.id);
        if (!check) {
            if (
                !message.member.voice.channel
                    .permissionsFor(message.guild.members.me)
                    .has(PermissionsBitField.Flags.Connect)
            )
                return message.reply(
                    `<:cross:1301129244855763027> | I don't have permission to join your voice channel!`
                );

            if (
                !message.member.voice.channel
                    .permissionsFor(message.guild.members.me)
                    .has(PermissionsBitField.Flags.ViewChannel)
            )
                return message.reply(
                    `<:cross:1301129244855763027> | I don't have permission to view your voice channel!`
                );

            if (
                !message.member.voice.channel
                    .permissionsFor(message.guild.members.me)
                    .has(PermissionsBitField.Flags.Speak)
            )
                return message.reply(
                    `<:cross:1301129244855763027> | I don't have permission to speak in your voice channel!`
                );
        }

        const query = args.join(" ");
        const { channel } = message.member.voice;
        if (!args[0])
            return message.reply(
                `\`\`\`${prefix}play <search query or url>\`\`\``
            );

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

        if (!player.playing && !player.paused) player.play();

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
    },
};
