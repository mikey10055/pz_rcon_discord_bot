const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("gunshot")
        .setDescription("Place a gunshot sound on a random player.")
        ,
    async execute(interaction, rconConnection, timers, log) {
        cmd.gunshot(rconConnection);
    },
};