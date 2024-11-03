const Badge = require("../../models/BadgeSchema"); // Adjust path as needed

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
    name: "add-badge",
    aliases: ["addbadge", "addbdg"],
    description: "Add a badge to a user",
    category: "Badges",
    ownerOnly: true, // Only authorized users can use this command
    run: async (client, message, args) => {
        const member = message.mentions.users.first();
        const badge = args[1];

        if (!member || !badge) {
            return message.channel.send(`${client.emoji.cross} | Please mention a user and specify a badge.`);
        }

        const badgeList = Object.keys(badgeEmojiMap);

        if (!badgeList.includes(badge)) {
            return message.channel.send(`Invalid badge. Available badges: ${badgeList.join(", ")}`);
        }

        let userBadges = await Badge.findOne({ userId: member.id });

        const emojiBadge = `${badgeEmojiMap[badge]}・${badge}`;

        if (!userBadges) {
            userBadges = new Badge({ userId: member.id, badges: [emojiBadge] });
        } else if (userBadges.badges.includes(emojiBadge)) {
            return message.channel.send(`${client.emoji.cross} | User already has this badge.`);
        } else {
            userBadges.badges.push(emojiBadge);
        }

        await userBadges.save();
        return message.channel.send(`${client.emoji.tick} | Badge **${emojiBadge}** has been added to **${member.tag}**.`);
    }
};
