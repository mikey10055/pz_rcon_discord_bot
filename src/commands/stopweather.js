const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("stopweather")
        .setDescription("Stop weather on the server.")
        ,
    async execute(interaction, rconConnection, timers, log) {
        cmd.stopweather(rconConnection);
    },
};