const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("startrain")
        .setDescription("Starts raining on the server. optional intensity is from 1 to 100")
        .addIntegerOption(option => option.setName("intensity").setDescription("intensity is from 1 to 100"))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const intensity = interaction.options.getInteger("intensity");
        cmd.startrain(rconConnection, intensity);
    },
};