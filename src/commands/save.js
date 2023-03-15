const {
    SlashCommandBuilder
} = require('discord.js');
const { notConnectedToRcon } = require('../helper');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("save")
        .setDescription("Save the current world.")
        ,
    async execute(interaction, rconConnection, timers, log) {

            cmd.save(rconConnection);
    },
};