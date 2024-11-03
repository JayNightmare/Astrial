const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandFolders = fs.readdirSync(path.join(__dirname, '../commands'));

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${folder}`)).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`);
        if (command.name && command.description) {
            commands.push({
                name: command.name,
                description: command.description,
                options: command.options || [], // Add any options if you have them
            });
        }
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
