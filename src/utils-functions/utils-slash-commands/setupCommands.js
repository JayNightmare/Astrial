const { SlashCommandBuilder, REST, Routes, PermissionsBitField } = require("discord.js");
require('dotenv').config(); // * Keep me above REST
const rest = new REST({ version: '10' }).setToken(process.env.TEST_TOKEN);

module.exports = async (client) => {
    if (!client.isReady()) {
        console.log("Client not ready, waiting...");
        await new Promise(resolve => client.once('ready', resolve));
    }

    console.log("Client is ready, proceeding with setup");

    const guilds = await client.guilds.fetch();

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
                    ]))
            .addRoleOption(option =>
                option.setName('role')
                    .setDescription('Role for the DJ')
                    .setRequired(false)
                    // .setAutocomplete(true)
            )
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles),

        // //

        new SlashCommandBuilder()
            .setName('view-dj')
            .setDescription('Become the DJ for your server'),

        // //
        
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
            .addStringOption(option =>
                option.setName('type')
                    .setDescription('Type of restriction')
                    .setRequired(true)
                    .setChoices([
                        { name: 'Text', value: 'text' },
                        { name: 'Voice', value: 'voice' },
                        { name: 'Reset', value: 'reset' },
                    ]))
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('Voice channel to restrict the bot to')
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

        new SlashCommandBuilder()
            .setName('unrestrict')
            .setDescription('Unrestricts the bot from a specific voice channel')
            .addStringOption(option =>
                option.setName('type')
                    .setDescription('Type of restriction')
                    .setRequired(true)
                    .setChoices([
                        { name: 'Text', value: 'text' },
                        { name: 'Voice', value: 'voice' },
                        { name: 'Reset', value: 'reset' },
                    ]))
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('Voice channel to unrestrict the bot from')
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

        new SlashCommandBuilder()
            .setName('setup')
            .setDescription('Setup the bot for the server')
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
            .addStringOption(option => 
                option.setName('type')
                    .setDescription('Create or Delete a setup?')
                    .setRequired(true)
                    .setChoices([
                        { name: 'Create', value: 'create' },
                        { name: 'Delete', value: 'delete' },
                    ]))
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('Provide me a channel send the setup')
                    .setRequired(false)),
        
        // //

        // ! Filter Commands
        // TODO : Add Commands

        // //

        // ! Info Commands
        // TODO : Add Commands
        
        // //

        // ! Music Commands
        // TODO : Add Commands

        // ? Playlist Command
        new SlashCommandBuilder()
            .setName('playlist')
            .setDescription('Create a playlist for the server')
            .addStringOption(option =>
                option.setName('url')
                    .setDescription('URL of the playlist')
                    .setRequired(true)),

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
    console.log('Commands Mapped');

    try {
        console.log('Try to update commands');
        for (const guild of guilds.values()) {
            try {
                // Call the setup function
                console.log('Testing Rest Response');

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