const MainClient = require("./structure/client");
require("dotenv").config();

// //

const { setupCommands } = require('./utils-functions/utils-slash-commands/setupCommands.js');

// //

const client = new MainClient();
const wait = require("wait");
(async () => {
  await client.ConnectMongo();
  //await wait(3000);
  console.log(client);
  // await setupCommands(client);
  await client.loadEvents();
  await client.loadUtils();
  await client.connect();
})();

module.exports = client;
