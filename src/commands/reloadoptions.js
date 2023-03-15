const {
    SlashCommandBuilder
} = require('discord.js');
const {
    notConnectedToRcon
} = require('../helper');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("reloadoptions")
        .setDescription("Reload server options (ServerOptions.ini) and send to clients.")
        ,
    async execute(interaction, rconConnection, timers, log) {

        cmd.reloadoptions(rconConnection);
    },
};