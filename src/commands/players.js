const {
    SlashCommandBuilder
} = require('discord.js');
const {
    notConnectedToRcon
} = require('../helper');

const cmd = require('../pzcommands');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("players")
        .setDescription("List all connected players.")
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
            cmd.players(rconConnection);
    },
};