const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  WebhookClient,
  ButtonStyle,
} = require("discord.js");
const mongoose = require("mongoose");
const { Connectors } = require("shoukaku");
const { Kazagumo, Payload, Plugins } = require("kazagumo");
const spotify = require("kazagumo-spotify");
const fs = require("fs");
const { ClusterClient, getInfo } = require("discord-hybrid-sharding");
const Deezer = require("kazagumo-deezer");
const Apple = require("kazagumo-apple");
const Topgg = require("@top-gg/sdk");
require('dotenv').config(); // * Keep me above REST

// //

class MainClient extends Client {
  constructor() {
    super({
      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
      allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false,
      },
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.config = require("../config/config");
    this.emoji = require("../config/emoji");
    this.color = this.config.color;
    this.invite = this.config.invite;
    this.cluster = new ClusterClient(this);
    this.topgg = new Topgg.Api(`${this.config.topgg_Api}`);
    this.error = new WebhookClient({
      url: `${this.config.error_log}`,
    });

    this.commands = new Collection(); // Add this for slash commands
    this.cooldowns = new Map(); // For managing cooldowns

    // music system

    this.manager = new Kazagumo(
      {
        plugins: [
          new spotify({
            clientId: this.config.spotiId,
            clientSecret: this.config.spotiSecret,
            playlistPageLimit: 1, // optional ( 100 tracks per page )
            albumPageLimit: 1, // optional ( 50 tracks per page )
            searchLimit: 10, // optional ( track search limit. Max 50 )
            searchMarket: "US", // optional || default: US ( Enter the country you live in. [ Can only be of 2 letters. For eg: US, IN, EN ] )//
          }),
          new Plugins.PlayerMoved(this),
          new Deezer({
            playlistLimit: 20,
          }),
          new Apple({
            countryCode: "us", // Default is "us"
            imageWidth: 600, // Default is 600
            imageHeight: 900, // Default is 900
          }),
        ],
        defaultSearchEngine: "youtube",
        // MAKE SURE YOU HAVE THIS
        send: (guildId, payload) => {
          const guild = this.guilds.cache.get(guildId);
          if (guild) guild.shard.send(payload);
        },
      },
      new Connectors.DiscordJS(this),
      this.config.nodes
    );

    this.on("error", (error) => {
      this.error.send(`\`\`\`js\n${error.stack}\`\`\``);
    });
    process.on("unhandledRejection", (error) => console.log(error));
    process.on("uncaughtException", (error) => console.log(error));

    const client = this;

    ["aliases", "mcommands"].forEach((x) => (client[x] = new Collection()));
    ["command", "player", "node"].forEach((x) =>
      require(`../handlers/${x}`)(client)
    );
  }

  async ConnectMongo() {
    console.log("Connecting to Mongo....");
    mongoose.set("strictQuery", true);
    mongoose.connect(this.config.Mongo);
    console.log("MONGO DATABASE CONNECTED");
  }
  async loadEvents() {
    fs.readdirSync("./src/events/").forEach((file) => {
      let eventName = file.split(".")[0];
      require(`${process.cwd()}/src/events/${file}`)(this);
      console.log(`> ${eventName} Events Loaded !!`);
    });
  }1

  async loadSlashCommands() {
    const commandsPath = `${process.cwd()}/src/commands`;
    const commandFiles = fs.readdirSync(commandsPath);
  
    for (const folder of commandFiles) {
      const folderPath = `${commandsPath}/${folder}`;
      if (!fs.statSync(folderPath).isDirectory()) continue;
  
      const files = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".js"));
  
      for (const file of files) {
        const command = require(`${folderPath}/${file}`);
        if (command.data && command.execute) {
          this.commands.set(command.data.name, command); // Store the command
          console.log(`> Loaded slash command: ${command.data.name}`);
        } else {
          console.warn(
            `> Failed to load command ${file}: Missing "data" or "execute".`
          );
        }
      }
    }
  }

  connect() {
    return super.login(this.config.token);
  }
}

module.exports = MainClient;
