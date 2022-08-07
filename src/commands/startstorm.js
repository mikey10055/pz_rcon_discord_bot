const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("startstorm")
        .setDescription("Starts a storm on the server. optional duration is in game hours")
        .addIntegerOption(option => option.setName("duration").setDescription("duration is in game hours"))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const duration = interaction.options.getInteger("duration");
        cmd.startrain(rconConnection, duration);
    },
};