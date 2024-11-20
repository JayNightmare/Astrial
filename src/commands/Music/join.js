const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join the bot to your voice channel."),
  cooldown: 5,
  inVc: true,
  sameVc: true,
  premium: false,
  dj: true,
  async execute(interaction, client) {
    // Check if the member is in a voice channel
    const member = interaction.member;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content: `<:cross:1301129244855763027> | You need to be in a voice channel to use this command!`,
        ephemeral: true,
      });
    }

    // Check for permissions
    const botPermissions = voiceChannel.permissionsFor(interaction.guild.members.me);

    if (!botPermissions.has(PermissionsBitField.Flags.ViewChannel)) {
      return interaction.reply({
        content: `<:cross:1301129244855763027> | I don't have permission to view your voice channel!`,
        ephemeral: true,
      });
    }

    if (!botPermissions.has(PermissionsBitField.Flags.Connect)) {
      return interaction.reply({
        content: `<:cross:1301129244855763027> | I don't have permission to join your voice channel!`,
        ephemeral: true,
      });
    }

    if (!botPermissions.has(PermissionsBitField.Flags.Speak)) {
      return interaction.reply({
        content: `<:cross:1301129244855763027> | I don't have permission to speak in your voice channel!`,
        ephemeral: true,
      });
    }

    try {
      await client.manager.createPlayer({
        guildId: interaction.guild.id,
        textId: interaction.channel.id,
        voiceId: member.voice.channel.id,
        volume: 100,
        deaf: true,
        shardId: interaction.guild.shardId,
      });

      await interaction.reply({
        content: `<:Correct:1301128918614671403> | Successfully joined your voice channel!`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: `<:cross:1301129244855763027> | An error occurred while trying to join the voice channel.`,
        ephemeral: true,
      });
    }
  },
};
