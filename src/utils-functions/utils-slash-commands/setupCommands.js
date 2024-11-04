const { SlashCommandBuilder, REST, Routes, PermissionsBitField } = require("discord.js");
require('dotenv').config(); // * Keep me above REST
const rest = new REST({ version: '10' }).setToken(process.env.TEST_TOKEN);

module.exports = async (client) => {
    console.log(process.env.TEST_TOKEN);
    const guilds = await client.guilds.fetch();
    console.log(guilds);
    
    const commands = [
        // //
        /*
            * Author Of Slash Commands:
            * @JayNightmare
        */
        // //
        // ! Help Command
        // * Help Menu Command
        new SlashCommandBuilder()
            .setName('help')
            .setDescription('Display help information for commands'),

        // //

        // ! Config Commands
        // * 24/7 Command
        new SlashCommandBuilder()
            .setName("247")
            .setDescription("24/7 in voice channel")
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

        new SlashCommandBuilder()
            .setName('dj')
            .setDescription('Become the DJ for your server')
            .addStringOption(option =>
                option.setName('option')
                    .setDescription('DJ role for the server')
                    .setRequired(true)
                    .setChoices([
                        { name: 'Add', value: 'add' },
                        { name: 'Remove', value: 'remove' },
                    ])
            ),
        
        new SlashCommandBuilder()
            .setName('prefix')
            .setDescription('Change the prefix for the server')
            .addStringOption(option =>
                option.setName('prefix')
                    .setDescription('New prefix for the server')
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

        new SlashCommandBuilder()
            .setName('restrict')
            .setDescription('Restricts the bot to a specific voice channel')
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('Voice channel to restrict the bot to')
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

        new SlashCommandBuilder()
            .setName('unrestrict')
            .setDescription('Unrestricts the bot from a specific voice channel')
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('Voice channel to unrestrict the bot from')
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

        new SlashCommandBuilder()
            .setName('setup')
            .setDescription('Setup the bot for the server')
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
            // TODO : Add Options
        
        // //

        // ! Filter Commands
        // TODO : Add Commands

        // //

        // ! Info Commands 
        // TODO : Add Commands
        
        // // 

        // ! Music Commands
        // TODO : Add Commands

        // //

        // ! Owner Commands
        // TODO : Add Commands

        // //

        // ! Premium Commands
        // TODO : Add Commands

            // .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
            // .addStringOption(option =>
            //     option.setName('role-name')
            //         .setDescription('Name of the role')
            //         .setRequired(true))
            // .addIntegerOption(option =>
            //     option.setName('required-points')
            //         .setDescription('Points required for the role')
            //         .setRequired(true))
            // .addIntegerOption(option =>
            //     option.setName('required-days')
            //         .setDescription('Days required for the role')
            //         .setRequired(true))
            // .addStringOption(option =>
            //     option.setName('description')
            //         .setDescription('Description of the role')
            //         .setRequired(true)),
    ].map(command => command.toJSON());

    try {
        for (const guild of guilds.values()) {
            try {
                // Call the setup function
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, guild.id),
                    { body: commands },
                )
                console.log(`Successfully registered commands for guild: ${guild.id}`);
            } catch (error) {
                console.error(`Error registering commands for guild: ${guild.id}`, error);
            }
        }
    } catch(err) {
        console.error("Error refreshing application commands:", err);
    }
};