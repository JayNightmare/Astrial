const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const moment = require('moment');
const os = require("os");

module.exports = {
    name: "bi",
    aliases: ["botinfo", "stats", "st", "status", "stat"],
    description: "Get Bot Real stats !!",
    category: "Info",
    cooldown: 5,

    run: async (client, message, args, prefix) => {
        // Fetching real-time stats
        const botPing = client.ws.ping.toFixed(2);
        const botChannels = client.channels.cache.size;

        // Check if the bot is sharded
        let botGuilds;
        if (client.shard && client.shard.count > 1) {
            botGuilds = await client.shard.fetchClientValues('guilds.cache.size')
                .then(results => results.reduce((acc, count) => acc + count, 0));
        } else {
            botGuilds = client.guilds.cache.size;
        }
        const usersCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString();

        // Memory and CPU stats
        const ramUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
        const totalMemoryGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        const freeMemoryGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        const cpuModel = os.cpus()[0].model;
        const cpuSpeed = os.cpus()[0].speed + ' MHz';
        const platform = os.platform();
        const arch = os.arch();

        // Uptime calculation
        const uptime = process.uptime();
        const uptimeDisplay = moment.duration(uptime, 'seconds').humanize();

        const botCreatedOn = moment.utc(client.user.createdTimestamp).format("MMMM Do YYYY, h:mm:ss a");

        // Button generator
        const createButton = (label, style, customId, disabled = false) => {
            return new ButtonBuilder()
                .setLabel(label)
                .setStyle(style)
                .setCustomId(customId)
                .setDisabled(disabled);
        };

        // Creating action rows for buttons
        const createActionRows = () => {
            return [
                new ActionRowBuilder()
                    .addComponents(
                        createButton("General", ButtonStyle.Success, "first", true),
                        createButton("System", ButtonStyle.Secondary, "second"),
                        createButton("Team", ButtonStyle.Secondary, "third"),
                        createButton("Affiliated", ButtonStyle.Primary, "affiliated") // New button
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        createButton("General", ButtonStyle.Secondary, "first"),
                        createButton("System", ButtonStyle.Success, "second", true),
                        createButton("Team", ButtonStyle.Secondary, "third"),
                        createButton("Affiliated", ButtonStyle.Primary, "affiliated") // New button
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        createButton("General", ButtonStyle.Secondary, "first"),
                        createButton("System", ButtonStyle.Secondary, "second"),
                        createButton("Team", ButtonStyle.Success, "third"),
                        createButton("Affiliated", ButtonStyle.Primary, "affiliated") // New button
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        createButton("General", ButtonStyle.Danger, "first", true),
                        createButton("System", ButtonStyle.Danger, "second", true),
                        createButton("Team", ButtonStyle.Danger, "third", true),
                        createButton("Affiliated", ButtonStyle.Danger, "affiliated", true) // Disabled button
                    ),
            ];
        };

        // Embed generator
        const createEmbed = (fields, title) => {
            return new EmbedBuilder()
                .setColor(client.color) // Set the color to client.color
                .setTitle(title || "Bot Information")
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .addFields(fields)
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();
        };

        // Creating embeds for each category
        const embed1 = createEmbed([
            { name: "__Bot Information__", value: `**Bot Tag**: ${client.user.tag}\n**Bot Version**: v1.0.0\n**Created On**: ${botCreatedOn}\n**Discord.js**: v14.16.3\n**Servers**: ${botGuilds.toLocaleString()} servers\n**Users**: ${usersCount}\n**Channels**: ${botChannels.toLocaleString()}\n**Uptime**: ${uptimeDisplay}\n**WS Ping**: ${botPing}ms` },
        ], "General Bot Information");

        const embed2 = createEmbed([
            { name: "__System Information__", value: `**Platform**: ${platform}\n**Architecture**: ${arch}\n**CPU Model**: ${cpuModel}\n**CPU Speed**: ${cpuSpeed}\n**RAM Usage**: ${ramUsage} MB / ${totalMemoryGB}\n**Free Memory**: ${freeMemoryGB}` },
        ], "System Information");

        const embed3 = createEmbed([
            { name: "**__Developers__**", value: `**1.** [Sumant Rajan](https://discord.com/users/1203569730385084476) [ID: 1203569730385084476]\n**2.**[Jay](https://discord.com/users/373097473553727488) [ID: 373097473553727488]` },
            { name: "**__Owners__**", value: `**1.** [Zayar](https://discord.com/users/1001872778909204611) [ID: 1001872778909204611]\n**2.** [Noto](https://discord.com/users/728524094580064356) [ID: 728524094580064356]` },
            { name: "**__Supporters__**", value: `**1.** [Harxh](https://discord.com/users/1187983803352891483) [ID: 1187983803352891483]\n**2.** [Dreamtheog](https://discord.com/users/707598085181800498) [ID: 707598085181800498]` },
        ], "Team Information");

        // Sending the initial embed with buttons
        const actionRows = createActionRows();
        const messageComponent = await message.channel.send({ embeds: [embed1], components: [actionRows[0]] });

        // Collector for button interactions
        const collector = messageComponent.createMessageComponentCollector({
            filter: (interaction) => {
                if (message.author.id === interaction.user.id) return true;
                interaction.reply({ content: `❌ | This interaction is not for you.`, ephemeral: true });
                return false;
            },
            time: 600000,
            idle: 300000,
        });

        collector.on("collect", async (interaction) => {
            let embed, buttonRow;

            if (interaction.isButton()) {
                switch (interaction.customId) {
                    case "first":
                        embed = embed1;
                        buttonRow = actionRows[0];
                        break;
                    case "second":
                        embed = embed2;
                        buttonRow = actionRows[1];
                        break;
                    case "third":
                        embed = embed3;
                        buttonRow = actionRows[2];
                        break;
                    case "affiliated":
                        await interaction.reply({
                            content: "We don't have any partners now. If you want to do a partnership, join our [Support Server](https://discord.gg/kSwwUD8RDe).",
                            ephemeral: true,
                        });
                        return;
                }

                await interaction.update({ embeds: [embed], components: [buttonRow] });
            }
        });

        collector.on("end", () => {
            messageComponent.edit({ components: [actionRows[3]] });
        });
    }
};
