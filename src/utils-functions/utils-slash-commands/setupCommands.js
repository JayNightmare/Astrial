const { SlashCommandBuilder, Routes } = require("discord.js");
require('dotenv').config(); // * Keep me above REST
const rest = new REST({ version: '10' }).setToken(process.env.LIVE_TOKEN);

async function setupCommands() {
    const guilds = await client.guilds.fetch();

    const commands = [
        // //
        // ? Rank Commands
        /*
         * Author:
         * @JayNightmare
        */
        // //
        // ! Help
        // * Help Menu Command
        new SlashCommandBuilder()
            .setName('help')
            .setDescription('Display help information for commands')

        // //

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
}

module.exports = { setupCommands };