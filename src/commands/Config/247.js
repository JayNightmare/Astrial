const {
  Message,
  PermissionFlagsBits,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const reconnectAuto = require("../../models/reconnect.js");

const commandName = "alwaysInVC";
const commandDescription = "24/7 in voice channel";

module.exports = {
  name: commandName,
  aliases: ["247"],
  description: commandDescription,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.Speak,
  cooldowns: 5,
  category: "Config",
  inVc: true,
  sameVc: true,
  voteOnly: false,
  premium: false,

  // //

  run: async (client, message, args, prefix) => {
    if (
      !message.member.voice.channel
        .permissionsFor(message.guild.members.me)
        .has(PermissionsBitField.Flags.ViewChannel)
    )
      return message.channel.send(
        `${client.emoji.cross} | I don't have permission to view your voice channel!`
      );

    if (
      !message.member.voice.channel
        .permissionsFor(message.guild.members.me)
        .has(PermissionsBitField.Flags.Connect)
    )
      return message.channel.send(
        `${client.emoji.cross} | I don't have permission to join your voice channel!`
      );

    if (
      !message.member.voice.channel
        .permissionsFor(message.guild.members.me)
        .has(PermissionsBitField.Flags.Speak)
    )
      return message.reply(
        `${client.emoji.cross} | I don't have permission to speak in your voice channel!`
      );

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
      return message.channel.send(`You don't have enough Permissions !!`);
    try {
      const data = await reconnectAuto.findOne({ GuildId: message.guild.id });
      if (data) {
        await reconnectAuto.findOneAndDelete({ GuildId: message.guild.id });
        const embed = new EmbedBuilder()
          .setDescription(
            `**${client.emoji.disable} | 24/7 Mode Has Been Disabled**`
          )
          .setColor(client.color);
        return message.channel.send({ embeds: [embed] });
      }
      await reconnectAuto.create({
        GuildId: message.guild.id,
        TextId: message.channel.id,
        VoiceId: message.member.voice.channel.id,
      });
      await client.manager.createPlayer({
        guildId: message.guild.id,
        textId: message.channel.id,
        voiceId: message.member.voice.channel.id,
        volume: 100,
        deaf: true,
        shardId: message.guild.shardId,
      });
      const embed = new EmbedBuilder()
        .setDescription(
          `**${client.emoji.enable} | 24/7 Mode Has Been Enabled**`
        )
        .setColor(client.color);

      message.channel.send({ embeds: [embed] });
    } catch (e) {
      console.log(e);
      message.channel.send(`**An Error Occurred**`);
    }
  },

  alwaysInVC: {
    execute: async (client, interaction) => {
      if (!interaction.member.voice.channel?.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) {
        return interaction.reply({ content: `${client.emoji.cross} | I don't have permission to join your voice channel!`, ephemeral: true });
      }

      if (!interaction.member.voice.channel?.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) {
        return interaction.reply({ content: `${client.emoji.cross} | I don't have permission to speak in your voice channel!`, ephemeral: true });
      }
      
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        return interaction.reply({ content: `You don't have enough Permissions!`, ephemeral: true });
      }

      try {
        const data = await reconnectAuto.findOne({ GuildId: interaction.guild.id });
        if (data) {
          await reconnectAuto.findOneAndDelete({ GuildId: interaction.guild.id });
          const embed = new EmbedBuilder()
            .setDescription(`**${client.emoji.disable} | 24/7 Mode Has Been Disabled**`)
            .setColor(client.color);
          return interaction.reply({ embeds: [embed] });
        }
        await reconnectAuto.create({
          GuildId: interaction.guild.id,
          TextId: interaction.channel.id,
          VoiceId: interaction.member.voice.channel.id,
        });
        await client.manager.createPlayer({
          guildId: interaction.guild.id,
          textId: interaction.channel.id,
          voiceId: interaction.member.voice.channel.id,
          volume: 100,
          deaf: true,
          shardId: interaction.guild.shardId,
        });
        const embed = new EmbedBuilder()
          .setDescription(`**${client.emoji.enable} | 24/7 Mode Has Been Enabled**`)
          .setColor(client.color);
      
        interaction.reply({ embeds: [embed] });
      } catch (e) {
        console.log(e);
        interaction.reply({ content: `**An Error Occurred**`, ephemeral: true });
      }
    }
  }
};
