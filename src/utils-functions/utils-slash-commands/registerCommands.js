const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

module.exports = async (client) => {
    const commands = [];
    const commandFolders = fs.readdirSync(
        path.join(__dirname, "../../../src/commands")
    );

    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(
                path.join(__dirname, `../../../src/commands/${folder}`)
            )
            .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(`../../../src/commands/${folder}/${file}`);
            // Check if the command is a slash command (has 'data')
            if (command.data) {
                commands.push(command.data.toJSON());
            } else if (command.name && command.description) {
                // Legacy prefix commands with `name` and `description`
                commands.push({
                    name: command.name,
                    description: command.description,
                    options: command.options || [], // Add options if available
                });
            }
        }
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TEST_TOKEN);

    try {
        const guilds = await client.guilds.fetch();

        console.log("Started refreshing application (/) commands.");

        for (const guild of guilds.values()) {
            try {
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, guild.id),
                    { body: commands }
                );
                console.log(`Successfully registered commands for guild: ${guild.id}`);
            } catch (error) {
                console.error(`Error registering commands for guild: ${guild.id}`, error);
            }
        }

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
};
