const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("chopper")
        .setDescription("Place a helicopter event on a random player.")
        ,
    async execute(interaction, rconConnection, timers, log) {
        cmd.chopper(rconConnection);
    },
};