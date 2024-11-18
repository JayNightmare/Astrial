const { white, green } = require("chalk");
const { EmbedBuilder, REST, Routes } = require("discord.js");
const reconnectAuto = require("../models/reconnect.js");
const wait = require("wait");
const { AutoPoster } = require("topgg-autoposter");
const fs = require("fs");
const path = require("path");

module.exports = async (client) => {
  client.on("ready", async () => {
    // /*(async () => {
    //   try {
    //     const poster = AutoPoster(`${client.config.topgg_Api}`, client);
    //     const guildCount = await client.cluster.broadcastEval(
    //       (c) => c.guilds.cache.size
    //     );

    //     await poster.postStats({
    //       serverCount: guildCount.reduce((a, b) => a + b, 0),
    //       shardCount: client.cluster.info.TOTAL_SHARDS,
    //     });

    //     poster.on("posted", (stats) => {
    //       console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })();*/
    
    // 247
    await wait(15000);
    const maindata = await reconnectAuto.find();
    console.log(
      `Auto Reconnect found ${
        maindata.length
          ? `${maindata.length} queue${
              maindata.length > 1 ? "s" : ""
            }. Resuming all auto reconnect queues`
          : "0 queues"
      }`,
      "player"
    );
    for (const data of maindata) {
      const text = client.channels.cache.get(data.TextId);
      const guild = client.guilds.cache.get(data.GuildId);
      const voice = client.channels.cache.get(data.VoiceId);
      if (!guild || !text || !voice) continue; // Skip invalid entries

      try {
        await client.manager.createPlayer({
          guildId: guild.id,
          textId: text.id,
          voiceId: voice.id,
          volume: 100,
          deaf: true,
          shardId: guild.shardId,
        });
        console.log(`Joined channel successfully in guild ${guild.name}`);
      } catch (error) {
        console.error(
          `Error joining channel in guild ${guild.name}: ${error.message}`
        );
        // Handle the error here (e.g., logging, retrying, etc.)
      }
    }
    console.log(`Reconnected to ${maindata.length} guilds`);

    console.log(
      white("[") +
        green("INFO") +
        white("] ") +
        green(`${client.user.username} (${client.user.id})`) +
        white(` is Ready!`)
    );
    const activities = [
      `Astrial | ${client.config.prefix}help`,
      `${client.guilds.cache.size} Servers`
    ];
    setInterval(async () => {
      await client.user.setPresence({
        activities: [
          {
            name: `${ activities[Math.floor(Math.random() * activities.length)] }`,
            type: 2,
          },
        ],
        status: "dbd",
      });
    }, 15000);

    const commands = [];
    const commandFolders = fs.readdirSync(
        path.join(__dirname, "../../src/commands")
    );

    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(
                path.join(__dirname, `../../src/commands/${folder}`)
            )
            .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(`../../src/commands/${folder}/${file}`);
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
  });
};
