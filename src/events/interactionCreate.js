const { EmbedBuilder, Events } = require("discord.js");

// ! Import command logic

// //

// ? Config
const allDay7Command = require('../commands/Config/247.js');
const djrole = require('../commands/Config/djrole.js');
const prefixCommand = require('../commands/Config/prefix.js');
const restrictCommand = require('../commands/Config/restrict.js');
const unrestrictCommand = require('../commands/Config/unrestrict.js');
const setupCommand = require('../commands/Config/setup.js');

// //

// ? Filters
// ! A
const threeDCommand = require('../commands/Filters/3d.js');
const alienCommand = require('../commands/Filters/alien.js');
const ambientCommand = require('../commands/Filters/ambient.js');
// //
// ! B
const bassCommand = require('../commands/Filters/bass.js');
const bassboostCommand = require('../commands/Filters/bassboost.js');
// //
// ! C
const chillCommand = require('../commands/Filters/chill.js');
const chinaCommand = require('../commands/Filters/china.js');
const chipmunkCommand = require('../commands/Filters/chipmunk.js');
// //
// ! D
const danceCommand = require('../commands/Filters/dance.js');
const darthVaderCommand = require('../commands/Filters/darthvader.js');
const dayCoreCommand = require('../commands/Filters/daycore.js');
const doubleTimeCommand = require('../commands/Filters/doubletime.js');
// //
// ! H
const hauntedCommand = require('../commands/Filters/haunted.js');
// //
// ! L
const lofiCommand = require('../commands/Filters/lofi.js');
// //
// ! M
const muffledCommand = require('../commands/Filters/muffled.js');
// //
// ! N
const nightcoreCommand = require('../commands/Filters/nightcore.js');
// //
// ! R
const resetCommand = require('../commands/Filters/reset.js');
// //
// ! S
const slowedCommand = require('../commands/Filters/slowed.js');
const softCommand = require('../commands/Filters/soft.js');
const softFocusCommand = require('../commands/Filters/softfocus.js');
const softGuitarCommand = require('../commands/Filters/softguitar.js');
const spaceCommand = require('../commands/Filters/space.js');
// //
// ! U
const underWaterCommand = require('../commands/Filters/underwater.js');
// //
// ! W
const warmPadCommand = require('../commands/Filters/warmpad.js');

// ? Info
const helpCommand = require('../commands/Info/help.js');
const avatarCommand = require('../commands/Info/avatar.js');
const badgesCommand = require('../commands/Info/badges.js');
const inviteCommand = require('../commands/Info/invite.js');
const pingCommand = require('../commands/Info/ping.js');
const statsCommand = require('../commands/Info/stats.js');
const supportCommand = require('../commands/Info/support.js');
const uptimeCommand = require('../commands/Info/uptime.js');

// ? Music
const autoPlayCommand = require('../commands/Music/autoplay.js');
const clearCommand = require('../commands/Music/clear.js');
const disconnectCommand =  require('../commands/Music/disconnect.js');
const joinCommand = require('../commands/Music/join.js');
const loopCommand = require('../commands/Music/loop.js');
const lyricsCommand = require('../commands/Music/lyrics.js');
const nowPlayingCommand = require('../commands/Music/nowplaying.js');
const pauseCommand = require('../commands/Music/pause.js');
const playCommand = require('../commands/Music/play.js');
const playlistCommand = require('../commands/Music/playlist.js');
const queueCommand = require('../commands/Music/queue.js');
const removeCommand = require('../commands/Music/remove.js');
const replayCommand = require('../commands/Music/replay.js');
const resumeCommand = require('../commands/Music/resume.js');
const searchCommand = require('../commands/Music/search.js');
const seekCommand = require('../commands/Music/seek.js');
const shuffleCommand = require('../commands/Music/shuffle.js');
const skipCommand = require('../commands/Music/skip.js');
const stopCommand = require('../commands/Music/stop.js');
const volumeCommand = require('../commands/Music/volume.js');

// ? Owner
const addBadgeCommand = require('../commands/Owner/add-badge.js');
const blackListServerCommand = require('../commands/Owner/blacklistserver.js');
const blackListUserCommand = require('../commands/Owner/blacklistuser.js');
const dmCommand = require('../commands/Owner/dm.js');
const evalCommand = require('../commands/Owner/eval.js');
const nodeCommand = require('../commands/Owner/node.js');
const noPrefixCommand = require('../commands/Owner/noprefix.js');
const removeBadgeCommand = require('../commands/Owner/remove-badge.js');
const sayCommand = require('../commands/Owner/say.js');
const sccount = require('../commands/Owner/sccount.js');

// ? Premium
const delPremiumCommand = require('../commands/Premium/delpremium.js');
const noPrefixReqCommand = require('../commands/Premium/noprefixreq.js');
const premiumCommand = require('../commands/Premium/premium.js');
const premiumGuildCommand = require('../commands/Premium/premiumguild.js');
const premiumStatusCommand = require('../commands/Premium/premiumstatus.js');

// //

module.exports = async (client) => {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isCommand() && interaction.componentType !== 3) return;
        const { commandName } = interaction;
    
        // //

        try {
            // ? Help Command
            // * Help Menu
            if (commandName === 'help') { console.log(`help command ran`); await helpCommand.help.execute(client, interaction); }
            // //
            //  TODO : Config Commands
            if (commandName === '247') { console.log(`24/7 command ran`); await allDay7Command.alwaysInVC.execute(client, interaction); }
            if (commandName === 'dj') { console.log(`dj command ran`); await djrole.djRole.execute(client, interaction); }
            if (commandName === 'view-dj') { console.log(`view dj command ran`); await djrole.viewDjRole.execute(client, interaction); }
            if (commandName === 'prefix') { console.log(`prefix command ran`); await prefixCommand.prefix.execute(client, interaction); }
            if (commandName === 'restrict') { console.log(`restrict command ran`); await restrictCommand.restrict.execute(client, interaction); }
            if (commandName === 'unrestrict') { console.log(`unrestrict command ran`); await unrestrictCommand.unrestrict.execute(client, interaction); }
            // if (commandName === 'setup') { console.log(`setup command ran`); await setupCommand..execute(client, interaction); }
            // //
            // // ? Filter Commands
            // // TODO : Filter Commands
            // // ! A
            // if (commandName === '3d') { console.log(` command ran`); await threeDCommand..execute(client, interaction); }
            // if (commandName === 'alien') { console.log(` command ran`); await alienCommand..execute(client, interaction); }
            // if (commandName === 'ambient') { console.log(` command ran`); await ambientCommand..execute(client, interaction); }
            // // //
            // // ! B
            // if (commandName === 'bass') { console.log(` command ran`); await bassCommand..execute(client, interaction); }
            // if (commandName === 'bass-boost') { console.log(` command ran`); await bassboostCommand..execute(client, interaction); }
            // // //
            // // ! C
            // if (commandName === 'chill') { console.log(` command ran`); await chillCommand..execute(client, interaction); }
            // if (commandName === 'china') { console.log(` command ran`); await chinaCommand..execute(client, interaction); }
            // if (commandName === 'chipmunk') { console.log(` command ran`); await chipmunkCommand..execute(client, interaction); }
            // // //
            // // ! D
            // if (commandName === 'dance') { console.log(` command ran`); await danceCommand..execute(client, interaction); }
            // if (commandName === 'darth-vader') { console.log(` command ran`); await darthVaderCommand..execute(client, interaction); }
            // if (commandName === 'day-core') { console.log(` command ran`); await dayCoreCommand..execute(client, interaction); }
            // if (commandName === 'double-time') { console.log(` command ran`); await doubleTimeCommand..execute(client, interaction); }
            // // //
            // // ! H
            // if (commandName === 'haunted') { console.log(` command ran`); await hauntedCommand..execute(client, interaction); }
            // // //
            // // ! L
            // if (commandName === 'lofi') { console.log(` command ran`); await lofiCommand..execute(client, interaction); }
            // // //
            // // ! M
            // if (commandName === 'muffled') { console.log(` command ran`); await muffledCommand..execute(client, interaction); }
            // // //
            // // ! N
            // if (commandName === 'nightcore') { console.log(` command ran`); await nightcoreCommand..execute(client, interaction); }
            // // //
            // // ! R
            // if (commandName === 'reset') { console.log(` command ran`); await resetCommand..execute(client, interaction); }
            // // //
            // // ! S
            // if (commandName === 'slowed') { console.log(` command ran`); await slowedCommand..execute(client, interaction); }
            // if (commandName === 'soft') { console.log(` command ran`); await softCommand..execute(client, interaction); }
            // if (commandName === 'soft-focus') { console.log(` command ran`); await softFocusCommand..execute(client, interaction); }
            // if (commandName === 'soft-guitar') { console.log(` command ran`); await softGuitarCommand..execute(client, interaction); }
            // if (commandName === 'space') { console.log(` command ran`); await spaceCommand..execute(client, interaction); }
            // // //
            // // ! U
            // if (commandName === 'under-water') { console.log(` command ran`); await underWaterCommand..execute(client, interaction); }
            // // //
            // // ! W
            // if (commandName === 'warm-pad') { console.log(` command ran`); await warmPadCommand..execute(client, interaction); }
            // //
            // ? Info Commands
            // TODO : Info Commands
            // //
            // ? Music Commands
            // TODO : Music Commands
            if (commandName === 'playlist') { console.log(`playlist command ran`); await playlistCommand.playlist.execute(client, interaction); }
            // //
            // ? Owner Commands
            // TODO : Owner Commands
            // //
            // ? Premium Commands
            // TODO : Premium Commands
            // //
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