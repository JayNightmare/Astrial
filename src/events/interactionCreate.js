const { EmbedBuilder, Events } = require("discord.js");

// ! Import command logic

// //

// ? Config
const allDay7Command = require();
const djrole = require();
const prefixCommand = require();
const restrictCommand = require();
const unrestrictCommand = require();
const setupCommand = require();

// //

// ? Filters
// ! A
const threeDCommand = require();
const alienCommand = require();
const ambientCommand = require();
// //
// ! B
const bassCommand = require();
const bassboostCommand = require();
// //
// ! C
const chillCommand = require();
const chinaCommand = require();
const chipmunkCommand = require();
// //
// ! D
const danceCommand = require();
const darthVadeCommand = require();
const dayCoreCommand = require();
const doubleTimeCommand = require();
// //
// ! H
const hauntedCommand = require();
// //
// ! L
const lofiCommand = require();
// //
// ! M
const muffledCommand = require();
// //
// ! N
const nightcoreCommand = require();
// //
// ! R
const resetCommand = require();
// //
// ! S
const slowedCommand = require();
const softCommand = require();
const softFocusCommand = require();
const softGuitarCommand = require();
const spaceCommand = require();
// //
// ! U
const underWaterCommand = require();
// //
// ! W
const warmPadCommand = require();

// ? Info
const helpCommand = require('../commands/Info/help.js');
const avatarCommand = require();
const badgesCommand = require();
const inviteCommand = require();
const pingCommand = require();
const statsCommand = require();
const supportCommand = require();
const uptimeCommand = require();

// ? Music
const autoPlayCommand = require();
const clearCommand = require();
const disconnectCommand =  require();
const joinCommand = require();
const loopCommand = require();
const lyricsCommand = require();
const nowPlayingCommand = require();
const pauseCommand = require();
const playCommand = require();
const queueCommand = require();
const removeCommand = require();
const replayCommand = require();
const resumeCommand = require();
const searchCommand = require();
const seekCommand = require();
const shuffleCommand = require();
const skipCommand = require();
const stopCommand = require();
const volumeCommand = require();

// ? Owner
const addBadgeCommand = require();
const blackListServerCommand = require();
const blackListUserCommand = require();
const dmCommand = require();
const evalCommand = require();
const nodeCommand = require();
const noPrefixCommand = require();
const removeBadgeCommand = require();
const sayCommand = require();
const sccount = require();

// ? Premium
const delPremiumCommand = require();
const noPrefixReqCommand = require();
const premiumCommand = require();
const premiumGuildCommand = require();
const premiumStatusCommand = require();

// //

module.exports = async (client) => {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isCommand() && interaction.componentType !== 3) return;
        const { commandName } = interaction;
    
        // //

        try {
            // ? Help Commands
            // * Help Menu
            if (commandName === 'help') { console.log(`help command ran`); await helpCommand.help.execute(client, interaction); }

            // //
    
            // * Help Menu Interaction
            // if (interaction.customId === 'help_menu') { await helpMenuCommands.help_menu_selected.execute(client, interaction) }
        } catch(err) {
            // Embed message saying error
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('An error occurred while executing your command. Please try again later.')
                .setColor(0xFF0000);
            await interaction.reply({ embeds: [errorEmbed] });
            console.error(`Error executing command ${commandName}:`, err);
        }
    });
}