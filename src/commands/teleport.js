const {
    SlashCommandBuilder
} = require('discord.js');
const {
    notConnectedToRcon
} = require('../helper');

const cmd = require('../pzcommands');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("teleport")
        .setDescription("Teleport player1 to player2. Once teleported, wait for the map to appear.")
        .addStringOption(option => option.setName("player1").setDescription("Enter player to teleport").setRequired(true))
        .addStringOption(option => option.setName("player2").setDescription("Enter player to teleport to").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log ) {
        const p1 = interaction.options.getString('player1');
        const p2 = interaction.options.getString('player2');
        
        cmd.teleport(rconConnection, p1, p2);
    },
};