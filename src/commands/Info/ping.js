const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["ping"],
  description: "Get Bot Real Ping !!",
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Info",
  cooldown: 5,

  run: async (client, message, args, prefix) => {
    // Code
    const embed = new EmbedBuilder().setColor(client.color)
      .setDescription(`\`\`\`fix
REST Latency: ${Date.now() - message.createdAt}ms
Gateway Latency: ${Math.floor(client.ws.ping)}ms
\`\`\``);

    return message.reply({ embeds: [embed] });
  },
};
