const Badge = require("../../models/BadgeSchema"); // Adjust path as needed
const { EmbedBuilder } = require('discord.js');

const badgeEmojiMap = {
    "Owner": "<:owner:1301433653959852062>",
    "Developer": "<:developer:1301433659592806410>",
    "Co-Developer": "<:codev:1301433656560062534>",
    "Admin": "<:admin:1301433662339813439>",
    "Supporter": "<:supporter:1301433674838970410>",
    "Mod": "<:mod:1301433680874569749>",
    "Staff": "<:staff:1301433669226987532>",
    "Team": "<:team:1301433694287953941>",
    "Vip": "<:vip:1301433691582631997>",
    "Friend": "<:friend:1301434682457591808>",
    "Bughunter": "<:bughunter:1301433688621580360>",
    "Manager": "<:manager:1301433665993183252>",
    "Special": "<:special:1301433684024360970>",
    "Premuser": "<:prem:1301433696943079497>",
    "User": "<:users:1289408314576470098>"  // Retained the "User" emoji from original code if needed
};

module.exports = {
    name: "profile",
    aliases: ["pr","badges","badge"],
    description: "View user badges",
    category: "Badges",
    ownerOnly: false, // Everyone can view their own badges
    run: async (client, message, args) => {
        const member = message.mentions.users.first() || message.author;

        const userBadges = await Badge.findOne({ userId: member.id });

        const embed = new EmbedBuilder()
            .setTitle(`<:electric_badge:1301435413029978134> **${member.tag}'s Badges** <:electric_badge:1301435413029978134>`)
            .setColor(client.color)
            .setThumbnail(member.displayAvatarURL({ dynamic: true }));

        if (!userBadges || userBadges.badges.length === 0) {
            embed.setDescription("<:cross:1301129244855763027> | This user has no badges. Consider By Joining our [Support Server](https://discord.gg/kSwwUD8RDe) To get Some of The Badges");
        } else {
            const formattedBadges = userBadges.badges.map(badge => {
                const badgeName = badge.replace(/.*・/, ''); // Extract the badge name from the stored string
                return `${badgeEmojiMap[badgeName]}・${badgeName}`;
            });
            embed.setDescription(formattedBadges.join("\n"));
        }

        return message.channel.send({ embeds: [embed] });
    }
};
