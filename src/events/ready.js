const { white, green } = require("chalk");
const { EmbedBuilder, REST, Routes } = require("discord.js");
const reconnectAuto = require("../models/reconnect.js");
const wait = require("wait");
const { AutoPoster } = require("topgg-autoposter");
const fs = require("fs");
const path = require("path");

module.exports = async (client) => {
  client.on("ready", async () => {
    console.log(
      white("[") +
        green("INFO") +
        white("] ") +
        green(`${client.user.username} (${client.user.id})`) +
        white(` is Ready!`)
    );

    const rest = new REST({ version: "10" }).setToken(process.env.TEST_TOKEN);

    const commands = [];
    const commandFolders = fs.readdirSync(
      path.join(__dirname, "../../src/commands")
    );

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(path.join(__dirname, `../../src/commands/${folder}`))
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`../../src/commands/${folder}/${file}`);
        if (command.data) {
          commands.push(command.data.toJSON());
        }
      }
    }

    try {
      const guilds = await client.guilds.fetch();
      console.log(`Found ${guilds.size} guilds.`);

      for (const guild of guilds.values()) {
        const existingCommands = await rest.get(
          Routes.applicationGuildCommands(client.user.id, guild.id)
        );

        const newCommandSet = JSON.stringify(commands);
        const existingCommandSet = JSON.stringify(
          existingCommands.map((cmd) => ({
            name: cmd.name,
            description: cmd.description,
            options: cmd.options || [],
          }))
        );

        if (newCommandSet !== existingCommandSet) {
          await rest.put(
            Routes.applicationGuildCommands(client.user.id, guild.id),
            { body: commands }
          );
          console.log(`Updated commands for guild: ${guild.id}`);
        } else {
          console.log(`Commands for guild ${guild.id} are already up to date.`);
        }
      }
    } catch (error) {
      console.error("Error refreshing commands:", error);
    }
  });
};

