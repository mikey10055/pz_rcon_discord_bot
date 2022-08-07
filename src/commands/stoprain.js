const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("stoprain")
        .setDescription("Stop raining on the server")
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        cmd.stoprain(rconConnection);
    },
};